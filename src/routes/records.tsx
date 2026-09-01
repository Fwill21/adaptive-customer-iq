import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Plus, Save, Trash2, Loader2, Check } from "lucide-react";
import {
  listCustomerRecords,
  loadCustomerRecordForEdit,
  saveCustomerRecord,
  deleteCustomerRecord,
  type EditableRecord,
} from "@/lib/customer-admin.functions";

const title = "Customer records — CSP on LUX";
const description =
  "Create, edit and remove the real customer records behind the LUX workspace: accounts, adoption metrics, cases, stakeholders and QBR evidence.";

export const Route = createFileRoute("/records")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RecordsPage,
});

/* ── field primitives ── */

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-[14px] outline-none transition-colors focus:border-otto";

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="eyebrow">{label}</span>
      <input
        className={inputCls}
        value={value}
        type={type}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {hint ? <span className="block text-[12px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="eyebrow">{label}</span>
      <textarea
        className={`${inputCls} leading-relaxed`}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Section({
  heading,
  caption,
  onAdd,
  children,
}: {
  heading: string;
  caption: string;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-calm">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[1.1rem] font-semibold tracking-tight">{heading}</h2>
          <p className="text-[13px] text-muted-foreground">{caption}</p>
        </div>
        <button type="button" onClick={onAdd} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-otto hover:text-otto">
          <Plus className="size-4" aria-hidden="true" />
          Add row
        </button>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function RowShell({ onRemove, children }: { onRemove: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-start gap-3">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</div>
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove row"
          className="mt-6 rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

/* ── blank record ── */

const EMPTY: EditableRecord = {
  slug: "",
  name: "",
  shortName: "",
  segment: "Strategic Enterprise",
  quarter: "Q4 FY26",
  outcome: "",
  outcomeStatus: "Unchanged",
  progress: 0,
  healthScore: 70,
  sponsor: "",
  champion: "",
  blocker: "",
  nextMoment: "",
  acv: "",
  renewalWindow: "",
  metrics: [],
  adoption: [],
  cases: [],
  stakeholders: [],
  qbrSections: [],
};

const numOrNull = (v: string) => (v.trim() === "" ? null : Number(v));
const str = (v: string | null | undefined) => v ?? "";
const nullable = (v: string) => (v.trim() === "" ? null : v);

function RecordsPage() {
  const queryClient = useQueryClient();
  const fetchList = useServerFn(listCustomerRecords);
  const fetchRecord = useServerFn(loadCustomerRecordForEdit);
  const save = useServerFn(saveCustomerRecord);
  const remove = useServerFn(deleteCustomerRecord);

  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<EditableRecord | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const list = useQuery({ queryKey: ["admin-customers"], queryFn: () => fetchList({}) });

  useEffect(() => {
    if (selected === null && !draft && list.data?.length) setSelected(list.data[0]!.slug);
  }, [list.data, selected, draft]);

  const record = useQuery({
    queryKey: ["admin-customer", selected],
    queryFn: () => fetchRecord({ data: { slug: selected! } }),
    enabled: !!selected,
  });

  useEffect(() => {
    if (!record.data) return;
    const r = record.data;
    setDraft({
      originalSlug: r.slug,
      slug: r.slug,
      name: r.name,
      shortName: r.shortName,
      segment: r.segment,
      quarter: r.quarter,
      outcome: r.outcome,
      outcomeStatus: r.outcomeStatus,
      progress: r.progress,
      healthScore: r.healthScore,
      sponsor: r.sponsor,
      champion: r.champion,
      blocker: r.blocker,
      nextMoment: r.nextMoment,
      acv: r.acv,
      renewalWindow: r.renewalWindow,
      metrics: r.metrics,
      adoption: r.adoption,
      cases: r.cases,
      stakeholders: r.stakeholders,
      qbrSections: r.qbrSections,
    });
  }, [record.data]);

  const patch = (p: Partial<EditableRecord>) =>
    setDraft((d) => (d ? { ...d, ...p } : d));

  const saveMutation = useMutation({
    mutationFn: (payload: EditableRecord) => save({ data: payload }),
    onSuccess: async (res) => {
      setError(null);
      setStatus(`Saved · every LUX surface now reads these values`);
      setSelected(res.slug);
      await queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      await queryClient.invalidateQueries({ queryKey: ["admin-customer"] });
      await queryClient.invalidateQueries({ queryKey: ["customer-record"] });
    },
    onError: (e: unknown) => {
      setStatus(null);
      setError(e instanceof Error ? e.message : "Could not save this record.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => remove({ data: { slug } }),
    onSuccess: async () => {
      setDraft(null);
      setSelected(null);
      setStatus("Record deleted");
      await queryClient.invalidateQueries({ queryKey: ["admin-customers"] });
      await queryClient.invalidateQueries({ queryKey: ["customer-record"] });
    },
    onError: (e: unknown) =>
      setError(e instanceof Error ? e.message : "Could not delete this record."),
  });

  const summaries = useMemo(() => list.data ?? [], [list.data]);

  return (
    <main className="min-h-screen bg-background px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to the experience
          </Link>
          <h1 className="text-[2rem] font-semibold tracking-tight">Customer records</h1>
          <p className="max-w-3xl text-[15px] leading-relaxed text-muted-foreground">
            These are the records the workspace, the QBR story and Otto's live answers read from.
            Edit them here and the demo stays accurate — nothing in the experience is invented.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* record list */}
          <aside className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Accounts</span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:border-otto hover:text-otto"
                onClick={() => {
                  setSelected(null);
                  setDraft({ ...EMPTY });
                  setStatus(null);
                  setError(null);
                }}
              >
                <Plus className="size-4" aria-hidden="true" />
                New
              </button>
            </div>
            {list.isLoading ? (
              <p className="text-[13px] text-muted-foreground">Loading records…</p>
            ) : null}
            <ul className="space-y-2">
              {summaries.map((c) => (
                <li key={c.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(c.slug);
                      setStatus(null);
                      setError(null);
                    }}
                    className={`w-full rounded-xl border p-3 text-left transition-colors ${
                      selected === c.slug
                        ? "border-otto bg-surface"
                        : "border-border bg-surface hover:border-otto/50"
                    }`}
                  >
                    <span className="block text-[14px] font-medium">{c.name}</span>
                    <span className="block text-[12px] text-muted-foreground">
                      {c.segment} · {c.quarter} · health {c.healthScore}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* editor */}
          <div className="space-y-6">
            {status ? (
              <p className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-[13px]">
                <Check className="size-4 text-otto" aria-hidden="true" />
                {status}
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="rounded-xl border border-destructive/40 bg-surface px-4 py-3 text-[13px] text-destructive">
                {error}
              </p>
            ) : null}

            {!draft ? (
              <p className="rounded-2xl border border-border bg-surface p-6 text-[14px] text-muted-foreground">
                Select an account on the left, or create a new one.
              </p>
            ) : (
              <>
                <section className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-calm">
                  <h2 className="text-[1.1rem] font-semibold tracking-tight">Account</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      label="Record id (slug)"
                      value={draft.slug}
                      onChange={(v) => patch({ slug: v })}
                      placeholder="northstar-health"
                      hint="Lowercase letters, numbers and dashes."
                    />
                    <Field label="Name" value={draft.name} onChange={(v) => patch({ name: v })} />
                    <Field
                      label="Short name"
                      value={draft.shortName}
                      onChange={(v) => patch({ shortName: v })}
                    />
                    <Field
                      label="Segment"
                      value={draft.segment}
                      onChange={(v) => patch({ segment: v })}
                    />
                    <Field
                      label="Quarter"
                      value={draft.quarter}
                      onChange={(v) => patch({ quarter: v })}
                    />
                    <Field
                      label="Outcome status"
                      value={draft.outcomeStatus}
                      onChange={(v) => patch({ outcomeStatus: v })}
                    />
                    <Field
                      label="Progress against plan (%)"
                      type="number"
                      value={String(draft.progress)}
                      onChange={(v) => patch({ progress: Number(v || 0) })}
                    />
                    <Field
                      label="Health score"
                      type="number"
                      value={String(draft.healthScore)}
                      onChange={(v) => patch({ healthScore: Number(v || 0) })}
                    />
                    <Field
                      label="Executive sponsor"
                      value={str(draft.sponsor)}
                      onChange={(v) => patch({ sponsor: nullable(v) })}
                    />
                    <Field
                      label="Champion"
                      value={str(draft.champion)}
                      onChange={(v) => patch({ champion: nullable(v) })}
                    />
                    <Field
                      label="ACV"
                      value={str(draft.acv)}
                      onChange={(v) => patch({ acv: nullable(v) })}
                    />
                    <Field
                      label="Renewal window"
                      value={str(draft.renewalWindow)}
                      onChange={(v) => patch({ renewalWindow: nullable(v) })}
                    />
                  </div>
                  <Area
                    label="Committed outcome"
                    value={draft.outcome}
                    onChange={(v) => patch({ outcome: v })}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Area
                      label="Known blocker"
                      value={str(draft.blocker)}
                      onChange={(v) => patch({ blocker: nullable(v) })}
                      rows={2}
                    />
                    <Area
                      label="Next moment"
                      value={str(draft.nextMoment)}
                      onChange={(v) => patch({ nextMoment: nullable(v) })}
                      rows={2}
                    />
                  </div>
                </section>

                <Section
                  heading="Headline metrics"
                  caption="Shown as KPIs across the workspace and the QBR."
                  onAdd={() =>
                    patch({
                      metrics: [
                        ...draft.metrics,
                        { label: "", value: "", delta: "", tone: "flat" },
                      ],
                    })
                  }
                >
                  {draft.metrics.map((m, i) => (
                    <RowShell
                      key={i}
                      onRemove={() =>
                        patch({ metrics: draft.metrics.filter((_, j) => j !== i) })
                      }
                    >
                      <Field
                        label="Label"
                        value={m.label}
                        onChange={(v) =>
                          patch({
                            metrics: draft.metrics.map((x, j) =>
                              j === i ? { ...x, label: v } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Value"
                        value={m.value}
                        onChange={(v) =>
                          patch({
                            metrics: draft.metrics.map((x, j) =>
                              j === i ? { ...x, value: v } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Delta"
                        value={m.delta}
                        onChange={(v) =>
                          patch({
                            metrics: draft.metrics.map((x, j) =>
                              j === i ? { ...x, delta: v } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Tone (up / down / flat)"
                        value={m.tone}
                        onChange={(v) =>
                          patch({
                            metrics: draft.metrics.map((x, j) =>
                              j === i ? { ...x, tone: v } : x,
                            ),
                          })
                        }
                      />
                    </RowShell>
                  ))}
                </Section>

                <Section
                  heading="Adoption trajectory"
                  caption="One row per week: actual, target and projected usage."
                  onAdd={() =>
                    patch({
                      adoption: [
                        ...draft.adoption,
                        { week: "", actual: null, target: null, projected: null },
                      ],
                    })
                  }
                >
                  {draft.adoption.map((a, i) => (
                    <RowShell
                      key={i}
                      onRemove={() =>
                        patch({ adoption: draft.adoption.filter((_, j) => j !== i) })
                      }
                    >
                      <Field
                        label="Week label"
                        value={a.week}
                        onChange={(v) =>
                          patch({
                            adoption: draft.adoption.map((x, j) =>
                              j === i ? { ...x, week: v } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Actual"
                        type="number"
                        value={a.actual === null ? "" : String(a.actual)}
                        onChange={(v) =>
                          patch({
                            adoption: draft.adoption.map((x, j) =>
                              j === i ? { ...x, actual: numOrNull(v) } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Target"
                        type="number"
                        value={a.target === null ? "" : String(a.target)}
                        onChange={(v) =>
                          patch({
                            adoption: draft.adoption.map((x, j) =>
                              j === i ? { ...x, target: numOrNull(v) } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Projected"
                        type="number"
                        value={a.projected === null ? "" : String(a.projected)}
                        onChange={(v) =>
                          patch({
                            adoption: draft.adoption.map((x, j) =>
                              j === i ? { ...x, projected: numOrNull(v) } : x,
                            ),
                          })
                        }
                      />
                    </RowShell>
                  ))}
                </Section>

                <Section
                  heading="Evidence · cases"
                  caption="The case records Otto cites when it explains what changed."
                  onAdd={() =>
                    patch({
                      cases: [
                        ...draft.cases,
                        {
                          reference: "",
                          title: "",
                          severity: "P2",
                          status: "Open",
                          workflowArea: null,
                          age: null,
                        },
                      ],
                    })
                  }
                >
                  {draft.cases.map((c, i) => (
                    <RowShell
                      key={i}
                      onRemove={() => patch({ cases: draft.cases.filter((_, j) => j !== i) })}
                    >
                      <Field
                        label="Reference"
                        value={c.reference}
                        onChange={(v) =>
                          patch({
                            cases: draft.cases.map((x, j) =>
                              j === i ? { ...x, reference: v } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Title"
                        value={c.title}
                        onChange={(v) =>
                          patch({
                            cases: draft.cases.map((x, j) => (j === i ? { ...x, title: v } : x)),
                          })
                        }
                      />
                      <Field
                        label="Severity"
                        value={c.severity}
                        onChange={(v) =>
                          patch({
                            cases: draft.cases.map((x, j) =>
                              j === i ? { ...x, severity: v } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Status"
                        value={c.status}
                        onChange={(v) =>
                          patch({
                            cases: draft.cases.map((x, j) => (j === i ? { ...x, status: v } : x)),
                          })
                        }
                      />
                      <Field
                        label="Workflow area"
                        value={str(c.workflowArea)}
                        onChange={(v) =>
                          patch({
                            cases: draft.cases.map((x, j) =>
                              j === i ? { ...x, workflowArea: nullable(v) } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Age"
                        value={str(c.age)}
                        onChange={(v) =>
                          patch({
                            cases: draft.cases.map((x, j) =>
                              j === i ? { ...x, age: nullable(v) } : x,
                            ),
                          })
                        }
                      />
                    </RowShell>
                  ))}
                </Section>

                <Section
                  heading="Stakeholders"
                  caption="Who is in the room, what they care about, what Otto recommends."
                  onAdd={() =>
                    patch({
                      stakeholders: [
                        ...draft.stakeholders,
                        {
                          name: "",
                          role: "",
                          lens: null,
                          engagement: null,
                          recommendation: null,
                        },
                      ],
                    })
                  }
                >
                  {draft.stakeholders.map((s, i) => (
                    <RowShell
                      key={i}
                      onRemove={() =>
                        patch({ stakeholders: draft.stakeholders.filter((_, j) => j !== i) })
                      }
                    >
                      <Field
                        label="Name"
                        value={s.name}
                        onChange={(v) =>
                          patch({
                            stakeholders: draft.stakeholders.map((x, j) =>
                              j === i ? { ...x, name: v } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Role"
                        value={s.role}
                        onChange={(v) =>
                          patch({
                            stakeholders: draft.stakeholders.map((x, j) =>
                              j === i ? { ...x, role: v } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Lens"
                        value={str(s.lens)}
                        onChange={(v) =>
                          patch({
                            stakeholders: draft.stakeholders.map((x, j) =>
                              j === i ? { ...x, lens: nullable(v) } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Engagement"
                        value={str(s.engagement)}
                        onChange={(v) =>
                          patch({
                            stakeholders: draft.stakeholders.map((x, j) =>
                              j === i ? { ...x, engagement: nullable(v) } : x,
                            ),
                          })
                        }
                      />
                      <Field
                        label="Recommendation"
                        value={str(s.recommendation)}
                        onChange={(v) =>
                          patch({
                            stakeholders: draft.stakeholders.map((x, j) =>
                              j === i ? { ...x, recommendation: nullable(v) } : x,
                            ),
                          })
                        }
                      />
                    </RowShell>
                  ))}
                </Section>

                <Section
                  heading="QBR narrative"
                  caption="The story sections Otto assembles for the customer conversation."
                  onAdd={() =>
                    patch({
                      qbrSections: [
                        ...draft.qbrSections,
                        { heading: "", body: "", evidenceSource: null },
                      ],
                    })
                  }
                >
                  {draft.qbrSections.map((q, i) => (
                    <div key={i} className="rounded-xl border border-border bg-background p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-3">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Field
                              label="Heading"
                              value={q.heading}
                              onChange={(v) =>
                                patch({
                                  qbrSections: draft.qbrSections.map((x, j) =>
                                    j === i ? { ...x, heading: v } : x,
                                  ),
                                })
                              }
                            />
                            <Field
                              label="Evidence source"
                              value={str(q.evidenceSource)}
                              onChange={(v) =>
                                patch({
                                  qbrSections: draft.qbrSections.map((x, j) =>
                                    j === i ? { ...x, evidenceSource: nullable(v) } : x,
                                  ),
                                })
                              }
                            />
                          </div>
                          <Area
                            label="Body"
                            value={q.body}
                            onChange={(v) =>
                              patch({
                                qbrSections: draft.qbrSections.map((x, j) =>
                                  j === i ? { ...x, body: v } : x,
                                ),
                              })
                            }
                          />
                        </div>
                        <button
                          type="button"
                          aria-label="Remove section"
                          onClick={() =>
                            patch({
                              qbrSections: draft.qbrSections.filter((_, j) => j !== i),
                            })
                          }
                          className="mt-6 rounded-full border border-border p-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  ))}
                </Section>

                <div className="flex flex-wrap items-center gap-3 pb-10">
                  <button
                    type="button"
                    disabled={saveMutation.isPending}
                    onClick={() => saveMutation.mutate(draft)}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-calm transition-transform hover:-translate-y-px disabled:opacity-60"
                  >
                    {saveMutation.isPending ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Save className="size-4" aria-hidden="true" />
                    )}
                    Save record
                  </button>
                  {draft.originalSlug ? (
                    <button
                      type="button"
                      disabled={deleteMutation.isPending}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete ${draft.name} and all of its metrics, cases and evidence?`,
                          )
                        ) {
                          deleteMutation.mutate(draft.originalSlug!);
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-destructive transition-colors hover:border-destructive disabled:opacity-60"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Delete record
                    </button>
                  ) : null}
                  {record.isLoading ? (
                    <span className="text-[13px] text-muted-foreground">Loading record…</span>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
