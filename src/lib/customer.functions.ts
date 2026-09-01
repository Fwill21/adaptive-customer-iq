/* Real customer records: the Northstar workspace, the QBR story and the three
 * ways to work all read the same rows from the database instead of an invented
 * scenario. Reads are public (read-only leadership experience), so they go
 * through a server-side publishable client. */

import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

export type CustomerRecord = {
  slug: string;
  name: string;
  shortName: string;
  segment: string;
  quarter: string;
  outcome: string;
  outcomeStatus: string;
  progress: number;
  healthScore: number;
  sponsor: string | null;
  champion: string | null;
  blocker: string | null;
  nextMoment: string | null;
  acv: string | null;
  renewalWindow: string | null;
  metrics: { label: string; value: string; delta: string; tone: string }[];
  adoption: { week: string; actual: number | null; target: number | null; projected: number | null }[];
  cases: {
    reference: string;
    title: string;
    severity: string;
    status: string;
    workflowArea: string | null;
    age: string | null;
  }[];
  stakeholders: {
    name: string;
    role: string;
    lens: string | null;
    engagement: string | null;
    recommendation: string | null;
  }[];
  qbrSections: { heading: string; body: string; evidenceSource: string | null }[];
};

export const DEFAULT_CUSTOMER_SLUG = "northstar-health";

function serverClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

const SlugInput = z.object({ slug: z.string().min(1).default(DEFAULT_CUSTOMER_SLUG) });

export const getCustomerRecord = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => SlugInput.parse(data ?? {}))
  .handler(async ({ data }): Promise<CustomerRecord | null> => {
    const supabase = serverClient();

    const { data: customer, error } = await supabase
      .from("customers")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!customer) return null;

    const [metrics, adoption, cases, stakeholders, sections] = await Promise.all([
      supabase
        .from("customer_metrics")
        .select("label,value,delta,tone,position")
        .eq("customer_id", customer.id)
        .order("position"),
      supabase
        .from("customer_adoption_weeks")
        .select("week_label,actual,target,projected,position")
        .eq("customer_id", customer.id)
        .order("position"),
      supabase
        .from("customer_cases")
        .select("reference,title,severity,status,workflow_area,age,position")
        .eq("customer_id", customer.id)
        .order("position"),
      supabase
        .from("customer_stakeholders")
        .select("name,role,lens,engagement,recommendation,position")
        .eq("customer_id", customer.id)
        .order("position"),
      supabase
        .from("customer_qbr_sections")
        .select("heading,body,evidence_source,position")
        .eq("customer_id", customer.id)
        .order("position"),
    ]);

    const num = (v: unknown) => (v === null || v === undefined ? null : Number(v));

    return {
      slug: customer.slug,
      name: customer.name,
      shortName: customer.short_name,
      segment: customer.segment,
      quarter: customer.quarter,
      outcome: customer.outcome,
      outcomeStatus: customer.outcome_status,
      progress: customer.progress,
      healthScore: customer.health_score,
      sponsor: customer.sponsor,
      champion: customer.champion,
      blocker: customer.blocker,
      nextMoment: customer.next_moment,
      acv: customer.acv,
      renewalWindow: customer.renewal_window,
      metrics: (metrics.data ?? []).map((m) => ({
        label: m.label,
        value: m.value,
        delta: m.delta,
        tone: m.tone,
      })),
      adoption: (adoption.data ?? []).map((a) => ({
        week: a.week_label,
        actual: num(a.actual),
        target: num(a.target),
        projected: num(a.projected),
      })),
      cases: (cases.data ?? []).map((c) => ({
        reference: c.reference,
        title: c.title,
        severity: c.severity,
        status: c.status,
        workflowArea: c.workflow_area,
        age: c.age,
      })),
      stakeholders: (stakeholders.data ?? []).map((s) => ({
        name: s.name,
        role: s.role,
        lens: s.lens,
        engagement: s.engagement,
        recommendation: s.recommendation,
      })),
      qbrSections: (sections.data ?? []).map((q) => ({
        heading: q.heading,
        body: q.body,
        evidenceSource: q.evidence_source,
      })),
    };
  });

/* ── Meeting mode: Otto answers the customer's live questions ── */

const AskInput = z.object({
  slug: z.string().min(1).default(DEFAULT_CUSTOMER_SLUG),
  question: z.string().min(2).max(600),
});

export type MeetingAnswer = {
  answer: string;
  grounding: string[];
  error?: string;
};

function groundingBrief(record: CustomerRecord) {
  return [
    `Customer: ${record.name} (${record.segment}), ${record.quarter}.`,
    `Committed outcome: ${record.outcome} Status: ${record.outcomeStatus}. Progress against plan: ${record.progress}%. Health score: ${record.healthScore}.`,
    `Executive sponsor: ${record.sponsor ?? "unknown"}. Champion: ${record.champion ?? "unknown"}.`,
    `Known blocker: ${record.blocker ?? "none recorded"}. Next moment: ${record.nextMoment ?? "none recorded"}.`,
    `Metrics: ${record.metrics.map((m) => `${m.label} ${m.value} (${m.delta})`).join("; ")}.`,
    `Adoption by week: ${record.adoption
      .map((a) => `${a.week} actual ${a.actual ?? "—"} / target ${a.target ?? "—"}${a.projected != null ? ` / projected ${a.projected}` : ""}`)
      .join("; ")}.`,
    `Open and recent cases: ${record.cases
      .map((c) => `${c.reference} ${c.severity} ${c.status} — ${c.title} (${c.workflowArea ?? "—"}, ${c.age ?? "—"})`)
      .join("; ")}.`,
    `Stakeholders: ${record.stakeholders
      .map((s) => `${s.name} — ${s.role}${s.engagement ? `, ${s.engagement}` : ""}`)
      .join("; ")}.`,
    `QBR narrative on record: ${record.qbrSections.map((q) => `${q.heading}: ${q.body}`).join(" ")}`,
  ];
}

export const askOttoInMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => AskInput.parse(data))
  .handler(async ({ data }): Promise<MeetingAnswer> => {
    const record = await getCustomerRecord({ data: { slug: data.slug } });
    if (!record) return { answer: "", grounding: [], error: "No customer record found." };

    const facts = groundingBrief(record);
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return { answer: "", grounding: facts, error: "AI is not configured for this workspace." };
    }

    const { generateText } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(apiKey);

    try {
      const { text } = await generateText({
        model: gateway("google/gemini-2.5-flash"),
        system: [
          "You are Otto, the orchestration assistant inside a ServiceNow Customer Success workspace.",
          "You are speaking during a live customer business review. The CSM (Maya Alvarez) types the customer's question and reads your answer in the room.",
          "Answer ONLY from the customer record below. If the record does not contain the answer, say plainly what is not on record and what would be needed to answer it.",
          "Be direct and specific: cite the numbers, case references and stakeholder names from the record. 2-4 short sentences, no bullet lists, no greetings, no hedging filler.",
          "Never invent metrics, dates, commitments or people.",
          "",
          "CUSTOMER RECORD",
          ...facts,
        ].join("\n"),
        prompt: data.question,
      });
      return { answer: text.trim(), grounding: facts };
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI request failed.";
      const status = (error as { statusCode?: number } | null)?.statusCode;
      return {
        answer: "",
        grounding: facts,
        error:
          status === 402
            ? "AI credits are exhausted for this workspace — top up to keep answering live questions."
            : message,
      };
    }
  });
