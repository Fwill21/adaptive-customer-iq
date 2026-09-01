/* Editing the real customer records that the QBR story and Otto answers read.
 *
 * Reads for the leadership experience stay public (customer.functions.ts).
 * Writes run server-side with the privileged client so the tables themselves
 * remain read-only through the Data API. */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getCustomerRecord, type CustomerRecord } from "./customer.functions";

const MetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  delta: z.string().default(""),
  tone: z.string().default("flat"),
});

const AdoptionSchema = z.object({
  week: z.string().min(1),
  actual: z.number().nullable().default(null),
  target: z.number().nullable().default(null),
  projected: z.number().nullable().default(null),
});

const CaseSchema = z.object({
  reference: z.string().min(1),
  title: z.string().min(1),
  severity: z.string().default("P2"),
  status: z.string().default("Open"),
  workflowArea: z.string().nullable().default(null),
  age: z.string().nullable().default(null),
});

const StakeholderSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  lens: z.string().nullable().default(null),
  engagement: z.string().nullable().default(null),
  recommendation: z.string().nullable().default(null),
});

const SectionSchema = z.object({
  heading: z.string().min(1),
  body: z.string().min(1),
  evidenceSource: z.string().nullable().default(null),
});

const RecordSchema = z.object({
  originalSlug: z.string().min(1).optional(),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only."),
  name: z.string().min(1),
  shortName: z.string().min(1),
  segment: z.string().min(1),
  quarter: z.string().min(1),
  outcome: z.string().min(1),
  outcomeStatus: z.string().min(1),
  progress: z.number().int().min(0).max(100),
  healthScore: z.number().int().min(0).max(100),
  sponsor: z.string().nullable().default(null),
  champion: z.string().nullable().default(null),
  blocker: z.string().nullable().default(null),
  nextMoment: z.string().nullable().default(null),
  acv: z.string().nullable().default(null),
  renewalWindow: z.string().nullable().default(null),
  metrics: z.array(MetricSchema).default([]),
  adoption: z.array(AdoptionSchema).default([]),
  cases: z.array(CaseSchema).default([]),
  stakeholders: z.array(StakeholderSchema).default([]),
  qbrSections: z.array(SectionSchema).default([]),
});

export type EditableRecord = z.infer<typeof RecordSchema>;

export type CustomerSummary = {
  slug: string;
  name: string;
  segment: string;
  quarter: string;
  healthScore: number;
};

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const listCustomerRecords = createServerFn({ method: "GET" }).handler(
  async (): Promise<CustomerSummary[]> => {
    const supabase = await admin();
    const { data, error } = await supabase
      .from("customers")
      .select("slug,name,segment,quarter,health_score")
      .order("name");
    if (error) throw new Error(error.message);
    return (data ?? []).map((c) => ({
      slug: c.slug,
      name: c.name,
      segment: c.segment,
      quarter: c.quarter,
      healthScore: c.health_score,
    }));
  },
);

export const loadCustomerRecordForEdit = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<CustomerRecord | null> => getCustomerRecord({ data }));

export const saveCustomerRecord = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RecordSchema.parse(data))
  .handler(async ({ data }): Promise<{ slug: string }> => {
    const supabase = await admin();
    const lookupSlug = data.originalSlug ?? data.slug;

    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("slug", lookupSlug)
      .maybeSingle();

    const row = {
      slug: data.slug,
      name: data.name,
      short_name: data.shortName,
      segment: data.segment,
      quarter: data.quarter,
      outcome: data.outcome,
      outcome_status: data.outcomeStatus,
      progress: data.progress,
      health_score: data.healthScore,
      sponsor: data.sponsor,
      champion: data.champion,
      blocker: data.blocker,
      next_moment: data.nextMoment,
      acv: data.acv,
      renewal_window: data.renewalWindow,
      updated_at: new Date().toISOString(),
    };

    let customerId = existing?.id ?? null;
    if (customerId) {
      const { error } = await supabase.from("customers").update(row).eq("id", customerId);
      if (error) throw new Error(error.message);
    } else {
      const { data: inserted, error } = await supabase
        .from("customers")
        .insert(row)
        .select("id")
        .single();
      if (error) throw new Error(error.message);
      customerId = inserted.id;
    }

    const id = customerId!;

    // Children are authored as ordered lists, so replace them wholesale.
    await Promise.all([
      supabase.from("customer_metrics").delete().eq("customer_id", id),
      supabase.from("customer_adoption_weeks").delete().eq("customer_id", id),
      supabase.from("customer_cases").delete().eq("customer_id", id),
      supabase.from("customer_stakeholders").delete().eq("customer_id", id),
      supabase.from("customer_qbr_sections").delete().eq("customer_id", id),
    ]);

    const inserts: PromiseLike<{ error: { message: string } | null }>[] = [];

    if (data.metrics.length) {
      inserts.push(
        supabase.from("customer_metrics").insert(
          data.metrics.map((m, i) => ({
            customer_id: id,
            label: m.label,
            value: m.value,
            delta: m.delta,
            tone: m.tone,
            position: i,
          })),
        ),
      );
    }
    if (data.adoption.length) {
      inserts.push(
        supabase.from("customer_adoption_weeks").insert(
          data.adoption.map((a, i) => ({
            customer_id: id,
            week_label: a.week,
            actual: a.actual,
            target: a.target,
            projected: a.projected,
            position: i,
          })),
        ),
      );
    }
    if (data.cases.length) {
      inserts.push(
        supabase.from("customer_cases").insert(
          data.cases.map((c, i) => ({
            customer_id: id,
            reference: c.reference,
            title: c.title,
            severity: c.severity,
            status: c.status,
            workflow_area: c.workflowArea,
            age: c.age,
            position: i,
          })),
        ),
      );
    }
    if (data.stakeholders.length) {
      inserts.push(
        supabase.from("customer_stakeholders").insert(
          data.stakeholders.map((s, i) => ({
            customer_id: id,
            name: s.name,
            role: s.role,
            lens: s.lens,
            engagement: s.engagement,
            recommendation: s.recommendation,
            position: i,
          })),
        ),
      );
    }
    if (data.qbrSections.length) {
      inserts.push(
        supabase.from("customer_qbr_sections").insert(
          data.qbrSections.map((q, i) => ({
            customer_id: id,
            heading: q.heading,
            body: q.body,
            evidence_source: q.evidenceSource,
            position: i,
          })),
        ),
      );
    }

    const results = await Promise.all(inserts);
    const failed = results.find((r) => r.error);
    if (failed?.error) throw new Error(failed.error.message);

    return { slug: data.slug };
  });

export const deleteCustomerRecord = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<{ deleted: string }> => {
    const supabase = await admin();
    const { error } = await supabase.from("customers").delete().eq("slug", data.slug);
    if (error) throw new Error(error.message);
    return { deleted: data.slug };
  });
