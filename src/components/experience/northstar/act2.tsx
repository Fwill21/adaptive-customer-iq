/**
 * Act 2 — the persistent Northstar workspace on LUX.
 *
 * Every moment renders into the same customer canvas: quiet background
 * intelligence on the rail, human-judgment moments called out explicitly,
 * and evidence always one click away from any AI conclusion.
 */

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ADOPTION_TRAJECTORY,
  CAUSAL_CHAIN,
  CUSTOMER_LINE,
  EVIDENCE,
  LEDGER,
  LUX_ACTIVITY,
  MAYA_MEETING_LINE,
  NEEDS_MAYA,
  NORTHSTAR,
  ORCHESTRATION_STAGES,
  OUTCOME_VIEW,
  PREPARED_BY_LUX,
  PRIORITY_SIGNAL,
  PROPOSED_MILESTONE,
  QBR_ARTIFACT_SLIDES,
  QBR_DECISIONS,
  QBR_STORY,
  RECOMMENDATIONS,
  SPECIALIST_HANDOFF,
  SYNC_TARGETS,
  type EvidenceId,
  type QimStepId,
} from "@/lib/northstar-data";
import { ActionButton } from "../drawer";
import { CanvasHeader, Chip, OttoSpark } from "../lux";
import { Surface } from "../shell";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Paperclip,
  Presentation,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/* ───────────── shared bits ───────────── */

export function JudgmentBadge({ children }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-human/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-human">
      <ShieldCheck className="size-3" aria-hidden="true" />
      {children ?? "Maya decision"}
    </span>
  );
}

function MayaSays({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-human/30 p-4">
      <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-human">
        Maya
      </span>
      <p className="text-[14.5px] leading-relaxed">{children}</p>
    </div>
  );
}

export function EvidenceChip({
  id,
  onOpen,
}: {
  id: EvidenceId;
  onOpen: (id: EvidenceId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(id)}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-otto/50 hover:text-otto"
    >
      <Paperclip className="size-3" aria-hidden="true" />
      {EVIDENCE[id].label}
    </button>
  );
}

