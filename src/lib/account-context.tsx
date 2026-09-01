/* Account context: the account chosen in search (or from the portfolio) becomes
 * the subject of every stage in the path. Each profile carries its own numbers,
 * signal, owners and narrative substitutions, so the supporting data on every
 * moment — KPIs, charts, evidence, briefings, QBR content — follows it. */

import { createContext, useContext, useMemo, type ReactNode } from "react";

export type AccountId = "acme" | "globex" | "contoso" | "northstar";

export type AccountProfile = {
  id: AccountId;
  name: string;
  short: string;
  segment: string;
  intent: string;
  acv: string;
  renewal: string;
  sponsor: string;
  csm: string;
  tsm: string;
  ae: string;
  /** One-line current situation used in headings and Otto's voice. */
  signal: string;
  headline: string;
  metrics: { label: string; value: string; delta: string; tone: "down" | "flat" | "warn" | "up" }[];
  scorecard: { value: string; label: string }[];
  onPlan: number;
  adoption: {
    labels: string[];
    actual: (number | null)[];
    target: number[];
    projected: (number | null)[];
    divergeIndex: number;
  };
  value: { points: number[]; marks: { i: number; label: string }[] };
  valueMetrics: { value: string; label: string; note: string }[];
  evidence: string[];
  /** Ordered longest-first string substitutions applied to shared story data. */
  subs: [string, string][];
};

const ACME: AccountProfile = {
  id: "acme",
  name: "Acme Corporation",
  short: "Acme",
  segment: "Strategic Account · Q3 2026",
  intent:
    "Achieve enterprise adoption goals and demonstrate measurable business value before the Q4 executive review.",
  acv: "$2.4M",
  renewal: "148 days",
  sponsor: "Robert Hale · COO",
  csm: "Alex Rivera · CSM",
  tsm: "Maya Chen · TSM",
  ae: "Daniel Brooks · AE",
  signal: "Strategic adoption declined 18% in the primary deployment group",
  headline:
    "Three accounts need your attention this week. Acme is the highest priority because strategic adoption has declined ahead of an important customer milestone. Globex has a new executive sponsor, while Contoso reached its adoption goal ahead of schedule.",
  metrics: [
    { label: "Customer Health", value: "82", delta: "↓ 5 points", tone: "down" },
    { label: "Strategic Adoption", value: "68%", delta: "↓ 18%", tone: "down" },
    { label: "Value Realization", value: "74%", delta: "On track", tone: "flat" },
    { label: "Open Risks", value: "1", delta: "Needs attention", tone: "warn" },
  ],
  scorecard: [
    { value: "7", label: "Customer outcomes progressing" },
    { value: "2", label: "Need attention" },
    { value: "1", label: "At risk" },
    { value: "4", label: "Ahead of plan" },
  ],
  onPlan: 72,
  adoption: {
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
    actual: [86, 85, 84, 78, 72, 68, null, null],
    target: [86, 86, 87, 88, 89, 90, 91, 92],
    projected: [null, null, null, null, null, 68, 64, 61],
    divergeIndex: 3,
  },
  value: {
    points: [0.2, 0.5, 0.8, 0.85, 1.1, 1.5, 1.95, 2.4],
    marks: [
      { i: 0, label: "Start of Q3" },
      { i: 2, label: "Adoption decline detected" },
      { i: 3, label: "Recovery initiated" },
      { i: 5, label: "Adoption restored" },
      { i: 6, label: "Success milestone achieved" },
      { i: 7, label: "Customer Value Review" },
    ],
  },
  valueMetrics: [
    { value: "91%", label: "Strategic adoption", note: "Recovered from 68%" },
    { value: "4 / 4", label: "Success milestones", note: "Completed" },
    { value: "0", label: "Critical risks", note: "1 resolved" },
    { value: "3 / 3", label: "Executive goals", note: "On track" },
  ],
  evidence: [
    "Usage declined after a recent configuration change.",
    "Support activity increased during the same period.",
    "Adoption among the strategic deployment group is declining faster than the account average.",
    "Similar behaviour historically preceded delayed adoption milestones.",
  ],
  subs: [],
};

