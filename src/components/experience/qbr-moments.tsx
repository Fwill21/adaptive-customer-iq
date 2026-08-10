import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  QBR_ACTIVITY_RAIL,
  QBR_AGENT_CHAIN,
  QBR_BRIEFING,
  QBR_CAPTURE_CONFIRMED,
  QBR_COACH,
  QBR_CONTRIBUTIONS,
  QBR_COORDINATION_CONFIRMED,
  QBR_DECISIONS_NEEDED,
  QBR_GAPS,
  QBR_INTERPRETED,
  QBR_LIVE_ANSWER,
  QBR_LIVE_OPPORTUNITY,
  QBR_LIVE_QUESTION,
  QBR_MEETING_FOCUS,
  QBR_MEETING_METRICS,
  QBR_NARRATIVE_FLOW,
  QBR_OPEN_COMMITMENT,
  QBR_OUTCOMES,
  QBR_OUTCOME_COUNTS,
  QBR_OUTCOME_DETAILS,
  QBR_READINESS_DETAIL,
  QBR_READINESS_INDICATORS,
  QBR_STORY_ARC,
  Q4_PLAN_DETAIL,
  Q4_PLAN_SUMMARY,
  Q4_PRIORITIES,
  QBR_CLOSING_BEFORE,
  QBR_CLOSING_FUTURE,
  TSM_QBR_CONTEXT,
  TSM_QBR_DETAIL,
  TSM_QBR_REVIEW,
} from "@/lib/qbr-data";
import { AGENTS } from "@/lib/story-data";
import { AgentDots, OttoMark, OttoVoice, PrimaryAction } from "./primitives";
import { ActionButton, DetailDrawer, useDrawer, useInfoDrawer } from "./drawer";
import { agentDetail } from "@/lib/agent-details";
import {
  AdoptionChart,
  Disclosure,
  IntelligenceRail,
  Kpi,
  Meter,
  OttoAsk,
  PageHeading,
  ScoreCard,
  SectionTitle,
  StatusPill,
  Surface,
  ValueChart,
} from "./shell";
import type { Role } from "./moments";
import { ArrowRight, Check } from "lucide-react";

function QbrRail() {
  return <IntelligenceRail items={QBR_ACTIVITY_RAIL} />;
}

/** Circular readiness dial — restrained Horizon treatment. */
function ReadinessDial({ value, projected }: { value: number; projected?: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 128 128" className="size-32 shrink-0" role="img" aria-label={`${value}% QBR ready`}>
        <circle cx="64" cy="64" r={r} fill="none" stroke="var(--color-secondary)" strokeWidth="8" />
        {projected != null && (
          <circle
            cx="64"
            cy="64"
            r={r}
            fill="none"
            stroke="var(--color-otto)"
            strokeOpacity="0.25"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(projected / 100) * c} ${c}`}
            transform="rotate(-90 64 64)"
          />
        )}
        <circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke="var(--color-otto)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * c} ${c}`}
          transform="rotate(-90 64 64)"
        />
      </svg>
      <div>
        <p className="text-[2.6rem] font-semibold leading-none tracking-tight">{value}%</p>
        <p className="mt-2 text-[13px] text-muted-foreground">QBR ready</p>
        {projected != null && (
          <p className="mt-3 text-[13px] text-otto">Projected {projected}% once gaps close</p>
        )}
      </div>
    </div>
  );
}

/* ═════════════════ 01 · QBR Approaching ═════════════════ */

