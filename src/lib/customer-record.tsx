/* Client access to the real customer record.
 *
 * One fetch, shared by the Northstar workspace, the QBR story and the three
 * ways to work — so every surface tells the story of the same records. */

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  DEFAULT_CUSTOMER_SLUG,
  getCustomerRecord,
  type CustomerRecord,
} from "./customer.functions";
import type { AccountProfile } from "./account-context";

const RecordCtx = createContext<{ record: CustomerRecord | null; loading: boolean }>({
  record: null,
  loading: false,
});

export function CustomerRecordProvider({
  slug = DEFAULT_CUSTOMER_SLUG,
  children,
}: {
  slug?: string;
  children: ReactNode;
}) {
  const fetchRecord = useServerFn(getCustomerRecord);
  const { data, isLoading } = useQuery({
    queryKey: ["customer-record", slug],
    queryFn: () => fetchRecord({ data: { slug } }),
    staleTime: 5 * 60_000,
  });

  const value = useMemo(
    () => ({ record: data ?? null, loading: isLoading }),
    [data, isLoading],
  );
  return <RecordCtx.Provider value={value}>{children}</RecordCtx.Provider>;
}

export function useCustomerRecord() {
  return useContext(RecordCtx);
}

/* ── Record → shapes the existing experience already renders ── */

/** Headline facts for the persistent customer workspace. */
export function useCustomerFacts() {
  const { record } = useCustomerRecord();
  return useMemo(() => {
    if (!record) return null;
    return {
      name: record.name,
      short: record.shortName,
      segment: record.segment,
      quarter: record.quarter,
      outcome: record.outcome,
      outcomeStatus: record.outcomeStatus,
      progress: record.progress,
      sponsor: record.sponsor ?? "",
      champion: record.champion ?? "",
      blocker: record.blocker ?? "",
      nextMoment: record.nextMoment ?? "",
      healthScore: record.healthScore,
      metrics: record.metrics,
      openCases: record.cases.filter((c) => c.status !== "Resolved"),
      cases: record.cases,
      stakeholders: record.stakeholders,
      qbrSections: record.qbrSections,
      adoption: record.adoption,
      source: `Live record · ${record.name} · ${record.quarter}`,
    };
  }, [record]);
}

const TONES = ["down", "flat", "warn", "up"] as const;
type Tone = (typeof TONES)[number];
const tone = (t: string): Tone => (TONES as readonly string[]).includes(t) ? (t as Tone) : "flat";

