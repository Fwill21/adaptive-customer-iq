import { useState } from "react";
import { cn } from "@/lib/utils";
import { ACCOUNTS, AGENTS, ROLES, TIMELINE } from "@/lib/story-data";
import {
  AgentContribution,
  AgentDots,
  ConversationPrompt,
  LayerTag,
  MomentHeader,
  OttoMark,
  OttoVoice,
  Panel,
  PrimaryAction,
  ProgressiveLayer,
} from "./primitives";
import { ArrowRight, Check } from "lucide-react";

/* ─────────────────────────── Moment 1 ─────────────────────────── */

export function MomentStartQuarter() {
  const [focused, setFocused] = useState(false);

  return (
    <section className="space-y-12">
      <MomentHeader
        index="01"
        title="Start my quarter"
        question="Three accounts need your attention this week."
      />

      <OttoVoice className="rise">
        Good morning, Maya. I've reviewed your portfolio overnight. Acme's adoption has slowed,
        Globex has a new executive sponsor, and Contoso is approaching an important success
        milestone. Everything else is on track.
      </OttoVoice>

      <div className="space-y-3">
        {ACCOUNTS.map((a, i) => (
          <Panel
            key={a.name}
            className={cn(
              "rise transition-colors",
              focused && i === 0 && "border-otto/50 ring-1 ring-otto/25",
              focused && i > 0 && "opacity-55",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold">{a.name}</h2>
                  <span className="eyebrow">{a.priority} priority</span>
                </div>
                <p className="text-[15px] text-foreground">{a.signal}</p>
                <p className="text-sm text-muted-foreground">Why it matters — {a.why}</p>
              </div>
              <div className="flex flex-col items-start gap-3 md:items-end">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  {a.horizon}
                </span>
                <span className="flex items-center gap-2">
                  <AgentDots count={a.agents.length} />
                  <span className="text-xs text-muted-foreground">
                    {a.agents.length} agents watching
                  </span>
                </span>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <div className="space-y-5">
        <ConversationPrompt
          text="What should I focus on first?"
          asked={focused}
          onSelect={() => setFocused(true)}
        />
        {focused && (
          <div className="rise space-y-5">
            <OttoVoice>
              Start with <strong className="font-semibold">Acme Corporation</strong>. It's the only
              account where a change this week puts a committed Q3 milestone at risk — and the
              executive check-in is in four days, so acting now still changes the outcome.
            </OttoVoice>
            <div className="flex items-center gap-3">
              <LayerTag kind="recommends" />
              <LayerTag kind="human">You decide</LayerTag>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────── Moment 2 ─────────────────────────── */

export function MomentSomethingChanged() {
  return (
    <section className="space-y-12">
      <MomentHeader
        index="02"
        title="Something changed"
        question="Adoption in Acme's wave-2 group declined 18% over three weeks."
      />

      <div className="flex flex-wrap items-center gap-3 rise">
        <span className="eyebrow">Acme Corporation</span>
        <span className="text-border-strong">/</span>
        <LayerTag kind="detects" />
        <LayerTag kind="aware" />
      </div>

      <Panel className="rise space-y-7 p-7 md:p-9">
        <ProgressiveLayer step="What changed" title="Adoption decreased 18%">
          Weekly active use in the wave-2 deployment group fell from 2,410 to 1,976 over three
          weeks. All other groups are stable or growing.
        </ProgressiveLayer>
        <hr className="border-border" />
        <ProgressiveLayer step="Why it matters" title="A committed milestone is exposed">
          “Global rollout wave 2” is a strategic Q3 milestone in Acme's success plan. At the current
          trend it slips roughly two weeks.
        </ProgressiveLayer>
        <hr className="border-border" />
        <ProgressiveLayer step="Evidence" title="Usage decline tracks a configuration change">
          The decline begins the day after a wave-2 form configuration change, and three support
          cases in the same window describe the same workflow friction.
        </ProgressiveLayer>
        <hr className="border-border" />
        <ProgressiveLayer step="Recommended action" title="Investigate with the TSM first">
          Ask Priya (TSM) to confirm the technical cause before the executive check-in, so you
          arrive with a remediation path rather than a question.
        </ProgressiveLayer>
      </Panel>

      <AgentContribution
        agents={["adoption", "health", "risk", "context"]}
        summary="Confidence: high — three independent signals agree."
      />
    </section>
  );
}

/* ─────────────────────────── Moment 3 ─────────────────────────── */

const FLOW = [
  { label: "CSM", note: "Maya approves" },
  { label: "Otto", note: "Packages context" },
  { label: "Agents", note: "Evidence & plan" },
  { label: "TSM · AE", note: "Work arrives ready" },
];

export function MomentCoordinate() {
  const [coordinated, setCoordinated] = useState(false);
  const [role, setRole] = useState<"CSM" | "TSM">("CSM");

  return (
    <section className="space-y-12">
      <MomentHeader
        index="03"
        title="Coordinate the response"
        question="One approval moves the work to the right people, with context attached."
      />

      <Panel className="rise space-y-6">
        <div className="flex items-center gap-3">
          <LayerTag kind="recommends">Recommended response</LayerTag>
        </div>
        <ul className="space-y-3 text-[15px]">
          {[
            "Ask the TSM to investigate the adoption decline in the wave-2 group.",
            "Keep the AE informed — this could affect the Q4 expansion conversation.",
            "Prepare an adoption recovery plan before the executive check-in.",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-otto" />
              {t}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <PrimaryAction
            onClick={() => setCoordinated(true)}
            done={coordinated}
            doneLabel="Response coordinated — 2 roles engaged, context transferred"
          >
            Coordinate response <ArrowRight className="size-4" aria-hidden="true" />
          </PrimaryAction>
          {!coordinated && <LayerTag kind="human" />}
        </div>
      </Panel>

      {coordinated && (
        <div className="rise space-y-8">
          <div className="grid gap-3 md:grid-cols-4">
            {FLOW.map((n, i) => (
              <div
                key={n.label}
                className="rise rounded-2xl border border-border bg-surface px-5 py-4"
                style={{ animationDelay: `${i * 220}ms` }}
              >
                <span className="eyebrow">Step {i + 1}</span>
                <p className="mt-2 flex items-center gap-2 font-semibold">
                  {n.label === "Otto" && (
                    <span className="text-otto">
                      <OttoMark size={16} />
                    </span>
                  )}
                  {n.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{n.note}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Maya wrote no tasks, forwarded no threads, and re-explained nothing. Otto carried the
            signal, the evidence, the milestone at stake and the deadline into each role's own work.
          </p>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="eyebrow">Role-aware personalization</span>
              <div className="flex rounded-full border border-border bg-surface p-1">
                {(["CSM", "TSM"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm transition-colors",
                      role === r
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {r} view
                  </button>
                ))}
              </div>
            </div>

            {role === "CSM" ? (
              <Panel className="soft-in space-y-6">
                <OttoVoice label="Otto · CSM view">
                  Priya is investigating. I'll prepare your executive check-in as soon as she
                  confirms the cause. Nothing is required from you until then.
                </OttoVoice>
                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    ["Relationship focus", "Protect the wave-2 milestone commitment"],
                    ["Open with customer", "Executive check-in in 4 days"],
                    ["Waiting on", "TSM technical confirmation"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <span className="eyebrow">{k}</span>
                      <p className="mt-1.5 text-sm">{v}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            ) : (
              <Panel className="soft-in space-y-6">
                <OttoVoice label="Otto · TSM view">
                  Priya — a wave-2 adoption drop at Acme traces to a form configuration change on
                  the 12th. Three cases describe the same friction. Here's what I've already
                  gathered.
                </OttoVoice>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <span className="eyebrow">Technical problem</span>
                      <p className="mt-1.5 text-sm">
                        Required-field logic added to the incident intake form on the wave-2 update
                        set is blocking a high-volume path.
                      </p>
                    </div>
                    <div>
                      <span className="eyebrow">Supporting evidence</span>
                      <p className="mt-1.5 text-sm">
                        Abandonment on that form up 41%. Cases CS-4471, CS-4488, CS-4502 cite the
                        same step.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="eyebrow">Expected outcome</span>
                      <p className="mt-1.5 text-sm">
                        Restore wave-2 usage to baseline before the milestone date.
                      </p>
                    </div>
                    <div>
                      <span className="eyebrow">Recommended investigation</span>
                      <p className="mt-1.5 text-sm">
                        Compare update set 24.3 against wave-1 config, then validate in the
                        customer's test instance with the platform owner.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <LayerTag kind="coordinates">Context transferred by Otto</LayerTag>
                  <AgentDots count={4} />
                </div>
              </Panel>
            )}

            <p className="text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Same customer. Same environment. Different responsibility.
            </p>
            <p className="text-center text-sm text-muted-foreground">
              The same orchestration adapts to {ROLES.join(" · ")}.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────── Moment 4 ─────────────────────────── */

const BRIEFING: [string, string][] = [
  ["What changed", "Wave-2 adoption fell 18% after a form configuration change on 12 August."],
  ["Customer impact", "The wave-2 rollout milestone could slip approximately two weeks."],
  [
    "What we've done",
    "Priya (TSM) confirmed the cause and built a remediation path: revert the required-field logic, validate in test, redeploy in one change window.",
  ],
  [
    "What we need from Acme",
    "Confirmation of the deployment window and platform-owner availability on Thursday.",
  ],
];

const CONVERSATION_PLAN = [
  "Acknowledge the slowdown before they raise it.",
  "Explain the configuration cause plainly.",
  "Present the remediation path and the validation step.",
  "Reconfirm the wave-2 milestone with the revised window.",
  "Agree on owners and dates for next actions.",
];

const FOLLOW_UPS: { q: string; a: string }[] = [
  {
    q: "What is the biggest risk?",
    a: "Not the fix — it's the change window. Acme's CAB meets weekly, so if Thursday's slot is missed the milestone slips a full week regardless of remediation being ready. Secure the window in this meeting.",
  },
  {
    q: "Does this affect the expansion conversation?",
    a: "Not yet. The AE is informed and the expansion signals are unchanged, but a visible recovery here strengthens the Q4 case. I'd let the outcome speak for itself in this meeting.",
  },
];

export function MomentPrepare() {
  const [briefed, setBriefed] = useState(false);
  const [asked, setAsked] = useState<number[]>([]);
  const [captured, setCaptured] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <section className="space-y-12">
      <MomentHeader
        index="04"
        title="Prepare me for the customer"
        question="A briefing built around decisions, not data."
      />

      <div className="space-y-5">
        <ConversationPrompt
          text="Prepare me for my meeting with Acme."
          asked={briefed}
          onSelect={() => setBriefed(true)}
        />

        {briefed && (
          <div className="rise space-y-8">
            <OttoVoice>
              Here's your briefing for Thursday's executive check-in. Priya's remediation is ready —
              this meeting is about confirming timing, not diagnosing the problem.
            </OttoVoice>

            <Panel className="space-y-6 p-7 md:p-9">
              {BRIEFING.map(([k, v]) => (
                <ProgressiveLayer key={k} step={k} title="">
                  {v}
                </ProgressiveLayer>
              ))}
              <hr className="border-border" />
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <span className="eyebrow">Recommended conversation</span>
                  <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                    {CONVERSATION_PLAN.map((s, i) => (
                      <li key={s} className="flex gap-3">
                        <span className="font-mono text-xs text-otto">{i + 1}</span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <span className="eyebrow">Likely customer questions</span>
                  <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
                    <li>“What does this mean for our timeline?”</li>
                    <li>“Will additional technical resources be required?”</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    Answers are drafted with the revised window and Priya's effort estimate.
                  </p>
                </div>
              </div>
            </Panel>

            <AgentContribution agents={["meeting", "support", "risk", "context"]} />

            <div className="space-y-4">
              {FOLLOW_UPS.map((f, i) => (
                <div key={f.q} className="space-y-4">
                  <ConversationPrompt
                    text={f.q}
                    asked={asked.includes(i)}
                    onSelect={() => setAsked((a) => [...a, i])}
                  />
                  {asked.includes(i) && (
                    <OttoVoice className="rise" label="Otto">
                      <span className="text-base md:text-lg">{f.a}</span>
                    </OttoVoice>
                  )}
                </div>
              ))}
            </div>

            <hr className="border-border" />

            <div className="space-y-5">
              <span className="eyebrow">After the meeting</span>
              {!captured ? (
                <PrimaryAction onClick={() => setCaptured(true)}>
                  End meeting <ArrowRight className="size-4" aria-hidden="true" />
                </PrimaryAction>
              ) : (
                <Panel className="rise space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <LayerTag kind="detects">Meeting outcomes captured</LayerTag>
                    <AgentDots count={3} />
                  </div>
                  <ul className="space-y-3 text-[15px]">
                    {[
                      ["Decision", "Remediation deploys in Thursday's change window."],
                      ["Commitment · Acme", "Platform owner available for validation — Priya notified."],
                      ["Commitment · Us", "Milestone re-baselined to 6 September, confirmed in the plan."],
                    ].map(([k, v]) => (
                      <li key={k} className="flex flex-wrap gap-x-3 gap-y-1">
                        <span className="eyebrow w-40 shrink-0">{k}</span>
                        <span className="min-w-0 flex-1">{v}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-4">
                    <PrimaryAction
                      onClick={() => setConfirmed(true)}
                      done={confirmed}
                      doneLabel="3 commitments are now being monitored"
                    >
                      Review and confirm <Check className="size-4" aria-hidden="true" />
                    </PrimaryAction>
                    {!confirmed && <LayerTag kind="human" />}
                  </div>
                  {confirmed && (
                    <p className="soft-in text-sm text-muted-foreground">
                      No systems updated by hand. The success plan, the milestone date, the TSM's
                      task and the AE's account note all moved together.
                    </p>
                  )}
                </Panel>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────── Moment 5 ─────────────────────────── */

const VALUE_STORY: [string, string][] = [
  [
    "Customer goals",
    "Consolidate service management onto one platform and cut mean time to resolution by 25% across three regions.",
  ],
  [
    "Progress",
    "Wave-2 rollout completed 6 September. 4,880 active agents, up from 3,120 at quarter start. Success plan 82% complete.",
  ],
  [
    "Value realized",
    "MTTR down 21%. Deflection up 14 points in the self-service portal. 1,900 hours of manual triage removed annually.",
  ],
  [
    "Challenges resolved",
    "An 18% wave-2 adoption decline was detected within days, traced to a form configuration change, remediated with the customer's platform team, and recovered to +34% above the trough.",
  ],
  [
    "Remaining risks",
    "Region 3 change-management capacity is thin heading into wave 3; two integrations still awaiting security review.",
  ],
  [
    "Next-quarter opportunities",
    "Extend to HR service delivery in Region 1, and formalise a wave-3 adoption playbook from what wave 2 taught us.",
  ],
];

export function MomentValue() {
  const [built, setBuilt] = useState(false);

  return (
    <section className="space-y-12">
      <MomentHeader
        index="05"
        title="Show the value"
        question="The quarter already wrote the story. Otto assembled it."
      />

      <OttoVoice className="rise">
        Your Acme Customer Value Review is in six days. I've prepared a draft value story from this
        quarter's goals, activity, milestones, adoption, outcomes and resolved issues.
      </OttoVoice>

      <div className="flex flex-wrap items-center gap-4">
        <PrimaryAction onClick={() => setBuilt(true)} done={built} doneLabel="Value story drafted">
          Build value story <ArrowRight className="size-4" aria-hidden="true" />
        </PrimaryAction>
        {!built && <LayerTag kind="human" />}
      </div>

      {built && (
        <div className="rise space-y-10">
          <Panel className="space-y-6 p-7 md:p-9">
            {VALUE_STORY.map(([k, v], i) => (
              <div key={k} className="rise" style={{ animationDelay: `${i * 90}ms` }}>
                <ProgressiveLayer step={k} title="">
                  {v}
                </ProgressiveLayer>
              </div>
            ))}
          </Panel>

          <div className="space-y-6">
            <span className="eyebrow">Assembled from the whole quarter</span>
            <div className="relative overflow-x-auto pb-2">
              <div className="grid min-w-[46rem] grid-cols-6 gap-4">
                {TIMELINE.map((t, i) => (
                  <div key={t.label} className="relative">
                    <div className="mb-4 flex items-center">
                      <span className="size-2.5 rounded-full bg-otto" />
                      <span
                        className={cn(
                          "h-px flex-1 bg-border-strong",
                          i === TIMELINE.length - 1 && "opacity-0",
                        )}
                      />
                    </div>
                    <p className="text-sm font-semibold">{t.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.detail}</p>
                    <div className="mt-4 flex flex-col gap-2">
                      <AgentDots count={t.agents} />
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-agent">
                        {t.agents} agents
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Nobody reconstructed this narrative at quarter end. It was maintained continuously,
              week by week, as the work happened.
            </p>
          </div>

          <AgentContribution agents={["value", "adoption", "planning", "meeting"]} />
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────── Final reveal ─────────────────────────── */

export function MomentArchitecture() {
  return (
    <section className="space-y-14">
      <MomentHeader
        index="06"
        title="The architecture"
        question="One person. One orchestrator. Ten agents. One continuously aware environment."
      />

      <div className="relative rounded-3xl border border-border bg-surface p-8 shadow-calm md:p-14">
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {ROLES.map((r) => (
            <span
              key={r}
              className="rounded-full border border-border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground"
            >
              {r}
            </span>
          ))}
        </div>

        <div className="mx-auto max-w-2xl space-y-5 text-center">
          <Layer title="Person" note="Role, responsibility, customer, moment" />
          <Connector />
          <Layer
            title="Otto"
            note="Understands context · determines what happens next · asks for your decision"
            tone="otto"
          />
          <Connector />
          <div className="rounded-2xl border border-agent/30 bg-agent-soft/60 p-6">
            <span className="eyebrow text-agent">10 specialized agents</span>
            <div className="mt-4 grid gap-2 text-left sm:grid-cols-2">
              {AGENTS.map((a) => (
                <span key={a.key} className="flex items-center gap-2.5 text-sm">
                  <span className="size-1.5 rounded-full bg-agent" />
                  {a.name}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Never selected by the user. Always contributing.
            </p>
          </div>
          <Connector />
          <Layer
            title="AI environment"
            note="Customer data · adoption · health · support · success plans · goals · meetings · communications · tasks · workflows · commitments · knowledge · account history · enterprise systems"
          />
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-otto">CSP on AINPX</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Powered by Horizon 2.0 interaction patterns
          </p>
        </div>
      </div>

      <p className="mx-auto max-w-3xl text-balance text-center text-2xl font-semibold leading-snug md:text-3xl">
        From navigating customer success tools to operating within an intelligent customer success
        environment.
      </p>
    </section>
  );
}

function Layer({
  title,
  note,
  tone,
}: {
  title: string;
  note: string;
  tone?: "otto";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6",
        tone === "otto" ? "border-otto/40 bg-otto-soft" : "border-border bg-background",
      )}
    >
      <p className="flex items-center justify-center gap-2 text-lg font-semibold">
        {tone === "otto" && (
          <span className="text-otto">
            <OttoMark size={18} />
          </span>
        )}
        {title}
      </p>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{note}</p>
    </div>
  );
}

function Connector() {
  return <div className="mx-auto h-8 w-px bg-border-strong" aria-hidden="true" />;
}

/* ─────────────────────────── Before / after ─────────────────────────── */

const TODAY = [
  "Find information",
  "Interpret signals",
  "Coordinate people",
  "Create artifacts",
  "Track commitments",
  "Reconstruct the customer story",
];

const FUTURE = [
  "Understands context",
  "Detects meaningful change",
  "Coordinates intelligence",
  "Prepares work",
  "Maintains continuity",
  "Builds the customer story",
];

export function MomentBeforeAfter() {
  return (
    <section className="space-y-14">
      <MomentHeader index="07" title="Today vs. future" question="Who does the work." />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-background p-8 md:p-10">
          <span className="eyebrow">Today</span>
          <p className="mt-3 text-xl font-semibold text-muted-foreground">The person must</p>
          <ul className="mt-8 space-y-4">
            {TODAY.map((t) => (
              <li key={t} className="border-b border-border pb-4 text-lg text-muted-foreground">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-otto/40 bg-surface p-8 shadow-lift md:p-10">
          <span className="eyebrow text-otto">Future</span>
          <p className="mt-3 flex items-center gap-2 text-xl font-semibold">
            <span className="text-otto">
              <OttoMark size={18} />
            </span>
            The AI environment
          </p>
          <ul className="mt-8 space-y-4">
            {FUTURE.map((t) => (
              <li key={t} className="border-b border-border pb-4 text-lg font-medium">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        The person still decides. The environment does the rest.
      </p>
    </section>
  );
}