const GLOBEX: AccountProfile = {
  id: "globex",
  name: "Globex Industries",
  short: "Globex",
  segment: "Enterprise Account · Q3 2026",
  intent:
    "Re-align the success plan with a newly appointed executive sponsor and protect the Q4 renewal narrative.",
  acv: "$1.1M",
  renewal: "212 days",
  sponsor: "Priya Raman · VP Service Operations",
  csm: "Alex Rivera · CSM",
  tsm: "Jordan Fee · TSM",
  ae: "Daniel Brooks · AE",
  signal: "A new executive sponsor was appointed in the ITSM organisation",
  headline:
    "Globex is the account in focus. A new executive sponsor was appointed in the ITSM organisation, so the relationship map and two success plan goals need re-alignment before the introduction window closes.",
  metrics: [
    { label: "Customer Health", value: "88", delta: "↑ 2 points", tone: "up" },
    { label: "Strategic Adoption", value: "84%", delta: "Above benchmark", tone: "flat" },
    { label: "Value Realization", value: "69%", delta: "Sponsor re-alignment", tone: "warn" },
    { label: "Open Risks", value: "1", delta: "Relationship coverage", tone: "warn" },
  ],
  scorecard: [
    { value: "6", label: "Customer outcomes progressing" },
    { value: "2", label: "Need re-alignment" },
    { value: "0", label: "At risk" },
    { value: "3", label: "Ahead of plan" },
  ],
  onPlan: 81,
  adoption: {
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
    actual: [77, 79, 80, 82, 83, 84, null, null],
    target: [78, 79, 80, 81, 82, 83, 84, 85],
    projected: [null, null, null, null, null, 84, 85, 86],
    divergeIndex: 3,
  },
  value: {
    points: [0.1, 0.3, 0.5, 0.62, 0.78, 0.9, 1.0, 1.1],
    marks: [
      { i: 0, label: "Start of Q3" },
      { i: 2, label: "Sponsor change detected" },
      { i: 3, label: "Relationship plan rebuilt" },
      { i: 5, label: "New sponsor engaged" },
      { i: 6, label: "Goals re-confirmed" },
      { i: 7, label: "Customer Value Review" },
    ],
  },
  valueMetrics: [
    { value: "84%", label: "Strategic adoption", note: "Above benchmark" },
    { value: "3 / 4", label: "Success milestones", note: "One re-owned" },
    { value: "0", label: "Critical risks", note: "Coverage restored" },
    { value: "2 / 3", label: "Executive goals", note: "Re-confirmed with Priya" },
  ],
  evidence: [
    "Sponsor role change detected in the customer's own org announcements.",
    "Two success plan goals were owned by the previous sponsor.",
    "No executive relationship currently sits above director level.",
    "Accounts with unowned goals historically slip a quarter on value proof.",
  ],
  subs: [
    ["Acme Corporation", "Globex Industries"],
    ["Acme", "Globex"],
    ["Maya Chen", "Jordan Fee"],
    ["Robert Hale", "Priya Raman"],
    ["adoption declined 18%", "the executive sponsor changed"],
    ["Adoption declined 18%", "The executive sponsor changed"],
    ["18% adoption decline", "executive sponsor change"],
    ["Adoption risk detected", "Stakeholder change detected"],
    ["Adoption decline detected", "Sponsor change detected"],
    ["adoption decline", "sponsor change"],
    ["Adoption decline", "Sponsor change"],
    ["18%", "sponsor coverage"],
    ["$2.4M", "$1.1M"],
    ["wave-2 group", "ITSM org"],
    ["wave 2", "ITSM programme"],
    ["Wave 2", "ITSM programme"],
  ],
};