/** Build the account profile the shared moments/modes surfaces consume. */
export function accountProfileFromRecord(record: CustomerRecord): AccountProfile {
  const actual = record.adoption.map((a) => a.actual);
  const target = record.adoption.map((a) => a.target ?? 0);
  const projected = record.adoption.map((a) => a.projected);
  const first = actual.find((v) => v != null) ?? 0;
  const last = [...actual].reverse().find((v) => v != null) ?? 0;
  const divergeIndex = Math.max(
    0,
    record.adoption.findIndex(
      (a) => a.actual != null && a.target != null && a.target - a.actual > 4,
    ),
  );

  return {
    id: "northstar",
    name: record.name,
    short: record.shortName,
    segment: record.segment,
    intent: record.outcome,
    acv: record.acv ?? "—",
    renewal: record.renewalWindow ?? "—",
    sponsor: record.sponsor ?? "—",
    csm: "Maya Alvarez · CSM",
    tsm: record.stakeholders.find((s) => /migration|technical/i.test(s.role))?.name
      ? `${record.stakeholders.find((s) => /migration|technical/i.test(s.role))!.name} · TSM`
      : "Priya Raghavan · TSM",
    ae: record.stakeholders.find((s) => /account executive/i.test(s.role))?.name
      ? `${record.stakeholders.find((s) => /account executive/i.test(s.role))!.name} · AE`
      : "Sofia Marchetti · AE",
    signal: `Service request automation usage fell from ${first}% to ${last}% while the ${record.quarter} handling-time commitment stayed unchanged`,
    headline: `${record.name} is the account in focus. ${record.outcome} Progress sits at ${record.progress}% against plan, and ${record.blocker ?? "an open dependency"} is holding the next user group.`,
    metrics: record.metrics.map((m) => ({
      label: m.label,
      value: m.value,
      delta: m.delta,
      tone: tone(m.tone),
    })),
    scorecard: [
      { value: String(record.progress) + "%", label: "Outcome progress against plan" },
      { value: String(record.cases.filter((c) => c.status !== "Resolved").length), label: "Open cases on record" },
      { value: String(record.healthScore), label: "Customer health score" },
      { value: String(record.stakeholders.length), label: "Stakeholders mapped" },
    ],
    onPlan: record.progress,
    adoption: {
      labels: record.adoption.map((a) => a.week),
      actual,
      target,
      projected,
      divergeIndex,
    },
    value: {
      points: record.adoption.map((a, i) => Number((((a.actual ?? a.projected ?? 0) / 100) * (i + 1) * 0.34).toFixed(2))),
      marks: [
        { i: 0, label: `Start of ${record.quarter}` },
        { i: Math.max(1, divergeIndex), label: "Usage diverges from target" },
        { i: Math.max(2, record.adoption.length - 3), label: record.blocker ?? "Dependency open" },
        { i: record.adoption.length - 1, label: record.nextMoment ?? "Business review" },
      ],
    },
    valueMetrics: record.metrics.map((m) => ({
      value: m.value,
      label: m.label,
      note: m.delta,
    })),
    evidence: [
      ...record.cases.map((c) => `${c.reference} · ${c.severity} ${c.status} — ${c.title}`),
      ...record.stakeholders
        .filter((s) => s.recommendation)
        .map((s) => `${s.name}: ${s.recommendation}`),
    ],
    subs: [
      ["Acme Corporation", record.name],
      ["Acme", record.shortName],
      ["Maya Chen", "Priya Raghavan"],
      ["Robert Hale", (record.sponsor ?? "the sponsor").split(",")[0]!],
      ["Alex Rivera", "Maya Alvarez"],
      ["Daniel Brooks", "Sofia Marchetti"],
      ["adoption declined 18%", `automation usage declined to ${last}%`],
      ["Adoption declined 18%", `Automation usage declined to ${last}%`],
      ["18% adoption decline", "service request automation decline"],
      ["18%", "19%"],
      ["$2.4M", record.acv ?? "—"],
      ["wave-2 group", "Wave 2 regional networks"],
      ["wave 2", "Wave 2 migration"],
      ["Wave 2", "Wave 2 migration"],
    ],
  };
}

/** Account profile for the record in context, when it has loaded. */
export function useRecordAccountProfile(): AccountProfile | null {
  const { record } = useCustomerRecord();
  return useMemo(() => (record ? accountProfileFromRecord(record) : null), [record]);
}

/* ── Northstar story surfaces, backed by the record ── */

import {
  ADOPTION_TRAJECTORY,
  NORTHSTAR,
  QBR_STORY,
} from "./northstar-data";

/** The Northstar workspace header facts: record values when loaded. */
export function useNorthstar(): typeof NORTHSTAR & { live: boolean } {
  const { record } = useCustomerRecord();
  return useMemo(() => {
    if (!record) return { ...NORTHSTAR, live: false };
    return {
      name: record.name,
      segment: record.segment,
      quarter: record.quarter,
      outcome: record.outcome,
      outcomeStatus: record.outcomeStatus,
      progress: record.progress,
      sponsor: record.sponsor ?? NORTHSTAR.sponsor,
      champion: record.champion ?? NORTHSTAR.champion,
      nextMoment: record.nextMoment ?? NORTHSTAR.nextMoment,
      blocker: record.blocker ?? NORTHSTAR.blocker,
      live: true,
    };
  }, [record]);
}

/** Adoption trajectory drawn from the recorded weekly actuals. */
export function useAdoptionTrajectory(): { week: string; value: number }[] {
  const { record } = useCustomerRecord();
  return useMemo(() => {
    const weeks = (record?.adoption ?? []).filter((a) => a.actual != null);
    if (weeks.length < 2) return ADOPTION_TRAJECTORY;
    return weeks.map((a) => ({ week: a.week, value: a.actual as number }));
  }, [record]);
}

/** QBR story sections: bodies come from the recorded review narrative. */
export function useQbrStory(): typeof QBR_STORY {
  const { record } = useCustomerRecord();
  return useMemo(() => {
    const rows = record?.qbrSections ?? [];
    if (rows.length === 0) return QBR_STORY;
    return QBR_STORY.map((section, i) => {
      const row = rows[i];
      return row ? { ...section, title: row.heading, body: row.body } : section;
    });
  }, [record]);
}