export function QbrApproaching() {
  const drawer = useDrawer();
  return (
    <div className="space-y-6">
      <PageHeading
        title="Acme Corporation"
        meta="Strategic Account · Business Review · Q3 2026"
        intent="Otto surfaced the upcoming business review before it was requested."
      />

      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <div className="space-y-6">
          <Surface className="space-y-7">
            <OttoVoice>Your Acme QBR is in 12 days.</OttoVoice>
            <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Acme is on track for its QBR. Adoption recovered this quarter and all four success
              milestones were completed. The value story is strong, but one outcome still needs
              validation and the new executive sponsor has not confirmed next-quarter priorities.
            </p>

            <div className="border-t border-border pt-7">
              <SectionTitle meta="Continuously maintained">QBR readiness</SectionTitle>
              <div className="mt-6">
                <ReadinessDial value={78} />
              </div>
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-border pt-6 md:grid-cols-5">
                {QBR_READINESS_INDICATORS.map((i) => (
                  <div key={i.label}>
                    <p className="text-[1.4rem] font-semibold leading-none tracking-tight">
                      {i.value}
                    </p>
                    <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground">
                      {i.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <ActionButton
                variant="solid"
                onClick={() => drawer.open("qbr:readiness", QBR_READINESS_DETAIL)}
                done={drawer.isConfirmed("qbr:readiness")}
                doneLabel="Readiness plan accepted"
              >
                Review QBR readiness
              </ActionButton>
              <ActionButton onClick={() => drawer.open("qbr:ask", ASK_ACME_DETAIL)}>
                Ask Otto about Acme
              </ActionButton>
            </div>
          </Surface>

          <Surface>
            <SectionTitle meta="Q3 2026">Strategic adoption this quarter</SectionTitle>
            <div className="mt-6">
              <AdoptionChart />
            </div>
          </Surface>
        </div>

        <QbrRail />
      </div>

      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    </div>
  );
}

const ASK_ACME_DETAIL = {
  title: "Ask Otto about Acme",
  meta: "Continuous customer understanding",
  summary:
    "Otto already holds Acme's goals, outcomes, adoption, value, support activity, stakeholders, commitments, and meeting history.",
  sections: [
    {
      label: "What Otto knows today",
      items: [
        "91% strategic adoption, recovered from 68%",
        "4 of 4 Q3 success milestones completed",
        "$2.4M estimated realized business value",
        "New executive sponsor identified in week 6",
        "Two open commitments across TSM and value owner",
      ],
    },
    {
      label: "What Otto is watching",
      items: [
        "Group B expansion readiness assessment",
        "Unvalidated $420K efficiency outcome",
        "Sponsor priority confirmation for Q4",
      ],
    },
  ],
};

/* ═════════════════ 02 · Build the Story ═════════════════ */

export function QbrBuildStory() {
  const info = useInfoDrawer();
  const drawer = useDrawer();
  return (
    <div className="space-y-6">
      <PageHeading
        title="Acme Q3 Value Story"
        meta="Synthesized from this quarter's customer intelligence"
      />

      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <div className="space-y-6">
          <Surface className="space-y-7">
            <OttoVoice>
              Based on Acme's goals, outcomes, activity, and customer conversations, I recommend
              centering the QBR around three outcomes.
            </OttoVoice>

            <ul className="divide-y divide-border border-y border-border">
              {QBR_OUTCOMES.map((o, i) => (
                <li key={o.title} className="flex flex-wrap items-start justify-between gap-5 py-6">
                  <div className="min-w-0 max-w-md space-y-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      Outcome {i + 1}
                    </p>
                    <p className="text-[15px] font-semibold leading-snug">{o.title}</p>
                    <p className="text-[13px] text-muted-foreground">{o.note}</p>
                    <span className="inline-flex items-center gap-2 text-[12px] text-agent">
                      <AgentDots count={o.agents.length} />
                      {o.agents
                        .map((k) => AGENTS.find((a) => a.key === k)!.name)
                        .join(" · ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-5">
                    <p className="text-[1.75rem] font-semibold leading-none tracking-tight">
                      {o.metric}
                    </p>
                    <ActionButton
                      onClick={() => drawer.open(`outcome:${o.title}`, QBR_OUTCOME_DETAILS[o.title]!)}
                      done={drawer.isConfirmed(`outcome:${o.title}`)}
                      doneLabel="In narrative"
                    >
                      Review evidence
                    </ActionButton>
                  </div>
                </li>
              ))}
            </ul>
          </Surface>

          <Surface className="space-y-6">
            <SectionTitle meta="Same intelligence as Quarter in Motion">
              The story behind the numbers
            </SectionTitle>
            <ol className="space-y-3">
              {QBR_STORY_ARC.map((s, i) => (
                <li key={s.label}>
                  <button
                    type="button"
                    onClick={() =>
                      info.open(`arc:${s.label}`, {
                        title: s.label,
                        meta: "Value story arc · Q3 2026",
                        summary: s.body,
                        sections: [
                          { label: "Where this came from", items: [s.link] },
                          {
                            label: "Evidence Otto attached",
                            items: [
                              "Product telemetry for the affected workflows",
                              "Deployment and configuration change history",
                              "Outcome records linked to Acme's committed objectives",
                            ],
                          },
                        ],
                        confirm: "Keep this in the customer narrative",
                      })
                    }
                    className="block w-full rounded-xl border border-border bg-background px-5 py-4 text-left transition-colors hover:border-otto/40"
                  >
                    <span className="eyebrow">{s.label}</span>
                    <p className="mt-1.5 text-[15px] leading-snug">{s.body}</p>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-otto">
                      {s.link}
                    </p>
                  </button>
                  {i < QBR_STORY_ARC.length - 1 && (
                    <p className="py-1.5 text-center text-muted-foreground" aria-hidden="true">
                      ↓
                    </p>
                  )}
                </li>
              ))}
            </ol>
            {info.node}
            <p className="border-t border-border pt-5 text-[13px] text-muted-foreground">
              The QBR is not a separate history. It synthesizes the same customer intelligence
              accumulated throughout the quarter.
            </p>
          </Surface>

          <Surface>
            <SectionTitle meta="Q3 2026">Value realized this quarter</SectionTitle>
            <div className="mt-6">
              <ValueChart />
            </div>
          </Surface>
        </div>

        <QbrRail />
      </div>

      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    </div>
  );
}

/* ═════════════════ 03 · Close the Gaps ═════════════════ */

export function QbrCloseGaps() {
  const drawer = useDrawer();
  const closed = QBR_GAPS.filter((g) => drawer.isConfirmed(`gap:${g.key}`)).length;
  const readiness = 78 + closed * 9;

  return (
    <div className="space-y-6">
      <PageHeading
        title="Before this QBR is ready"
        meta="Acme Corporation · QBR readiness"
        intent="Otto understands not only what it knows, but what is still missing."
      />

      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <div className="space-y-6">
          {QBR_GAPS.map((g) => (
            <Surface key={g.key} className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 max-w-xl">
                  <span className="eyebrow text-signal">Gap</span>
                  <h2 className="mt-2 text-[1.2rem] font-semibold leading-snug tracking-tight">
                    {g.title}
                  </h2>
                  <p className="mt-1.5 text-[15px] font-semibold">{g.headline}</p>
                </div>
                <StatusPill tone={drawer.isConfirmed(`gap:${g.key}`) ? "positive" : "attention"}>
                  {drawer.isConfirmed(`gap:${g.key}`) ? g.doneLabel : "Open"}
                </StatusPill>
              </div>

              <dl className="grid gap-5 border-y border-border py-5 md:grid-cols-3">
                {[
                  ["Why it matters", g.why],
                  ["Who can resolve it", g.who],
                  ["Evidence needed", g.evidence],
                ].map(([label, body]) => (
                  <div key={label}>
                    <dt className="eyebrow">{label}</dt>
                    <dd className="mt-2 text-[14px] leading-snug">{body}</dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="flex max-w-xl gap-3 text-[14px] leading-snug">
                  <span className="mt-0.5 shrink-0 text-otto">
                    <OttoMark size={16} />
                  </span>
                  {g.recommendation}
                </p>
                <ActionButton
                  variant="solid"
                  onClick={() => drawer.open(`gap:${g.key}`, g.detail)}
                  done={drawer.isConfirmed(`gap:${g.key}`)}
                  doneLabel={g.doneLabel}
                >
                  {g.cta}
                </ActionButton>
              </div>
            </Surface>
          ))}

          <Surface className="space-y-4">
            <SectionTitle meta="Monitored by Otto">Open commitment</SectionTitle>
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
              <div>
                <p className="text-[15px] font-semibold">{QBR_OPEN_COMMITMENT.title}</p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  Owner: {QBR_OPEN_COMMITMENT.owner} · Due: {QBR_OPEN_COMMITMENT.due}
                </p>
              </div>
              <StatusPill tone="quiet">{QBR_OPEN_COMMITMENT.status}</StatusPill>
            </div>
          </Surface>
        </div>

        <div className="space-y-6">
          <Surface className="space-y-6">
            <SectionTitle meta="Live">QBR readiness</SectionTitle>
            <ReadinessDial value={readiness} projected={96} />
            <div className="border-t border-border pt-5">
              <Meter value={readiness} label="Evidence and contributions complete" />
              <p className="mt-4 text-[13px] text-muted-foreground">
                78% → projected 96% when these gaps are closed.
              </p>
            </div>
          </Surface>
          <QbrRail />
        </div>
      </div>

      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    </div>
  );
}

/* ═════════════════ 04 · Coordinate the Team ═════════════════ */

export function QbrCoordinate({ role }: { role: Role }) {
  const info = useInfoDrawer();
  const [state, setState] = useState<"idle" | "working" | "done">("idle");
  if (role === "TSM") return <TsmQbrContribution />;

  const start = () => {
    setState("working");
    window.setTimeout(() => setState("done"), 1400);
  };

  return (
    <div className="space-y-6">
      <PageHeading title="Acme QBR preparation" meta="Cross-functional contributions" />

      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <div className="space-y-6">
          <Surface className="space-y-7">
            <div>
              <span className="eyebrow text-otto">Orchestration</span>
              <h2 className="mt-2 text-[1.45rem] font-semibold leading-snug tracking-tight">
                Otto recommends a coordinated QBR response
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                Three contributions will strengthen the QBR. I can prepare the context, coordinate
                the requests, and monitor completion.
              </p>
            </div>

            <ul className="divide-y divide-border border-y border-border">
              {QBR_CONTRIBUTIONS.map((c) => (
                <li key={c.title} className="flex flex-wrap items-start justify-between gap-4 py-5">
                  <button
                    type="button"
                    onClick={() =>
                      info.open(`contribution:${c.title}`, {
                        title: c.title,
                        meta: `${c.owner} · ${c.status}`,
                        summary: c.detail,
                        sections: [
                          {
                            label: "Context Otto prepared",
                            items: [
                              "Relevant quarter history already attached — nothing to re-gather",
                              "Framed for the QBR audience, not as an internal task",
                              "Visible to the whole account team in one shared context",
                            ],
                          },
                          {
                            label: "What is asked of the human",
                            items: [
                              "Review and confirm the framing",
                              "Add judgment Otto cannot infer",
                            ],
                          },
                        ],
                        confirm: "Confirm this contribution",
                      })
                    }
                    className="min-w-0 max-w-xl space-y-1.5 text-left"
                  >
                    <p className="text-[15px] font-semibold hover:text-otto">{c.title}</p>
                    <p className="text-[13px] text-muted-foreground">{c.owner}</p>
                    <p className="text-[14px] leading-snug">{c.detail}</p>
                  </button>
                  <StatusPill
                    tone={
                      c.status === "Context ready"
                        ? "positive"
                        : c.status === "Confirmation required"
                          ? "attention"
                          : "quiet"
                    }
                  >
                    {c.status}
                  </StatusPill>
                </li>
              ))}
            </ul>

            {info.node}
            {state === "idle" && (
              <PrimaryAction onClick={start}>
                Coordinate QBR preparation <ArrowRight className="size-4" aria-hidden="true" />
              </PrimaryAction>
            )}
            {state === "working" && (
              <p className="soft-in flex items-center gap-3 text-[14px] text-muted-foreground">
                <span
                  className="size-1.5 rounded-full bg-otto"
                  style={{ animation: "breathe 1.2s ease-in-out infinite" }}
                />
                Otto is preparing context and coordinating the requested contributions…
              </p>
            )}
            {state === "done" && (
              <ul className="rise space-y-2.5">
                {QBR_COORDINATION_CONFIRMED.map((c, i) => (
                  <li
                    key={c}
                    className="rise flex items-center gap-3 text-[14px]"
                    style={{ animationDelay: `${i * 110}ms` }}
                  >
                    <Check className="size-4 shrink-0 text-otto" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </Surface>
        </div>

        <QbrRail />
      </div>
    </div>
  );
}

function TsmQbrContribution() {
  const drawer = useDrawer();
  return (
    <div className="space-y-6">
      <PageHeading
        title="Acme QBR Contribution"
        meta="Maya Chen · TSM · Technical Success"
        intent="Alex is preparing Acme's Q3 Business Review."
      />

      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <div className="space-y-6">
          <Surface className="space-y-7">
            <div>
              <span className="eyebrow text-otto">What Otto needs from you</span>
              <p className="mt-3 max-w-2xl text-[16px] leading-relaxed">
                Confirm whether adoption recovery is sustainable and whether two additional business
                units are technically ready to expand.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 border-y border-border py-6 md:grid-cols-4">
              {TSM_QBR_CONTEXT.map((c) => (
                <Kpi key={c.label} value={c.value} label={c.label} />
              ))}
            </div>

            <div>
              <SectionTitle meta="Otto">Recommended review</SectionTitle>
              <ul className="mt-4 divide-y divide-border border-t border-border">
                {TSM_QBR_REVIEW.map((r) => (
                  <li key={r} className="py-3.5 text-[15px]">
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <ActionButton
              variant="solid"
              onClick={() => drawer.open("tsm:qbr", TSM_QBR_DETAIL)}
              done={drawer.isConfirmed("tsm:qbr")}
              doneLabel="Contribution submitted"
            >
              Review and contribute
            </ActionButton>

            <p className="border-t border-border pt-5 text-[13px] font-medium">
              Same customer. Same intelligence. Different responsibility.
            </p>
          </Surface>
        </div>

        <QbrRail />
      </div>

      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    </div>
  );
}

/* ═════════════════ 05 · Prepare Me ═════════════════ */

export function QbrPrepareMe({ role }: { role: Role }) {
  const info = useInfoDrawer();
  const drawer = useDrawer();
  const [coach, setCoach] = useState<string[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  if (role === "TSM") return <TsmQbrContribution />;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <div className="space-y-6">
          <Surface className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <span className="eyebrow text-otto">Workflow awareness</span>
                <h1 className="mt-2 text-[1.6rem] font-semibold leading-tight tracking-tight">
                  Your Acme QBR is ready
                </h1>
                <p className="mt-2 text-[14px] text-muted-foreground">
                  All critical evidence and team contributions are available.
                </p>
              </div>
              <ReadinessDial value={96} />
            </div>
          </Surface>

          <div className="flex justify-end">
            <p className="rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-[14px] text-primary-foreground">
              Prepare me for the Acme QBR.
            </p>
          </div>

          <Surface className="space-y-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-5">
              <h2 className="text-[1.45rem] font-semibold tracking-tight">QBR Executive Briefing</h2>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-otto">
                Prepared by Otto
              </span>
            </div>

            <dl className="divide-y divide-border">
              {QBR_BRIEFING.map(([label, body]) => (
                <div key={label} className="grid gap-1 py-4 md:grid-cols-[14rem_1fr] md:gap-6">
                  <dt className="eyebrow">{label}</dt>
                  <dd className="text-[15px] leading-snug">{body}</dd>
                </div>
              ))}
            </dl>

            <div className="rounded-2xl border border-otto/25 bg-otto-soft px-6 py-6">
              <span className="eyebrow text-otto">What we need from this QBR</span>
              <ol className="mt-4 space-y-3">
                {QBR_DECISIONS_NEEDED.map((d, i) => (
                  <li key={d}>
                    <button
                      type="button"
                      onClick={() =>
                        info.open(`decision-needed:${d}`, {
                          title: "Decision the QBR should produce",
                          meta: `Priority ${i + 1} · Acme Corporation`,
                          summary: d,
                          sections: [
                            {
                              label: "Why this decision now",
                              items: [
                                "Q3 evidence makes the trade-off clear enough to decide",
                                "Delaying it pushes value realization into Q4",
                                "The sponsor has the authority to close it in the room",
                              ],
                            },
                            {
                              label: "How Otto supports it",
                              items: [
                                "Supporting evidence prepared and ready to show",
                                "Likely objections anticipated with responses",
                                "Outcome captured automatically once agreed",
                              ],
                            },
                          ],
                          confirm: "Put this on the QBR agenda",
                        })
                      }
                      className="flex w-full gap-4 text-left text-[15px] leading-snug hover:text-otto"
                    >
                      <span className="font-mono text-[12px] text-otto">{i + 1}</span>
                      {d}
                    </button>
                  </li>
                ))}
              </ol>
              {info.node}
              <p className="mt-5 border-t border-otto/20 pt-4 text-[13px] text-muted-foreground">
                Otto plans for the decisions the meeting should produce, not only the content it
                should present.
              </p>
            </div>
          </Surface>

          <Surface className="space-y-5">
            <SectionTitle meta="Grounded in Acme's context">Be ready for these questions</SectionTitle>
            <ul className="space-y-3">
              {QBR_COACH.map((q) => {
                const open = coach.includes(q.question);
                return (
                  <li key={q.question} className="rounded-xl border border-border bg-background">
                    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                      <p className="text-[15px] leading-snug">“{q.question}”</p>
                      <ActionButton
                        onClick={() => setCoach((c) => (open ? c : [...c, q.question]))}
                        done={open}
                        doneLabel="Response ready"
                      >
                        Prepare response
                      </ActionButton>
                    </div>
                    {open && (
                      <div className="soft-in space-y-4 border-t border-border px-5 py-4">
                        <div className="flex gap-3">
                          <span className="mt-0.5 shrink-0 text-otto">
                            <OttoMark size={16} />
                          </span>
                          <div className="space-y-2">
                            {q.answer.map((a) => (
                              <p key={a} className="text-[14px] leading-relaxed">
                                {a}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <ActionButton
                            onClick={() =>
                              drawer.open(`coach:${q.question}`, {
                                title: q.question,
                                meta: "Supporting evidence",
                                sections: q.evidence,
                              })
                            }
                          >
                            Show supporting evidence
                          </ActionButton>
                          <ActionButton
                            onClick={() => setNotes((n) => [...n, q.question])}
                            done={notes.includes(q.question)}
                            doneLabel="Added to QBR notes"
                          >
                            Add to QBR notes
                          </ActionButton>
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </Surface>
        </div>

        <QbrRail />
      </div>

      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    </div>
  );
}

/* ═════════════════ 06 · Lead the QBR (meeting mode) ═════════════════ */

export function QbrMeetingMode() {
  const drawer = useDrawer();
  const [asked, setAsked] = useState(false);

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Customer Success · Q3 2026
        </p>
        <h1 className="mt-4 text-balance text-[2rem] font-semibold leading-tight tracking-tight md:text-[2.4rem]">
          Acme Q3 Business Review
        </h1>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {QBR_MEETING_FOCUS.map((f) => (
            <span
              key={f}
              className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[12px]"
            >
              {f}
            </span>
          ))}
        </div>
      </header>

      <Surface className="p-8 md:p-10">
        <span className="eyebrow">Q3 outcomes</span>
        <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-4">
          {QBR_MEETING_METRICS.map((m) => (
            <div key={m.label}>
              <p className="text-[2rem] font-semibold leading-none tracking-tight">{m.value}</p>
              <p className="mt-2 text-[13px] leading-snug text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </Surface>

      <ol className="space-y-3">
        {QBR_NARRATIVE_FLOW.map((s, i) => (
          <li key={s.title}>
            <Surface className="p-6 md:p-7">
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-[1.15rem] font-semibold leading-snug tracking-tight">
                {s.title}
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{s.body}</p>
            </Surface>
            {i < QBR_NARRATIVE_FLOW.length - 1 && (
              <p className="py-1.5 text-center text-muted-foreground" aria-hidden="true">
                ↓
              </p>
            )}
          </li>
        ))}
      </ol>

      <Surface className="space-y-5">
        <div>
          <span className="eyebrow">Live in the room</span>
          <p className="mt-2 text-[1.05rem] font-medium leading-snug">“{QBR_LIVE_QUESTION}”</p>
        </div>
        {!asked ? (
          <ActionButton onClick={() => setAsked(true)}>Ask Otto</ActionButton>
        ) : (
          <div className="soft-in space-y-5">
            <div className="flex gap-3">
              <span className="mt-0.5 shrink-0 text-otto">
                <OttoMark size={16} />
              </span>
              <p className="text-[15px] leading-relaxed">{QBR_LIVE_ANSWER}</p>
            </div>
            <ActionButton
              variant="solid"
              onClick={() => drawer.open("qbr:live", QBR_LIVE_OPPORTUNITY)}
              done={drawer.isConfirmed("qbr:live")}
              doneLabel="Added to Q4 plan"
            >
              Explore opportunity
            </ActionButton>
          </div>
        )}
      </Surface>

      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    </div>
  );
}

/* ═════════════════ 07 · Capture Outcomes ═════════════════ */

export function QbrCaptureOutcomes() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeading
        title="QBR outcomes captured"
        meta="Acme Corporation · Aug 21, 2026"
        intent="Otto interpreted the conversation into structured customer understanding."
      />

      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <div className="space-y-6">
          <Surface>
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-5">
              {QBR_OUTCOME_COUNTS.map((c) => (
                <div key={c.label}>
                  <p className="text-[1.6rem] font-semibold leading-none tracking-tight">
                    {c.value}
                  </p>
                  <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground">{c.label}</p>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="space-y-6">
            <SectionTitle meta="Interpreted, not transcribed">What Otto understood</SectionTitle>
            <ul className="divide-y divide-border border-t border-border">
              {QBR_INTERPRETED.map((o) => (
                <li key={o.body} className="space-y-1.5 py-5">
                  <span className="eyebrow text-otto">{o.kind}</span>
                  <p className="text-[15px] leading-snug">{o.body}</p>
                  <p className="text-[13px] text-muted-foreground">{o.meta}</p>
                </li>
              ))}
            </ul>

            {!confirmed ? (
              <PrimaryAction onClick={() => setConfirmed(true)}>
                Confirm outcomes <ArrowRight className="size-4" aria-hidden="true" />
              </PrimaryAction>
            ) : (
              <ul className="rise space-y-2.5 border-t border-border pt-5">
                {QBR_CAPTURE_CONFIRMED.map((c, i) => (
                  <li
                    key={c}
                    className="rise flex items-center gap-3 text-[14px]"
                    style={{ animationDelay: `${i * 110}ms` }}
                  >
                    <Check className="size-4 shrink-0 text-otto" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </Surface>
        </div>

        <QbrRail />
      </div>
    </div>
  );
}

/* ═════════════════ 08 · Activate Next Quarter ═════════════════ */

export function QbrActivateNextQuarter({ onContinue }: { onContinue?: () => void }) {
  const drawer = useDrawer();
  const [adjust, setAdjust] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeading
        title="Turn QBR decisions into the next success plan"
        meta="Acme Corporation · Q4 2026"
      />

      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <div className="space-y-6">
          <Surface className="space-y-7">
            <OttoVoice>Based on today's QBR, I recommend three Q4 priorities.</OttoVoice>
            <ol className="divide-y divide-border border-y border-border">
              {Q4_PRIORITIES.map((p, i) => (
                <li key={p.title} className="space-y-1.5 py-5">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Priority {i + 1}
                  </span>
                  <p className="text-[15px] font-semibold leading-snug">{p.title}</p>
                  <p className="text-[14px] text-muted-foreground">{p.body}</p>
                </li>
              ))}
            </ol>

            <div>
              <SectionTitle meta="Generated from QBR outcomes">Proposed Q4 Success Plan</SectionTitle>
              <div className="mt-5">
                <ScoreCard items={Q4_PLAN_SUMMARY} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
              <ActionButton
                variant="solid"
                onClick={() => drawer.open("q4:plan", Q4_PLAN_DETAIL)}
                done={drawer.isConfirmed("q4:plan")}
                doneLabel="Q4 plan approved"
              >
                Review Q4 Success Plan
              </ActionButton>
              <ActionButton onClick={() => setAdjust(true)} done={adjust} doneLabel="Adjustment noted">
                Ask Otto to adjust
              </ActionButton>
            </div>
            {adjust && (
              <p className="soft-in flex gap-3 text-[14px] leading-relaxed">
                <span className="mt-0.5 shrink-0 text-otto">
                  <OttoMark size={16} />
                </span>
                I can rebalance the plan toward automation efficiency, since the sponsor now ranks it
                above reporting modernization. That moves the Group B enablement wave two weeks
                earlier and adds one value measure.
              </p>
            )}
          </Surface>

          <Surface className="space-y-6 p-8 md:p-10">
            <p className="text-balance text-[1.45rem] font-semibold leading-snug tracking-tight">
              The QBR did not start when Alex opened a presentation.
            </p>
            <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              It started with every customer signal, commitment, conversation, action, and outcome
              the environment understood throughout the quarter.
            </p>
            <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-2">
              <div>
                <span className="eyebrow">Before</span>
                <p className="mt-2 text-[15px] leading-snug text-muted-foreground">
                  {QBR_CLOSING_BEFORE}
                </p>
              </div>
              <div>
                <span className="eyebrow text-otto">Future</span>
                <p className="mt-2 text-[15px] font-medium leading-snug">{QBR_CLOSING_FUTURE}</p>
              </div>
            </div>
            <p className="border-t border-border pt-6 text-[15px] font-semibold">
              From preparing a QBR to continuously preparing for customer value.
            </p>
          </Surface>

          {onContinue && (
            <Surface className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[15px] font-semibold">Continue into the Next Quarter</p>
                <p className="mt-1 text-[13px] text-muted-foreground">
                  See how QBR decisions become the next customer success cycle.
                </p>
              </div>
              <ActionButton variant="solid" onClick={onContinue}>
                Continue into the Next Quarter
              </ActionButton>
            </Surface>
          )}
        </div>

        <QbrRail />
      </div>

      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    </div>
  );
}

/* ═════════════════ AI activity overlay for the QBR path ═════════════════ */

export function QbrAgentChainPanel() {
  const info = useInfoDrawer();
  return (
    <Surface className="lg:sticky lg:top-6">
      <SectionTitle meta="Leadership view">AI activity</SectionTitle>
      <ol className="mt-5 space-y-4">
        {QBR_AGENT_CHAIN.map((a, i) => (
          <li key={a.agent} className="relative pl-6">
            <span
              className={cn(
                "absolute left-0 top-1.5 size-2 rounded-full",
                a.agent === "Otto" ? "bg-otto" : "bg-agent",
              )}
            />
            {i < QBR_AGENT_CHAIN.length - 1 && (
              <span className="absolute left-[3.5px] top-4 h-[calc(100%+0.5rem)] w-px bg-border" />
            )}
            <button
              type="button"
              onClick={() => info.open(`agent:${a.agent}`, agentDetail(a.agent, a.action))}
              className="group w-full text-left"
            >
              <p className="text-[14px] font-medium group-hover:text-otto">{a.agent}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{a.action}</p>
            </button>
          </li>
        ))}
      </ol>
      {info.node}
      <p className="mt-6 border-t border-border pt-4 text-[13px]">
        <span className="font-semibold">6 specialized agents contributed.</span>{" "}
        <span className="text-muted-foreground">
          The same agent architecture as the continuous quarter — Otto synthesizes their findings.
        </span>
      </p>
    </Surface>
  );
}

export { Disclosure, OttoAsk };
