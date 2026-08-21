import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ACME_TABS,
  ACME_TAB_DATA,
  AGENT_CHAIN,
  ASK_OTTO_THREAD,
  AWARENESSES,
  COORDINATION_CONFIRMED,
  DECISIONS,
  DECISION_DETAILS,
  INVESTIGATION_STEPS,
  OPERATING_MODEL,
  OPPORTUNITIES,
  OPPORTUNITY_DETAILS,
  POST_MEETING,
  POST_MEETING_CONFIRMED,
  RECOMMENDATION_DETAIL,
  SITUATIONS,
  SITUATION_DETAILS,
  WORKSTREAMS,
} from "@/lib/story-data";
import { OttoMark, OttoVoice, PrimaryAction } from "./primitives";
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
  Tabs,
  ValueChart,
} from "./shell";
import { ArrowRight, Check } from "lucide-react";
import { useAccount, useAccountData, useAccountKeyedData } from "@/lib/account-context";
import { ottoFocus, type FocusItem } from "@/lib/otto-focus";


export type Role = "CSM" | "TSM";

/* ═════════════════ 01 · Start My Quarter (Home) ═════════════════ */

export function MomentStartQuarter() {
  const drawer = useDrawer();
  const account = useAccount();
  // The chip (or typed question) currently steering the page below.
  const [asked, setAsked] = useState<string | null>(null);
  const rawFocus = asked ? ottoFocus(asked) : null;
  const focus = useAccountData(rawFocus);
  // The account in focus leads the queue; its supporting data follows it into
  // every later stage of the path.
  const situations = [...SITUATIONS].sort(
    (a, b) =>
      Number(b.account.startsWith(account.short)) - Number(a.account.startsWith(account.short)),
  );
  const scorecard = account.scorecard;

  const listItems = focus
    ? focus.items
    : situations.map((s) => ({
        account: s.account,
        kind: s.kind,
        tone: s.tone,
        detail: s.detail,
        impact: s.impact,
        action: s.action,
      }));

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-3xl space-y-5 pt-2 text-center">
        <h1 className="text-balance text-[1.75rem] font-semibold leading-tight tracking-tight md:text-[2.15rem]">
          {focus
            ? focus.headline
            : "Good morning, Alex. Here's where your attention matters today."}
        </h1>
        <OttoAsk
          placeholder="Ask Otto anything, or describe what you want to get done…"
          onAsk={setAsked}
        />
        {focus && (
          <button
            type="button"
            onClick={() => setAsked(null)}
            className="rounded-lg border border-border px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to my morning view
          </button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <Surface key={focus?.id ?? "default"} className="soft-in space-y-7">
          <SectionTitle meta={focus ? focus.listMeta : "Otto · this week"}>
            {focus ? focus.listTitle : "Where your attention matters"}
          </SectionTitle>
          <p className="max-w-2xl text-[15px] leading-relaxed">
            {focus ? focus.lead : account.headline}
          </p>

          <ul className="-mx-2 divide-y divide-border border-t border-border">
            {listItems.map((s) => (
              <li
                key={s.account}
                className="flex flex-wrap items-start justify-between gap-4 px-2 py-5"
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-[15px] font-semibold">{s.account}</p>
                    <StatusPill tone={s.tone}>{s.kind}</StatusPill>
                  </div>
                  <p className="text-[14px]">{s.detail}</p>
                  <p className="text-[13px] text-muted-foreground">
                    Potential impact — {s.impact}
                  </p>
                </div>
                <ActionButton
                  onClick={() =>
                    drawer.open(
                      `situation:${s.account}`,
                      SITUATION_DETAILS[s.account] ?? {
                        title: s.account,
                        meta: focus ? focus.eyebrow : "Otto",
                        summary: s.detail,
                        sections: [
                          { label: "Why this matters", items: [`Potential impact — ${s.impact}`] },
                          {
                            label: "How Otto knows",
                            items: focus
                              ? focus.metrics.map((m) => `${m.label}: ${m.value} — ${m.note}`)
                              : [],
                          },
                        ],
                        action: s.action,
                      },
                    )
                  }
                  done={drawer.isConfirmed(`situation:${s.account}`)}
                  doneLabel="Actioned"
                >
                  {s.action}
                </ActionButton>
              </li>
            ))}
          </ul>
        </Surface>

        <div className="space-y-6">
          <Surface className="space-y-6">
            <SectionTitle meta="Q3 2026">Quarter progress</SectionTitle>
            <ScoreCard items={scorecard} />
            <div className="border-t border-border pt-5">
              <Meter value={account.onPlan} label="Customer outcomes on plan" />
            </div>
          </Surface>

          <Surface className="space-y-5">
            <SectionTitle meta="AI prepares · people decide">Your decisions</SectionTitle>
            <ul className="divide-y divide-border border-t border-border">
              {DECISIONS.map((d) => (
                <li key={d.account} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {d.account}
                    </p>
                    <p className="mt-1 text-[14px] leading-snug">{d.task}</p>
                  </div>
                  <ActionButton
                    variant="solid"
                    onClick={() => drawer.open(`decision:${d.account}`, DECISION_DETAILS[d.account]!)}
                    done={drawer.isConfirmed(`decision:${d.account}`)}
                    doneLabel="Confirmed"
                  >
                    {d.cta}
                  </ActionButton>
                </li>
              ))}
            </ul>
          </Surface>
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

/* ═════════════════ Acme account frame ═════════════════ */

function AccountHeader({ tab = "Overview" }: { tab?: string }) {
  const [active, setActive] = useState(tab);
  const account = useAccount();
  const tabData = useAccountData(ACME_TAB_DATA);
  const extra = active === tab ? null : tabData[active];
  return (
    <div className="space-y-6">
      <PageHeading
        title={account.name}
        meta={account.segment}
        intent={account.intent}
      />
      <Tabs items={ACME_TABS} value={active} onChange={setActive} />
      {extra && (
        <Surface className="soft-in space-y-6">
          <SectionTitle meta="Example data">{active}</SectionTitle>
          <div className="grid gap-6 md:grid-cols-2">
            {extra.map((s) => (
              <div key={s.label}>
                <span className="eyebrow">{s.label}</span>
                <ul className="mt-3 space-y-2">
                  {s.items.map((i) => (
                    <li key={i} className="flex gap-3 text-[14px] leading-snug">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-agent" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <ActionButton onClick={() => setActive(tab)}>Back to {tab}</ActionButton>
        </Surface>
      )}
    </div>
  );
}


/* ═════════════════ 02 · Something Changed ═════════════════ */

export function MomentSomethingChanged({ role }: { role: Role }) {
  const drawer = useDrawer();
  const [ask, setAsk] = useState(false);
  const account = useAccount();
  const thread = useAccountData(ASK_OTTO_THREAD);
  const recommendation = useAccountData(RECOMMENDATION_DETAIL);
  if (role === "TSM") return <TsmInvestigation />;


  return (
    <div className="space-y-6">
      <AccountHeader />
      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <div className="space-y-6">
          <Surface className="space-y-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="eyebrow">Meaningful change detected</span>
              <StatusPill tone="risk">Adoption risk</StatusPill>
            </div>

            <div>
              <p className="text-[1.9rem] font-semibold leading-none tracking-tight">
                {account.metrics[1]!.label}{" "}
                <span className="text-destructive">{account.metrics[1]!.value}</span>
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                {account.name} · Past 3 weeks
              </p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed">{account.signal}.</p>
            </div>

            <div className="grid gap-6 border-t border-border pt-6 md:grid-cols-2">
              <div>
                <span className="eyebrow">Why this matters</span>
                <p className="mt-2 text-[14px] leading-relaxed">
                  The Q3 adoption milestone may be delayed if the trend continues.
                </p>
              </div>
              <div>
                <span className="eyebrow text-otto">Otto recommends</span>
                <p className="mt-2 text-[14px] leading-relaxed">
                  Investigate with the Technical Success Manager before Tuesday's customer meeting.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <ActionButton
                variant="solid"
                className="px-4 py-2.5"
                onClick={() => drawer.open("recommendation", recommendation)}
                done={drawer.isConfirmed("recommendation")}
                doneLabel="Recommendation approved"
              >
                Review recommendation
              </ActionButton>
              <ActionButton className="px-4 py-2.5" onClick={() => setAsk((v) => !v)}>
                {ask ? "Hide Otto" : "Ask Otto"}
              </ActionButton>
            </div>

            {ask && (
              <div className="soft-in space-y-3 rounded-xl border border-otto/25 bg-otto-soft px-5 py-4">
                <span className="eyebrow text-otto">Ask Otto</span>
                <ul className="space-y-3">
                  {thread.map((t) => (
                    <li key={t.q}>
                      <p className="text-[14px] font-medium">{t.q}</p>
                      <p className="mt-1 text-[14px] leading-relaxed text-muted-foreground">{t.a}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}


            <Disclosure label="Why does Otto think this?" tone="agent">
              <ul className="space-y-2.5">
                {account.evidence.map((e) => (
                  <li key={e} className="flex gap-3 text-[14px] leading-snug">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-agent" />
                    {e}
                  </li>
                ))}
              </ul>
            </Disclosure>
          </Surface>

          <Surface>
            <SectionTitle meta="Q3 2026">Key metrics</SectionTitle>
            <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
              {account.metrics.map((m) => (
                <Kpi key={m.label} value={m.value} label={m.label} note={m.delta} tone={m.tone} />
              ))}
            </div>
          </Surface>

          <Surface>
            <SectionTitle meta="Actual · Target · Projected">
              Strategic adoption trajectory
            </SectionTitle>
            <div className="mt-6">
              <AdoptionChart />
            </div>
          </Surface>
        </div>

        <IntelligenceRail />
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

/* ── TSM role view ── */

function TsmInvestigation() {
  const [started, setStarted] = useState(false);
  const account = useAccount();
  const steps = useAccountData(INVESTIGATION_STEPS);
  return (

    <div className="space-y-6">
      <PageHeading
        title={`${account.short} Technical Investigation`}
        meta={`${account.tsm.split(" · ")[0]} · Technical Success Manager · Q3 2026`}
      />
      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <div className="space-y-6">
          <Surface className="space-y-7">
            <div className="space-y-6">
              {[
                ["What changed", `${account.signal}.`],
                [
                  "What may explain it",
                  "Configuration activity began shortly before the decline.",
                ],
              ].map(([k, v]) => (
                <div key={k}>
                  <span className="eyebrow">{k}</span>
                  <p className="mt-2 text-[15px] leading-relaxed">{v}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6">
              <span className="eyebrow">Evidence</span>
              <ul className="mt-3 grid gap-2 sm:grid-cols-3">
                {["3 related incidents", "2 configuration changes", "1 relevant knowledge article"].map(
                  (e) => (
                    <li key={e} className="rounded-xl border border-border bg-background px-4 py-3 text-[13px]">
                      {e}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="rounded-xl border border-otto/25 bg-otto-soft px-5 py-4">
              <span className="eyebrow text-otto">What Alex needs from you</span>
              <p className="mt-2 text-[15px] leading-relaxed">
                Determine whether the configuration change caused the adoption decline before
                Tuesday's meeting.
              </p>
            </div>

            {!started ? (
              <ActionButton variant="solid" className="px-4 py-2.5" onClick={() => setStarted(true)}>
                Begin investigation
              </ActionButton>
            ) : (
              <div className="rise space-y-3 border-t border-border pt-6">
                <span className="eyebrow text-otto">Investigation progress</span>
                <ul className="space-y-2.5">
                  {steps.map((s, i) => (
                    <li
                      key={s}
                      className="rise flex items-center gap-3 text-[14px]"
                      style={{ animationDelay: `${i * 110}ms` }}
                    >
                      <Check className="size-4 shrink-0 text-otto" aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </Surface>

          <p className="text-center text-[12px] uppercase tracking-[0.14em] text-muted-foreground">
            Same customer. Same environment. Different responsibility.
          </p>
        </div>
        <IntelligenceRail />
      </div>
    </div>
  );
}

/* ═════════════════ 03 · Coordinate Response ═════════════════ */

export function MomentCoordinate({ role }: { role: Role }) {
  const [state, setState] = useState<"idle" | "working" | "done">("idle");
  const workstreams = useAccountData(WORKSTREAMS);
  const confirmedLines = useAccountData(COORDINATION_CONFIRMED);
  if (role === "TSM") return <TsmInvestigation />;

  const start = () => {
    setState("working");
    window.setTimeout(() => setState("done"), 1400);
  };

  return (
    <div className="space-y-6">
      <AccountHeader tab="Success Plan" />
      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <div className="space-y-6">
          <Surface className="space-y-7">
            <div>
              <span className="eyebrow text-otto">Orchestration</span>
              <h2 className="mt-2 text-[1.45rem] font-semibold leading-snug tracking-tight">
                Otto recommends a coordinated response
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                The adoption issue crosses technical, customer, and commercial responsibilities. I
                can coordinate the necessary response while maintaining shared account context.
              </p>
            </div>

            <ul className="divide-y divide-border border-y border-border">
              {workstreams.map((w) => (
                <li key={w.title} className="flex flex-wrap items-start justify-between gap-4 py-5">
                  <div className="min-w-0 max-w-xl space-y-1.5">
                    <p className="text-[15px] font-semibold">{w.title}</p>
                    <p className="text-[13px] text-muted-foreground">{w.owner}</p>
                    <p className="text-[14px] leading-snug">{w.detail}</p>
                  </div>
                  <StatusPill tone={w.status === "Context ready" ? "positive" : "quiet"}>
                    {w.status}
                  </StatusPill>
                </li>
              ))}
            </ul>

            {state === "idle" && (
              <PrimaryAction onClick={start}>
                Coordinate response <ArrowRight className="size-4" aria-hidden="true" />
              </PrimaryAction>
            )}
            {state === "working" && (
              <p className="soft-in flex items-center gap-3 text-[14px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-otto" style={{ animation: "breathe 1.2s ease-in-out infinite" }} />
                Otto is coordinating across roles and transferring customer context…
              </p>
            )}
            {state === "done" && (
              <ul className="rise space-y-2.5">
                {confirmedLines.map((c, i) => (
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
        <IntelligenceRail />
      </div>
    </div>
  );
}

/* ═════════════════ 04 · Prepare for Customer ═════════════════ */

const BRIEFING: [string, string][] = [
  ["What changed", "Strategic adoption declined because of a configuration issue."],
  ["Customer impact", "The original Q3 milestone may move approximately two weeks."],
  ["What we did", "The TSM identified the cause and completed remediation."],
  ["What we need from Acme", "Confirm rollout timing and stakeholder availability."],
];

const CONVERSATION = [
  "Acknowledge the impact",
  "Explain the root cause",
  "Present remediation",
  "Reconfirm the success milestone",
  "Align on next actions",
];

export function MomentPrepare({ role }: { role: Role }) {
  const [captured, setCaptured] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const account = useAccount();
  const briefing = useAccountData(BRIEFING);
  const postMeeting = useAccountData(POST_MEETING);
  const postConfirmed = useAccountData(POST_MEETING_CONFIRMED);
  if (role === "TSM") return <TsmInvestigation />;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <div className="space-y-6">
          <div className="flex justify-end">
            <p className="rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-[14px] text-primary-foreground">
              Prepare me for Tuesday's {account.short} meeting.
            </p>
          </div>

          <Surface className="space-y-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-5">
              <h2 className="text-[1.45rem] font-semibold tracking-tight">
                {account.short} Customer Briefing
              </h2>
              <span className="text-[13px] text-muted-foreground">Tuesday · 10:00 AM</span>
            </div>

            <div className="grid gap-7 md:grid-cols-2">
              {briefing.map(([k, v]) => (
                <div key={k}>
                  <span className="eyebrow">{k}</span>
                  <p className="mt-2 text-[15px] leading-relaxed">{v}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-7 border-t border-border pt-6 md:grid-cols-2">
              <div>
                <span className="eyebrow">Recommended conversation</span>
                <ol className="mt-3 space-y-2 text-[14px]">
                  {CONVERSATION.map((c, i) => (
                    <li key={c} className="flex gap-3">
                      <span className="font-mono text-[12px] text-otto">{i + 1}</span>
                      {c}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="space-y-3">
                <span className="eyebrow">What the customer may ask</span>
                <Disclosure label="Will this affect our Q3 target?">
                  <p className="leading-relaxed">
                    The milestone moves approximately two weeks. Remediation is complete and adoption
                    is already recovering, so the quarter's outcome goal remains achievable if the
                    rollout window is confirmed this week.
                  </p>
                  <p className="mt-3 flex items-center gap-2 text-[12px] text-muted-foreground">
                    <span className="text-otto">
                      <OttoMark size={13} />
                    </span>
                    Draft answer prepared by Otto.
                  </p>
                </Disclosure>
              </div>
            </div>
          </Surface>

          <Surface className="space-y-6">
            <SectionTitle meta="After the meeting">Meeting outcomes captured</SectionTitle>
            {!captured ? (
              <PrimaryAction onClick={() => setCaptured(true)}>
                End meeting <ArrowRight className="size-4" aria-hidden="true" />
              </PrimaryAction>
            ) : (
              <div className="rise space-y-6">
                <p className="text-[14px] text-muted-foreground">Otto identified:</p>
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  {postMeeting.map((p) => (
                    <div key={p.label}>
                      <p className="text-[1.5rem] font-semibold leading-none tracking-tight">
                        {p.value}
                      </p>
                      <p className="mt-1.5 text-[12px] text-muted-foreground">{p.label}</p>
                    </div>
                  ))}
                </div>
                <PrimaryAction
                  onClick={() => setConfirmed(true)}
                  done={confirmed}
                  doneLabel="Outcomes confirmed"
                >
                  Confirm outcomes <Check className="size-4" aria-hidden="true" />
                </PrimaryAction>
                {confirmed && (
                  <ul className="rise space-y-2.5 border-t border-border pt-5">
                    {postConfirmed.map((c, i) => (
                      <li
                        key={c}
                        className="rise flex items-center gap-3 text-[14px]"
                        style={{ animationDelay: `${i * 110}ms` }}
                      >
                        <Check className="size-4 shrink-0 text-otto" aria-hidden="true" />
                        {c}
                      </li>
                    ))}
                    <li className="pt-2 text-[13px] text-muted-foreground">
                      Context continues automatically — no manual updates across five systems.
                    </li>
                  </ul>
                )}
              </div>
            )}
          </Surface>
        </div>
        <IntelligenceRail />
      </div>
    </div>
  );
}

/* ═════════════════ 05 · Show the Value ═════════════════ */

export function MomentValue() {
  const drawer = useDrawer();
  const account = useAccount();
  const opportunities = useAccountData(OPPORTUNITIES);
  const opportunityDetails = useAccountKeyedData(OPPORTUNITY_DETAILS);
  return (
    <div className="space-y-6">
      <PageHeading
        title={`${account.short} Customer Value`}
        meta="Q3 2026"
        intent="Business outcomes, adoption progress, value realization, and next opportunities."
      />

      <div className="grid gap-6 lg:grid-cols-[1.62fr_1fr]">
        <div className="space-y-6">
          <Surface className="space-y-8">
            <div>
              <span className="eyebrow">Q3 value realized</span>
              <p className="mt-3 text-[3rem] font-semibold leading-none tracking-tight">
                {account.acv}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                Estimated realized business value
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 border-t border-border pt-6 md:grid-cols-4">
              {account.valueMetrics.map((m) => (
                <Kpi key={m.label} value={m.value} label={m.label} note={m.note} tone="up" />
              ))}
            </div>
          </Surface>

          <Surface>
            <SectionTitle meta="Q3 2026">Value realized this quarter</SectionTitle>
            <div className="mt-6">
              <ValueChart />
            </div>
            <p className="mt-5 border-t border-border pt-5 text-[13px] text-muted-foreground">
              Customer value emerged across a connected series of AI-assisted actions, not a single
              intervention.
            </p>
          </Surface>
        </div>

        <div className="space-y-6">
          <Surface className="lg:sticky lg:top-6">
            <SectionTitle meta="Otto">Next-quarter opportunities</SectionTitle>
            <ul className="mt-5 divide-y divide-border border-t border-border">
              {opportunities.map((o) => (
                <li key={o.title} className="space-y-2 py-5">
                  <p className="text-[15px] font-semibold leading-snug">{o.title}</p>
                  <p className="text-[12px] text-muted-foreground">
                    {o.metricLabel}
                    <span className="ml-2 text-[15px] font-semibold text-foreground">
                      {o.metric}
                    </span>
                  </p>
                  <p className="text-[13px] leading-snug text-muted-foreground">{o.reason}</p>
                  <ActionButton
                    onClick={() => drawer.open(`opp:${o.title}`, opportunityDetails[o.title]!)}
                    done={drawer.isConfirmed(`opp:${o.title}`)}
                    doneLabel="Added to plan"
                  >
                    Review opportunity
                  </ActionButton>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] font-medium">
              Value realized. Next opportunity identified.
            </p>
          </Surface>
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

/* ═════════════════ 06 · Leadership reveal ═════════════════ */

export function MomentArchitecture() {
  const info = useInfoDrawer();
  const account = useAccount();
  return (
    <div className="space-y-10">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-otto">CSP on LUX</p>
        <h1 className="mt-4 text-balance text-[1.75rem] font-semibold leading-tight tracking-tight md:text-[2.1rem]">
          A new operating model for customer success
        </h1>
      </div>

      <Surface className="mx-auto max-w-3xl space-y-3 p-8 md:p-12">
        {OPERATING_MODEL.map((layer, i) => (
          <div key={layer.title}>
            <button
              type="button"
              onClick={() =>
                info.open(`layer:${layer.title}`, {
                  title: layer.title,
                  meta: "Operating model layer",
                  summary:
                    "Each layer of the operating model is real in the prototype — this is what sits at this level and what it is responsible for.",
                  sections: [
                    { label: "At this layer", items: [...layer.items] },
                    {
                      label: "Why it matters",
                      items: [
                        "People stay in judgment and relationship work",
                        "Otto orchestrates; specialized agents do focused work",
                        "The environment keeps customer context continuously current",
                      ],
                    },
                  ],
                })
              }
              className={cn(
                "block w-full rounded-xl border px-6 py-6 text-center transition-colors hover:border-otto/40",
                layer.title === "OTTO"
                  ? "border-otto/30 bg-otto-soft"
                  : "border-border bg-background",
              )}
            >
              <p className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                {layer.title === "OTTO" && (
                  <span className="text-otto">
                    <OttoMark size={14} />
                  </span>
                )}
                {layer.title}
              </p>
              <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed">
                {layer.items.join(" · ")}
              </p>
            </button>
            {i < OPERATING_MODEL.length - 1 && (
              <div className="mx-auto h-6 w-px bg-border-strong" aria-hidden="true" />
            )}
          </div>
        ))}

        <div className="grid gap-4 border-t border-border pt-8 md:grid-cols-3">
          {AWARENESSES.map((a) => (
            <button
              key={a.title}
              type="button"
              onClick={() =>
                info.open(`awareness:${a.title}`, {
                  title: a.title,
                  meta: "One of the three awarenesses",
                  summary: a.body,
                  sections: [
                    {
                      label: "How it shows up in this story",
                      items: [
                        `${account.short}: ${account.signal.toLowerCase()} — detected without anyone asking`,
                        "The response was coordinated across CSM, TSM and AE roles",
                        "The value story assembled itself from what actually happened",
                      ],
                    },
                  ],
                })
              }
              className="group text-left"
            >
              <p className="text-[14px] font-semibold group-hover:text-otto">{a.title}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{a.body}</p>
            </button>
          ))}
        </div>
        {info.node}
      </Surface>

      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <p className="text-balance text-[1.35rem] font-semibold leading-snug md:text-[1.6rem]">
          From navigating customer success tools to operating within an intelligent customer success
          environment.
        </p>
        <p className="text-balance text-[15px] leading-relaxed text-muted-foreground">
          The system understands the customer, the work, and the people involved, then continuously
          brings forward what matters next.
        </p>
      </div>
    </div>
  );
}

/* ═════════════════ 07 · Today vs. future ═════════════════ */

const TODAY = [
  "Find information",
  "Interpret signals",
  "Coordinate people",
  "Create artifacts",
  "Track commitments",
  "Reconstruct the customer story",
];

const FUTURE = [
  "AI notices",
  "Otto understands",
  "Otto coordinates",
  "People apply judgment",
  "AI maintains continuity",
  "The customer realizes value",
];

export function MomentBeforeAfter() {
  return (
    <div className="space-y-8">
      <PageHeading title="Today vs. future" meta="Who does the work" />
      <div className="grid gap-6 md:grid-cols-2">
        <Surface className="bg-background">
          <span className="eyebrow">Today</span>
          <p className="mt-3 text-[1.15rem] font-semibold text-muted-foreground">The person must</p>
          <ul className="mt-6 divide-y divide-border border-t border-border">
            {TODAY.map((t) => (
              <li key={t} className="py-3.5 text-[15px] text-muted-foreground">
                {t}
              </li>
            ))}
          </ul>
        </Surface>
        <Surface>
          <span className="eyebrow text-otto">Future</span>
          <p className="mt-3 flex items-center gap-2 text-[1.15rem] font-semibold">
            <span className="text-otto">
              <OttoMark size={16} />
            </span>
            The intelligent environment
          </p>
          <ul className="mt-6 divide-y divide-border border-t border-border">
            {FUTURE.map((t) => (
              <li key={t} className="py-3.5 text-[15px] font-medium">
                {t}
              </li>
            ))}
          </ul>
        </Surface>
      </div>
      <p className="text-center text-[13px] text-muted-foreground">
        The person still decides. The environment does the rest.
      </p>
    </div>
  );
}

/* ═════════════════ AI activity overlay (leadership only) ═════════════════ */

export function AgentChainPanel() {
  const info = useInfoDrawer();
  const chain = useAccountData(AGENT_CHAIN);
  return (
    <Surface className="lg:sticky lg:top-6">
      <SectionTitle meta="Leadership view">AI activity</SectionTitle>
      <ol className="mt-5 space-y-4">
        {chain.map((a, i) => (
          <li key={a.agent} className="relative pl-6">
            <span
              className={cn(
                "absolute left-0 top-1.5 size-2 rounded-full",
                a.agent === "Otto" ? "bg-otto" : "bg-agent",
              )}
            />
            {i < chain.length - 1 && (
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
        <span className="font-semibold">4 specialized agents contributed.</span>{" "}
        <span className="text-muted-foreground">
          Agents are never selected by the user — Otto synthesizes their findings.
        </span>
      </p>
    </Surface>
  );
}

export { OttoVoice };