function EvidenceCard({ id, onClose }: { id: EvidenceId; onClose: () => void }) {
  const e = EVIDENCE[id];
  return (
    <Surface className="soft-in space-y-2 border-otto/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-otto">{e.label}</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {e.source} · {e.when}
          </p>
        </div>
        <ActionButton variant="tertiary" onClick={onClose}>
          Close
        </ActionButton>
      </div>
      <ul className="space-y-1.5 text-[13.5px] leading-relaxed">
        {e.body.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </Surface>
  );
}

/** Quiet background intelligence — work continues between Maya's interactions. */
export function ActivityRail({ step, focus }: { step: QimStepId; focus?: string | undefined }) {
  const order: QimStepId[] = ["l1", "l2", "l3", "l4", "l5"];
  const upto = Math.max(0, order.indexOf(step));
  const shown = LUX_ACTIVITY.filter((a) => order.indexOf(a.step) <= upto);
  return (
    <aside className="space-y-3">
      <Surface className="space-y-3 p-4">
        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <OttoSpark size={12} /> LUX activity
        </p>
        <ul className="space-y-2">
          {shown.map((a, i) => (
            <li
              key={a.text}
              className={cn(
                "flex items-start gap-2 text-[12.5px] leading-snug",
                i === shown.length - 1 ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <Check className="mt-0.5 size-3 shrink-0 text-otto" aria-hidden="true" />
              <span>
                <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground">
                  {a.at}
                </span>{" "}
                {a.text}
              </span>
            </li>
          ))}
        </ul>
        <p className="border-t border-border pt-2 text-[11.5px] text-muted-foreground">
          Continuous. Nothing here needed Maya.
        </p>
      </Surface>

      {focus && (
        <Surface className="space-y-2 border-human/35 p-4">
          <JudgmentBadge />
          <p className="text-[13px] leading-relaxed">{focus}</p>
        </Surface>
      )}
    </aside>
  );
}

export function Ledger({ step }: { step: "l1" | "l2" | "l3" | "l4" | "l5" }) {
  const l = LEDGER[step];
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {[
        { k: "Less of", v: l.less, cls: "border-border" },
        { k: "More of", v: l.more, cls: "border-otto/30 bg-otto-soft" },
        { k: "Human judgment remains", v: l.human, cls: "border-human/35" },
      ].map((c) => (
        <div key={c.k} className={cn("rounded-xl border p-4", c.cls)}>
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {c.k}
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed">{c.v}</p>
        </div>
      ))}
    </div>
  );
}

/* ───────────── Moment 1 — What deserves my attention? ───────────── */

export function MomentAttention({
  onOpenWorkspace,
}: {
  onOpenWorkspace: () => void;
}) {
  const [opened, setOpened] = useState(false);
  const [why, setWhy] = useState(false);

  return (
    <div className="space-y-6">
      <CanvasHeader
        eyebrow="Reimagined on LUX · 01"
        title="What deserves my attention?"
        meta="Maya is working on another account. LUX notices the change."
      />

      {!opened ? (
        <Surface className="rise mx-auto max-w-2xl space-y-4 border-signal/35">
          <div className="flex items-center gap-2">
            <OttoSpark size={14} />
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">
              Priority signal
            </p>
          </div>
          <div>
            <p className="text-[18px] font-semibold tracking-tight">{NORTHSTAR.name}</p>
            <p className="text-[14px] font-medium text-signal">{PRIORITY_SIGNAL.headline}</p>
            <p className="mt-1 text-[14px] text-muted-foreground">{PRIORITY_SIGNAL.support}</p>
          </div>
          <ul className="space-y-2 border-y border-border py-4">
            {PRIORITY_SIGNAL.signals.map((s) => (
              <li key={s.label} className="flex flex-wrap items-baseline gap-x-2 text-[13.5px]">
                <span className="size-1.5 rounded-full bg-signal" />
                <span className="font-medium">{s.label}</span>
                <span className="text-muted-foreground">{s.value}</span>
              </li>
            ))}
          </ul>
          <p className="text-[13px] font-medium text-otto">{PRIORITY_SIGNAL.outcomeNote}</p>
          <ActionButton variant="primary" onClick={() => setOpened(true)}>
            Review why this matters
          </ActionButton>
        </Surface>
      ) : (
        <div className="space-y-5">
          <Surface className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[15px] font-semibold">Three connected changes</p>
              <Chip tone="positive">Outcome unchanged</Chip>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {PRIORITY_SIGNAL.signals.map((s) => (
                <div key={s.label} className="rounded-xl border border-border p-4">
                  <p className="text-[13px] font-medium">{s.label}</p>
                  <p className="mt-1 text-[18px] font-semibold tracking-tight">{s.value}</p>
                  <p className="mt-1 text-[12px] text-muted-foreground">{s.note}</p>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="space-y-3">
            <button
              type="button"
              onClick={() => setWhy((v) => !v)}
              className="flex w-full items-center justify-between gap-3 text-left"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-otto">
                Why surfaced
              </span>
              <ChevronDown
                className={cn("size-4 text-muted-foreground transition-transform", why && "rotate-180")}
                aria-hidden="true"
              />
            </button>
            {why && (
              <div className="soft-in space-y-3">
                <ul className="space-y-2 text-[13.5px] leading-relaxed">
                  {PRIORITY_SIGNAL.whySurfaced.reasoning.map((r) => (
                    <li key={r} className="flex gap-2">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-otto" />
                      {r}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                  {PRIORITY_SIGNAL.whySurfaced.evidence.map((e) => (
                    <Chip key={e}>{e}</Chip>
                  ))}
                </div>
              </div>
            )}
          </Surface>

          <Surface className="flex flex-wrap items-center justify-between gap-3 border-human/35">
            <div>
              <JudgmentBadge />
              <p className="mt-2 text-[14px]">
                The system suggests. Maya decides whether Northstar deserves her attention.
              </p>
            </div>
            <div className="flex gap-2">
              <ActionButton variant="secondary" onClick={onOpenWorkspace}>
                Not now
              </ActionButton>
              <ActionButton variant="primary" onClick={onOpenWorkspace}>
                Investigate now
              </ActionButton>
            </div>
          </Surface>

          <Ledger step="l1" />
        </div>
      )}
    </div>
  );
}

/* ───────────── Moment 2 — What is really happening? ───────────── */

function Trajectory() {
  const max = 72;
  return (
    <div className="flex h-28 items-end gap-3">
      {ADOPTION_TRAJECTORY.map((p) => (
        <div key={p.week} className="flex flex-1 flex-col items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">{p.value}%</span>
          <div
            className="w-full rounded-t-md bg-signal/35"
            style={{ height: `${(p.value / max) * 76}px` }}
          />
          <span className="font-mono text-[10px] text-muted-foreground">{p.week}</span>
        </div>
      ))}
    </div>
  );
}

export function MomentUnderstand({ onNext }: { onNext: () => void }) {
  const [evidence, setEvidence] = useState<EvidenceId | null>(null);
  const [timeline, setTimeline] = useState(false);
  const [marked, setMarked] = useState(false);
  const [reframed, setReframed] = useState(false);

  return (
    <div className="space-y-6">
      <CanvasHeader
        eyebrow="Northstar workspace · Outcome view"
        title="What is really happening?"
        meta={`${NORTHSTAR.outcome} · ${NORTHSTAR.quarter}`}
        actions={<Chip tone="positive">Objective unchanged</Chip>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Surface className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Progress against outcome
          </p>
          <p className="text-[26px] font-semibold tracking-tight">{NORTHSTAR.progress}%</p>
          <div className="h-1.5 w-full rounded-full bg-secondary">
            <div className="h-1.5 rounded-full bg-otto" style={{ width: `${NORTHSTAR.progress}%` }} />
          </div>
          <p className="text-[12.5px] text-muted-foreground">17% handling-time reduction of 30%</p>
        </Surface>
        <Surface className="space-y-2 lg:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Adoption trajectory
          </p>
          <Trajectory />
        </Surface>
      </div>

      <Surface className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[15px] font-semibold">What is connected to what</p>
          <ActionButton
            variant={timeline ? "tertiary" : "secondary"}
            done={timeline}
            doneLabel="Dependency timeline open"
            onClick={() => setTimeline(true)}
          >
            Open dependency timeline
          </ActionButton>
        </div>
        <div className="space-y-1">
          {CAUSAL_CHAIN.map((c, i) => (
            <div key={c.title}>
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium">{c.title}</p>
                  <p className="text-[12.5px] text-muted-foreground">{c.note}</p>
                </div>
                <EvidenceChip id={c.evidence} onOpen={setEvidence} />
              </div>
              {i < CAUSAL_CHAIN.length - 1 && (
                <div className="flex justify-center py-1 text-muted-foreground">
                  <ArrowDown className="size-4" aria-hidden="true" />
                </div>
              )}
            </div>
          ))}
        </div>
        {timeline && (
          <div className="soft-in grid gap-2 border-t border-border pt-4 md:grid-cols-3">
            {[
              { w: "Week 5", t: "Wave 2 slips; ops pauses network 3 onboarding" },
              { w: "Week 8", t: "Cutover moves again; validation outstanding" },
              { w: "Week 9", t: "Adoption reaches 49%; outcome target unchanged" },
            ].map((s) => (
              <div key={s.w} className="rounded-xl border border-border p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-otto">{s.w}</p>
                <p className="mt-1 text-[13px] leading-snug">{s.t}</p>
              </div>
            ))}
          </div>
        )}
      </Surface>

      {evidence && <EvidenceCard id={evidence} onClose={() => setEvidence(null)} />}

      <div className="grid gap-4 md:grid-cols-2">
        <Surface className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Commitments
          </p>
          <ul className="space-y-2">
            {OUTCOME_VIEW.commitments.map((c) => (
              <li key={c.text} className="text-[13.5px]">
                <p className="font-medium">{c.text}</p>
                <p className="text-[12px] text-muted-foreground">
                  {c.status} · {c.owner}
                </p>
              </li>
            ))}
          </ul>
        </Surface>
        <Surface className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Active blockers
          </p>
          <ul className="space-y-2">
            {OUTCOME_VIEW.blockers.map((b) => (
              <li key={b.text} className="flex flex-wrap items-center gap-2 text-[13.5px]">
                <span className="font-medium">{b.text}</span>
                <Chip tone={marked && b.severity === "Current blocker" ? "attention" : "quiet"}>
                  {marked && b.severity === "Current blocker" ? "Marked by Maya" : b.severity}
                </Chip>
              </li>
            ))}
          </ul>
          {!marked && (
            <ActionButton variant="secondary" onClick={() => setMarked(true)}>
              Mark migration dependency as the current blocker
            </ActionButton>
          )}
        </Surface>
        <Surface className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Stakeholder activity
          </p>
          <ul className="space-y-2">
            {OUTCOME_VIEW.stakeholders.map((s) => (
              <li key={s.name} className="text-[13.5px]">
                <p className="font-medium">{s.name}</p>
                <p className="text-[12px] text-muted-foreground">
                  {s.role} · {s.activity}
                </p>
              </li>
            ))}
          </ul>
        </Surface>
        <Surface className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Related internal work & customer moments
          </p>
          <ul className="space-y-1.5 text-[13.5px]">
            {OUTCOME_VIEW.internalWork.map((w) => (
              <li key={w.text} className="text-muted-foreground">
                <span className="text-foreground">{w.text}</span> · {w.owner}
              </li>
            ))}
          </ul>
          <ul className="space-y-1.5 border-t border-border pt-3 text-[13.5px]">
            {OUTCOME_VIEW.moments.map((m) => (
              <li key={m.text} className="text-muted-foreground">
                <span className="text-foreground">{m.text}</span> · {m.when}
              </li>
            ))}
          </ul>
        </Surface>
      </div>

      <Surface className="space-y-3 border-human/35">
        <JudgmentBadge>Does the evidence support the explanation?</JudgmentBadge>
        {reframed ? (
          <>
            <MayaSays>“The goal is still healthy. The path to it is what changed.”</MayaSays>
            <div className="flex flex-wrap gap-2">
              <Chip tone="positive">Customer outcome: healthy</Chip>
              <Chip tone="attention">Adoption: effect, not root cause</Chip>
              <Chip tone="attention">Root cause: Wave 2 dependency</Chip>
            </div>
            <ActionButton variant="primary" onClick={onNext}>
              What should we do about it?
            </ActionButton>
          </>
        ) : (
          <ActionButton variant="primary" onClick={() => setReframed(true)}>
            Reframe adoption as an effect, keep the outcome healthy
          </ActionButton>
        )}
      </Surface>

      <Ledger step="l2" />
    </div>
  );
}

/* ───────────── Moment 3 — What should we do? ───────────── */

function Orchestration({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    if (stage >= ORCHESTRATION_STAGES.length) {
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStage((s) => s + 1), 620);
    return () => clearTimeout(t);
  }, [stage, onDone]);

  return (
    <Surface className="space-y-3">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-otto">
        <OttoSpark size={12} /> Working on it
      </p>
      <ol className="space-y-2">
        {ORCHESTRATION_STAGES.map((s, i) => (
          <li
            key={s}
            className={cn(
              "flex items-center gap-2 text-[13.5px] transition-opacity duration-300",
              i < stage ? "text-foreground opacity-100" : "text-muted-foreground/40 opacity-70",
            )}
          >
            {i < stage ? (
              <Check className="size-3.5 text-otto" aria-hidden="true" />
            ) : (
              <span className="size-3.5 rounded-full border border-border" />
            )}
            {s}
          </li>
        ))}
      </ol>
    </Surface>
  );
}

export function MomentDecide({ onNext }: { onNext: () => void }) {
  const [order, setOrder] = useState(RECOMMENDATIONS.map((r) => r.id));
  const [selected, setSelected] = useState<string[]>([]);
  const [framing, setFraming] = useState(
    "Open with what Northstar accomplished, then explain why progress slowed and what we recommend.",
  );
  const [editing, setEditing] = useState(false);
  const [phase, setPhase] = useState<"choose" | "orchestrating" | "results">("choose");
  const [handoff, setHandoff] = useState(false);
  const [evidence, setEvidence] = useState<EvidenceId | null>(null);

  const move = (id: string, dir: -1 | 1) => {
    setOrder((prev) => {
      const i = prev.indexOf(id);
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });
  };

  const recs = order.map((id) => RECOMMENDATIONS.find((r) => r.id === id)!);

  return (
    <div className="space-y-6">
      <CanvasHeader
        eyebrow="Northstar workspace · Recommendations"
        title="What should we do about it?"
        meta="LUX proposes. Maya sets the priority and decides what may change."
      />

      <div className="space-y-3">
        {recs.map((r, i) => (
          <Surface key={r.id} className="space-y-3">
            <div className="flex flex-wrap items-start gap-3">
              <span className="font-mono text-[11px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-[15px] font-medium">{r.title}</p>
                <p className="text-[13px] text-muted-foreground">{r.reason}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Move up"
                  onClick={() => move(r.id, -1)}
                  className="rounded-md border border-border p-1 text-muted-foreground hover:text-foreground"
                >
                  <ArrowUp className="size-3.5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Move down"
                  onClick={() => move(r.id, 1)}
                  className="rounded-md border border-border p-1 text-muted-foreground hover:text-foreground"
                >
                  <ArrowDown className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="grid gap-2 text-[12.5px] text-muted-foreground md:grid-cols-2">
              <p>
                <span className="text-foreground">Expected impact:</span> {r.impact}
              </p>
              <p>
                <span className="text-foreground">Affects commitment:</span> {r.commitment}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Chip tone={r.status === "NEEDS HUMAN JUDGMENT" ? "attention" : r.status === "CUSTOMER COMMITMENT" ? "risk" : "positive"}>
                {r.status}
              </Chip>
              {r.luxCanPrepare && <Chip tone="ai">LUX can prepare</Chip>}
              {r.mayaMustApprove && <JudgmentBadge>Maya approves</JudgmentBadge>}
              {r.evidence.map((e) => (
                <EvidenceChip key={e} id={e} onOpen={setEvidence} />
              ))}
            </div>

            {r.id === "framing" && (
              <div className="space-y-2 rounded-xl border border-border p-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                  QBR framing — Maya edits
                </p>
                {editing ? (
                  <textarea
                    value={framing}
                    onChange={(e) => setFraming(e.target.value)}
                    onBlur={() => setEditing(false)}
                    rows={3}
                    className="w-full rounded-lg border border-border bg-background p-2 text-[13.5px] outline-none focus:border-otto"
                  />
                ) : (
                  <p className="text-[13.5px] leading-relaxed">{framing}</p>
                )}
                <ActionButton variant="secondary" onClick={() => setEditing((v) => !v)}>
                  {editing ? "Save framing" : "Edit framing"}
                </ActionButton>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {r.id === "milestone" ? (
                <ActionButton
                  variant="secondary"
                  done={selected.includes("milestone")}
                  doneLabel="Kept in Proposed"
                  onClick={() => setSelected((p) => [...p, "milestone"])}
                >
                  Prepare, but keep as Proposed
                </ActionButton>
              ) : (
                <ActionButton
                  variant={r.id === "specialist" ? "primary" : "secondary"}
                  done={selected.includes(r.id)}
                  doneLabel="Selected"
                  onClick={() => setSelected((p) => [...p, r.id])}
                >
                  {r.id === "specialist" ? "Bring in migration specialist" : "Use this framing"}
                </ActionButton>
              )}
            </div>
          </Surface>
        ))}
      </div>

      {evidence && <EvidenceCard id={evidence} onClose={() => setEvidence(null)} />}

      <MayaSays>
        “Prepare the new milestone, but don't change it yet. I want to discuss it with the customer.
        Bring the migration specialist into the working session and update the QBR story.”
      </MayaSays>

      {phase === "choose" && selected.length >= 2 && (
        <ActionButton variant="primary" onClick={() => setPhase("orchestrating")}>
          Give Otto the intent
        </ActionButton>
      )}

      {phase === "orchestrating" && <Orchestration onDone={() => setPhase("results")} />}

      {phase === "results" && (
        <>
          <div className="soft-in grid gap-4 md:grid-cols-2">
            <Surface className="space-y-3 border-otto/30">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-otto">
                <Sparkles className="size-3" aria-hidden="true" /> Prepared by LUX
              </p>
              <ul className="space-y-2 text-[13.5px]">
                {PREPARED_BY_LUX.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check className="mt-0.5 size-3.5 shrink-0 text-otto" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
            </Surface>
            <Surface className="space-y-3 border-human/35">
              <JudgmentBadge>Needs Maya</JudgmentBadge>
              <ul className="space-y-2 text-[13.5px]">
                {NEEDS_MAYA.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-human" />
                    {p}
                  </li>
                ))}
              </ul>
            </Surface>
          </div>

          <Surface className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold">{SPECIALIST_HANDOFF.name}</p>
                <p className="text-[12.5px] text-muted-foreground">{SPECIALIST_HANDOFF.role}</p>
              </div>
              {handoff ? (
                <Chip tone="positive">Northstar context attached</Chip>
              ) : (
                <ActionButton variant="primary" onClick={() => setHandoff(true)}>
                  Bring in migration specialist
                </ActionButton>
              )}
            </div>
            {handoff && (
              <div className="soft-in space-y-3">
                <ul className="grid gap-2 md:grid-cols-2">
                  {SPECIALIST_HANDOFF.attached.map((a) => (
                    <li key={a.label} className="rounded-lg border border-border p-2.5 text-[12.5px]">
                      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        {a.label}
                      </span>
                      <p className="mt-0.5">{a.value}</p>
                    </li>
                  ))}
                </ul>
                <p className="rounded-xl border border-border bg-secondary/50 p-3 text-[13.5px] leading-relaxed">
                  <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    Priya
                  </span>
                  {SPECIALIST_HANDOFF.reply}
                </p>
                <p className="text-[12.5px] text-muted-foreground">
                  Maya never restarted the customer story.
                </p>
                <ActionButton variant="primary" onClick={onNext}>
                  Continue to the QBR
                </ActionButton>
              </div>
            )}
          </Surface>
        </>
      )}

      <Ledger step="l3" />
    </div>
  );
}

/* ───────────── Moment 4 — Prepare & conduct the QBR ───────────── */

export function MomentQbr({ onNext }: { onNext: () => void }) {
  const [tab, setTab] = useState<"story" | "artifact">("story");
  const [order, setOrder] = useState(QBR_STORY.map((s) => s.id));
  const [opening, setOpening] = useState(
    QBR_STORY.find((s) => s.id === "progress")!.body,
  );
  const [editing, setEditing] = useState(false);
  const [held, setHeld] = useState<string[]>([]);
  const [approved, setApproved] = useState(false);
  const [meeting, setMeeting] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [evidence, setEvidence] = useState<EvidenceId | null>(null);

  const sections = order.map((id) => QBR_STORY.find((s) => s.id === id)!);

  const move = (id: string, dir: -1 | 1) =>
    setOrder((prev) => {
      const i = prev.indexOf(id as never);
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });

  if (meeting) {
    return (
      <div className="space-y-6">
        <CanvasHeader
          eyebrow="Customer conversation · Northstar Health"
          title="Quarterly Business Review"
          meta="Maya presents. Otto stays available and secondary."
          actions={<Chip tone="quiet">Otto: listening</Chip>}
        />
        <Surface className="space-y-4">
          <p className="rounded-xl border border-border bg-secondary/50 p-4 text-[15px] leading-relaxed">
            <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Dr. Okafor
            </span>
            “{CUSTOMER_LINE}”
          </p>
          {!showTimeline ? (
            <ActionButton variant="primary" onClick={() => setShowTimeline(true)}>
              Show dependency timeline
            </ActionButton>
          ) : (
            <div className="soft-in grid gap-2 md:grid-cols-3">
              {CAUSAL_CHAIN.map((c) => (
                <div key={c.title} className="rounded-xl border border-border p-3">
                  <p className="text-[13.5px] font-medium">{c.title}</p>
                  <p className="mt-1 text-[12.5px] text-muted-foreground">{c.note}</p>
                </div>
              ))}
            </div>
          )}
          {showTimeline && (
            <>
              <MayaSays>“{MAYA_MEETING_LINE}”</MayaSays>
              <div className="flex flex-wrap items-center gap-3">
                <JudgmentBadge>What changes after hearing the customer</JudgmentBadge>
                <ActionButton
                  variant="primary"
                  done={captured}
                  doneLabel="Decision captured in the workspace"
                  onClick={() => setCaptured(true)}
                >
                  Capture this decision
                </ActionButton>
              </div>
            </>
          )}
          {captured && (
            <ActionButton variant="primary" onClick={onNext}>
              Carry the outcome forward
            </ActionButton>
          )}
        </Surface>
        <Ledger step="l4" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CanvasHeader
        eyebrow="Priority signal · Northstar QBR"
        title="Ready for Maya review"
        meta="Assembled from a quarter of decisions, evidence and customer context — not from last week."
        actions={
          <div className="flex gap-1 rounded-lg border border-border p-0.5">
            {(["story", "artifact"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-md px-3 py-1 text-[12.5px] capitalize transition-colors",
                  tab === t ? "bg-secondary font-medium" : "text-muted-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        }
      />

      {tab === "story" ? (
        <div className="space-y-3">
          {sections.map((s, i) => {
            const isOpening = i === 0;
            const isHeld = held.includes(s.id);
            return (
              <Surface key={s.id} className={cn("space-y-2", isHeld && "opacity-60")}>
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-semibold">{s.heading}</p>
                    {isOpening && editing ? (
                      <textarea
                        value={opening}
                        onChange={(e) => setOpening(e.target.value)}
                        onBlur={() => setEditing(false)}
                        rows={3}
                        className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-[13.5px] outline-none focus:border-otto"
                      />
                    ) : (
                      <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
                        {isOpening ? opening : s.body}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Move section up"
                      onClick={() => move(s.id, -1)}
                      className="rounded-md border border-border p-1 text-muted-foreground hover:text-foreground"
                    >
                      <ArrowUp className="size-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      aria-label="Move section down"
                      onClick={() => move(s.id, 1)}
                      className="rounded-md border border-border p-1 text-muted-foreground hover:text-foreground"
                    >
                      <ArrowDown className="size-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {s.evidence.map((e) => (
                    <EvidenceChip key={e} id={e} onOpen={setEvidence} />
                  ))}
                  {s.incomplete && (
                    <>
                      <Chip tone="risk">Evidence incomplete</Chip>
                      <ActionButton
                        variant="secondary"
                        done={isHeld}
                        doneLabel="Held from customer version"
                        onClick={() => setHeld((p) => [...p, s.id])}
                      >
                        Hold from customer version
                      </ActionButton>
                    </>
                  )}
                  {isOpening && (
                    <ActionButton variant="secondary" onClick={() => setEditing((v) => !v)}>
                      {editing ? "Save opening" : "Change the opening"}
                    </ActionButton>
                  )}
                </div>
              </Surface>
            );
          })}
        </div>
      ) : (
        <Surface className="space-y-3">
          <p className="flex items-center gap-2 text-[15px] font-semibold">
            <Presentation className="size-4 text-muted-foreground" aria-hidden="true" />
            Customer-facing artifact
          </p>
          <ol className="grid gap-2 md:grid-cols-2">
            {QBR_ARTIFACT_SLIDES.map((s, i) => (
              <li key={s} className="rounded-xl border border-border p-3 text-[13.5px]">
                <span className="font-mono text-[10px] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
                {s}
              </li>
            ))}
          </ol>
          <p className="text-[12.5px] text-muted-foreground">
            {held.length} claim{held.length === 1 ? "" : "s"} held out pending evidence.
          </p>
        </Surface>
      )}

      {evidence && <EvidenceCard id={evidence} onClose={() => setEvidence(null)} />}

      <MayaSays>
        “Don't lead with adoption being down. Start with what they accomplished this quarter, then
        explain why progress slowed.”
      </MayaSays>

      <Surface className="flex flex-wrap items-center justify-between gap-3 border-human/35">
        <JudgmentBadge>What ServiceNow says to the customer</JudgmentBadge>
        <div className="flex flex-wrap gap-2">
          <ActionButton
            variant="secondary"
            done={approved}
            doneLabel="Customer-facing QBR approved"
            onClick={() => setApproved(true)}
          >
            Approve customer-facing QBR
          </ActionButton>
          {approved && (
            <ActionButton variant="primary" onClick={() => setMeeting(true)}>
              Enter the QBR
            </ActionButton>
          )}
        </div>
      </Surface>

      <Ledger step="l4" />
    </div>
  );
}

/* ───────────── Moment 5 — Carry the outcome forward ───────────── */

export function MomentForward({ onNext }: { onNext: () => void }) {
  const [open, setOpen] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [synced, setSynced] = useState<string[]>([]);

  useEffect(() => {
    if (!committed) return;
    const timers = SYNC_TARGETS.map((t, i) =>
      setTimeout(() => setSynced((p) => [...p, t]), 260 * (i + 1)),
    );
    return () => timers.forEach(clearTimeout);
  }, [committed]);

  return (
    <div className="space-y-6">
      <CanvasHeader
        eyebrow="Northstar workspace · Decisions"
        title="QBR decisions captured"
        meta="No new administrative process — the workspace already holds the meeting."
      />

      <div className="grid gap-3 md:grid-cols-2">
        {QBR_DECISIONS.map((d) => {
          const state = d.id === "d3" && committed ? "Synchronized" : d.state;
          return (
            <Surface key={d.id} className={cn("space-y-2", d.needsMaya && !committed && "border-human/35")}>
              <p className="text-[14px] font-medium">{d.text}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone={state === "Synchronized" ? "positive" : state === "Pending Approval" ? "attention" : "quiet"}>
                  {state}
                </Chip>
                {d.needsMaya && !committed && <JudgmentBadge>Maya approves</JudgmentBadge>}
              </div>
            </Surface>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Surface className="space-y-3 border-otto/30">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-otto">
            <Sparkles className="size-3" aria-hidden="true" /> Prepared by LUX
          </p>
          <ul className="space-y-2 text-[13.5px]">
            {[
              "Customer recap",
              "Internal follow-up",
              "Proposed next-quarter plan",
              "Next working-session context",
              "Workflow & task updates",
            ].map((p) => (
              <li key={p} className="flex gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-otto" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </Surface>

        <Surface className="space-y-3 border-human/35">
          <JudgmentBadge>Needs Maya</JudgmentBadge>
          <p className="text-[14.5px] font-semibold">{PROPOSED_MILESTONE.title}</p>
          {!open ? (
            <ActionButton variant="secondary" onClick={() => setOpen(true)}>
              Open proposed milestone
            </ActionButton>
          ) : (
            <div className="soft-in space-y-2 text-[13px]">
              {[
                ["Wording", PROPOSED_MILESTONE.wording],
                ["Owner", PROPOSED_MILESTONE.owner],
                ["Timing", PROPOSED_MILESTONE.timing],
                ["Affected commitment", PROPOSED_MILESTONE.commitment],
              ].map(([k, v]) => (
                <p key={k as string}>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {k}
                  </span>
                  <span className="mt-0.5 block leading-relaxed">{v}</span>
                </p>
              ))}
              <ActionButton
                variant="primary"
                done={committed}
                doneLabel="Committed"
                onClick={() => setCommitted(true)}
              >
                Commit
              </ActionButton>
            </div>
          )}
        </Surface>
      </div>

      {committed && (
        <Surface className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Synchronizing
          </p>
          <ul className="grid gap-2 md:grid-cols-5">
            {SYNC_TARGETS.map((t) => (
              <li
                key={t}
                className={cn(
                  "flex items-center gap-2 rounded-xl border p-3 text-[12.5px] transition-colors duration-300",
                  synced.includes(t) ? "border-otto/35 bg-otto-soft text-otto" : "border-border text-muted-foreground/50",
                )}
              >
                {synced.includes(t) && <Check className="size-3.5" aria-hidden="true" />}
                {t}
              </li>
            ))}
          </ul>
          {synced.length === SYNC_TARGETS.length && (
            <div className="soft-in space-y-3 border-t border-border pt-3">
              <p className="flex gap-3 text-[14.5px] leading-relaxed">
                <span className="mt-0.5 shrink-0 text-otto">
                  <OttoSpark size={14} />
                </span>
                “The customer plan, internal actions and next working session are aligned. I'll
                continue watching the migration dependency and bring Northstar back into focus if it
                changes the outcome plan.”
              </p>
              <ActionButton variant="primary" onClick={onNext}>
                See the takeaway
              </ActionButton>
            </div>
          )}
        </Surface>
      )}

      <Ledger step="l5" />
    </div>
  );
}