const CONTOSO: AccountProfile = {
  id: "contoso",
  name: "Contoso Group",
  short: "Contoso",
  segment: "Enterprise Account · Q3 2026",
  intent:
    "Capture the 5,000 active agent value moment and set the next automation expansion milestone before renewal.",
  acv: "$860K",
  renewal: "90 days",
  sponsor: "Elena Fischer · CIO",
  csm: "Alex Rivera · CSM",
  tsm: "Sam Okoye · TSM",
  ae: "Daniel Brooks · AE",
  signal: "Adoption target of 5,000 active agents reached two weeks early",
  headline:
    "Contoso is the account in focus. It reached its 5,000 active agent target two weeks early — a value moment worth capturing with the sponsor while the renewal window is open.",
  metrics: [
    { label: "Customer Health", value: "74", delta: "↑ 3 points", tone: "up" },
    { label: "Strategic Adoption", value: "93%", delta: "↑ 11%", tone: "up" },
    { label: "Value Realization", value: "88%", delta: "Ahead of plan", tone: "flat" },
    { label: "Open Risks", value: "2", delta: "Unproven objectives", tone: "warn" },
  ],
  scorecard: [
    { value: "8", label: "Customer outcomes progressing" },
    { value: "1", label: "Need attention" },
    { value: "0", label: "At risk" },
    { value: "5", label: "Ahead of plan" },
  ],
  onPlan: 88,
  adoption: {
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
    actual: [64, 71, 78, 84, 89, 93, null, null],
    target: [66, 70, 74, 78, 82, 86, 88, 90],
    projected: [null, null, null, null, null, 93, 95, 96],
    divergeIndex: 3,
  },
  value: {
    points: [0.1, 0.2, 0.34, 0.45, 0.58, 0.68, 0.78, 0.86],
    marks: [
      { i: 0, label: "Start of Q3" },
      { i: 2, label: "Adoption accelerating" },
      { i: 3, label: "Deflection gains confirmed" },
      { i: 5, label: "5,000 agent target reached" },
      { i: 6, label: "Value moment captured" },
      { i: 7, label: "Customer Value Review" },
    ],
  },
  valueMetrics: [
    { value: "93%", label: "Strategic adoption", note: "Target reached early" },
    { value: "4 / 4", label: "Success milestones", note: "14 days ahead" },
    { value: "2", label: "Unproven objectives", note: "Before renewal" },
    { value: "3 / 3", label: "Executive goals", note: "Evidence linked" },
  ],
  evidence: [
    "5,140 active agents against a 5,000 target.",
    "Case deflection improved 21% in the same window.",
    "Time-to-value of 71 days versus a 90-day benchmark.",
    "Two teams are already ready for the next expansion wave.",
  ],
  subs: [
    ["Acme Corporation", "Contoso Group"],
    ["Acme", "Contoso"],
    ["Maya Chen", "Sam Okoye"],
    ["Robert Hale", "Elena Fischer"],
    ["adoption declined 18%", "the adoption target was reached early"],
    ["Adoption declined 18%", "The adoption target was reached early"],
    ["18% adoption decline", "early adoption milestone"],
    ["Adoption risk detected", "Milestone achieved"],
    ["Adoption decline detected", "Milestone achieved early"],
    ["adoption decline", "milestone acceleration"],
    ["Adoption decline", "Milestone acceleration"],
    ["18%", "11%"],
    ["$2.4M", "$860K"],
    ["wave-2 group", "shared services group"],
    ["wave 2", "automation wave"],
    ["Wave 2", "Automation wave"],
  ],
};

/* Placeholder for the real customer record: replaced at runtime by the profile
 * built from the database record (see customer-record.tsx). Until the record
 * loads, the Acme shape keeps layouts stable. */
const NORTHSTAR_FALLBACK: AccountProfile = { ...ACME, id: "northstar" };

export const ACCOUNT_PROFILES: Record<AccountId, AccountProfile> = {
  acme: ACME,
  globex: GLOBEX,
  contoso: CONTOSO,
  northstar: NORTHSTAR_FALLBACK,
};

export const ACCOUNT_BY_NAME: Record<string, AccountId> = {
  "Acme Corporation": "acme",
  Acme: "acme",
  "Globex Industries": "globex",
  Globex: "globex",
  "Contoso Group": "contoso",
  Contoso: "contoso",
};

const AccountCtx = createContext<AccountProfile>(ACME);

export function AccountProvider({
  account,
  profile: override,
  children,
}: {
  account: AccountId;
  /** Profile built from the live customer record; wins when supplied. */
  profile?: AccountProfile | null;
  children: ReactNode;
}) {
  const profile = override ?? ACCOUNT_PROFILES[account];
  return <AccountCtx.Provider value={profile}>{children}</AccountCtx.Provider>;
}

export function useAccount() {
  return useContext(AccountCtx);
}

/** Rewrite a shared narrative string so it reads for the selected account. */
export function personalizeText(text: string, profile: AccountProfile) {
  return profile.subs.reduce((out, [from, to]) => out.split(from).join(to), text);
}

/** Deep-personalize plain story data (objects, arrays, strings) for an account. */
export function personalizeData<T>(data: T, profile: AccountProfile): T {
  if (profile.subs.length === 0) return data;
  const walk = (v: unknown): unknown => {
    if (typeof v === "string") return personalizeText(v, profile);
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype) {
      return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, walk(val)]));
    }
    return v;
  };
  return walk(data) as T;
}

/** Hook form: memoized per account so renders stay cheap. */
export function useAccountData<T>(data: T): T {
  const profile = useAccount();
  return useMemo(() => personalizeData(data, profile), [data, profile]);
}

/** Personalize object keys as well as values (for name-keyed detail maps). */
export function useAccountKeyedData<T>(data: Record<string, T>): Record<string, T> {
  const profile = useAccount();
  return useMemo(() => {
    if (profile.subs.length === 0) return data;
    return Object.fromEntries(
      Object.entries(data).map(([k, v]) => [
        personalizeText(k, profile),
        personalizeData(v, profile),
      ]),
    );
  }, [data, profile]);
}
