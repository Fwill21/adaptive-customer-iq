/**
 * Layer 3 — the adaptive work canvas.
 *
 * Nothing here is permanent. Each moment assembles only the components the CSM
 * needs to understand or complete that moment, organised around the customer's
 * goal rather than around the records that exist.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ADOPTION_SERIES,
  AFFECTED_WORKFLOWS,
  ARTIFACT,
  CUSTOMER,
  INTERVENTION,
  SIGNALS,
  SUPPORT_EVIDENCE,
  TEAM,
  TEAM_BRIEF,
  THREAD,
  type AdaptiveMomentId,
} from "@/lib/adaptive-data";
import { ActionButton } from "./drawer";
import { CanvasHeader, Chip, LuxAvatar, OttoSpark } from "./lux";
import { ChevronRight, TrendingDown } from "lucide-react";

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("rounded-xl border border-border bg-surface p-5", className)}
    >
      {children}
    </section>
  );
}

function GoalStrip() {
  return (
    <Card className="bg-surface">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Customer priority
          </p>
          <p className="mt-1 max-w-[42rem] text-[14px] leading-relaxed">{CUSTOMER.priority}</p>
          <p className="mt-1.5 text-[11.5px] text-muted-foreground">{CUSTOMER.commitment}</p>
        </div>
        <div className="w-40">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] text-muted-foreground">Progress</span>
            <span className="text-[15px] font-semibold">{CUSTOMER.progress}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
            <span
              className="block h-full rounded-full bg-otto"
              style={{ width: `${CUSTOMER.progress}%` }}
            />
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground">{CUSTOMER.nextMoment}</p>
        </div>
      </div>
    </Card>
  );
}

function Disclose({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[12.5px] text-muted-foreground transition-colors hover:text-foreground"
      >
        {label}
        <ChevronRight
          className={cn("size-3.5 transition-transform", open && "rotate-90")}
          aria-hidden="true"
        />
      </button>
      {open && <div className="soft-in border-t border-border px-3.5 py-3">{children}</div>}
    </div>
  );
}

/* ─────────────── Moment 1: focused signal ─────────────── */

function SignalCanvas({ onAct }: { onAct: (a: string) => void }) {
  return (
    <div className="space-y-4">
      <CanvasHeader
        eyebrow="Needs your attention first"
        title={CUSTOMER.name}
        meta={`${CUSTOMER.segment} · ${CUSTOMER.quarter}`}
        actions={<Chip tone="ai">Otto connected 3 signals</Chip>}
      />
      <Card>
        <p className="text-[15px] leading-relaxed">
          Their Q3 automation outcome may be at risk.
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3">
          {SIGNALS.map((s) => (
            <div key={s.label} className="rounded-lg border border-border px-3.5 py-3">
              <dt className="text-[11.5px] text-muted-foreground">{s.label}</dt>
              <dd className="mt-1 text-[18px] font-semibold">{s.value}</dd>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </dl>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <ActionButton variant="primary" onClick={() => onAct("review")}>
            Review why
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => onAct("second")}>
            Show second priority
          </ActionButton>
          <ActionButton variant="tertiary" onClick={() => onAct("dismiss")}>
            Not a concern
          </ActionButton>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────── Moment 2: relevant evidence ─────────────── */

function AdoptionSpark() {
  const max = 72;
  const min = 46;
  const points = ADOPTION_SERIES.map((d, i) => {
    const x = (i / (ADOPTION_SERIES.length - 1)) * 100;
    const y = 96 - ((d.value - min) / (max - min)) * 92;
    return `${x},${y}`;
  }).join(" ");
  return (
    <div>
      <div className="flex items-baseline gap-3">
        <span className="text-[26px] font-semibold tracking-tight">68% → 51%</span>
        <Chip tone="attention">
          <TrendingDown className="size-3" aria-hidden="true" /> ↓ 17 pts
        </Chip>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-3 h-24 w-full">
        <polyline
          points={points}
          fill="none"
          stroke="var(--color-signal)"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-1 flex justify-between text-[10.5px] text-muted-foreground">
        {ADOPTION_SERIES.map((d) => (
          <span key={d.week}>{d.week}</span>
        ))}
      </div>
    </div>
  );
}

function EvidenceCanvas({
  onAct,
  showSupport,
}: {
  onAct: (a: string) => void;
  showSupport: boolean;
}) {
  return (
    <div className="space-y-4">
      <CanvasHeader
        eyebrow="What changed"
        title="Adoption declined where the outcome lives"
        meta="Two workflows carry Northwind's Q3 automation target"
      />
      <GoalStrip />
      <Card>
        <AdoptionSpark />
        <p className="mt-3 max-w-[44rem] text-[13.5px] leading-relaxed text-muted-foreground">
          Adoption declined primarily in the two workflows responsible for Northwind's Q3
          automation target.
        </p>
        <ul className="mt-4 space-y-2">
          {AFFECTED_WORKFLOWS.map((w) => (
            <li
              key={w.name}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-border px-3.5 py-3"
            >
              <div className="min-w-0">
                <p className="text-[13.5px] font-medium">{w.name}</p>
                <p className="mt-0.5 text-[11.5px] text-muted-foreground">{w.note}</p>
              </div>
              <span className="text-[13px] font-semibold text-signal">{w.change}</span>
            </li>
          ))}
        </ul>

        {showSupport ? (
          <div className="soft-in mt-4">
            <p className="flex items-center gap-1.5 text-[12px] font-medium text-otto">
              <OttoSpark size={12} /> Another factor: three P1 cases hit the same workflows
            </p>
            <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
              {SUPPORT_EVIDENCE.map((c) => (
                <li key={c.id} className="flex flex-wrap items-baseline gap-x-3 px-3.5 py-2.5">
                  <span className="font-mono text-[11px] text-muted-foreground">{c.id}</span>
                  <span className="text-[13px]">{c.title}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">{c.age}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4">
            <ActionButton variant="ai" onClick={() => onAct("support")}>
              Otto found another factor
            </ActionButton>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <ActionButton variant="primary" onClick={() => onAct("intervene")}>
            This matters — recommend a next step
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => onAct("qir")}>
            Compare last QIR
          </ActionButton>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────── Moment 3: human judgment ─────────────── */

function DecisionCanvas({ onAct }: { onAct: (a: string) => void }) {
  return (
    <div className="space-y-4">
      <CanvasHeader
        eyebrow="Recommended intervention"
        title={INTERVENTION.recommendation}
        meta="Otto prepared both routes. The decision is yours."
        actions={<Chip tone="ai">AI recommendation</Chip>}
      />
      <Card>
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Why
        </p>
        <ul className="mt-2 space-y-1.5">
          {INTERVENTION.because.map((b) => (
            <li key={b} className="flex gap-2.5 text-[13.5px] leading-snug">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-signal" />
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <ActionButton variant="primary" onClick={() => onAct("coordinate")}>
            Coordinate account team
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => onAct("contact")}>
            Contact customer
          </ActionButton>
          <ActionButton variant="tertiary" onClick={() => onAct("monitor")}>
            Keep monitoring
          </ActionButton>
          <ActionButton variant="tertiary" onClick={() => onAct("context")}>
            Add context
          </ActionButton>
        </div>
      </Card>
      <Disclose label="Show the full signal history behind this recommendation">
        <ul className="space-y-1.5">
          {SIGNALS.map((s) => (
            <li key={s.label} className="text-[12.5px] text-muted-foreground">
              {s.label}: <span className="text-foreground">{s.value}</span> — {s.note}
            </li>
          ))}
        </ul>
      </Disclose>
    </div>
  );
}

/* ─────────────── Moment 4: coordination ─────────────── */

function CoordinateCanvas({ onAct }: { onAct: (a: string) => void }) {
  const [situation, setSituation] = useState(TEAM_BRIEF.situation);
  const [people, setPeople] = useState(TEAM.map((t) => t.name));
  const [sent, setSent] = useState(false);

  return (
    <div className="space-y-4">
      <CanvasHeader
        eyebrow="Your work"
        title={`Coordinate ${CUSTOMER.name} team`}
        meta="Only the people who own part of this situation"
      />
      <Card>
        <ul className="space-y-2">
          {TEAM.map((p) => {
            const on = people.includes(p.name);
            return (
              <li
                key={p.name}
                className={cn(
                  "flex flex-wrap items-center gap-3 rounded-lg border px-3.5 py-3",
                  on ? "border-border" : "border-dashed border-border opacity-60",
                )}
              >
                <LuxAvatar initials={p.initials} size={30} status={p.status} />
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium">{p.name}</p>
                  <p className="text-[11.5px] text-muted-foreground">
                    {p.role} · {p.why}
                  </p>
                </div>
                <ActionButton
                  variant="tertiary"
                  className="ml-auto"
                  onClick={() =>
                    setPeople((prev) =>
                      prev.includes(p.name)
                        ? prev.filter((n) => n !== p.name)
                        : [...prev, p.name],
                    )
                  }
                >
                  {on ? "Remove" : "Add back"}
                </ActionButton>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-otto">
          <OttoSpark size={12} /> Otto drafted this brief — edit it before it goes out
        </p>
        <textarea
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          rows={3}
          aria-label="Situation summary"
          className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-[13.5px] leading-relaxed outline-none focus:border-otto/50"
        />
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Proposed talking points
        </p>
        <ul className="mt-2 space-y-1.5">
          {TEAM_BRIEF.talkingPoints.map((t) => (
            <li key={t} className="flex gap-2.5 text-[13px] leading-snug">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-agent" />
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <p className="text-[12.5px] text-muted-foreground">
            Recommended owner: <span className="text-foreground">{TEAM_BRIEF.owner}</span>
          </p>
          <p className="text-[12.5px] text-muted-foreground">
            Next step: <span className="text-foreground">{TEAM_BRIEF.next}</span>
          </p>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <ActionButton
            variant="primary"
            done={sent}
            doneLabel={`Brief sent to ${people.length}`}
            onClick={() => {
              setSent(true);
              onAct("sent");
            }}
          >
            Send team brief
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => onAct("draft-qir")}>
            Draft QIR narrative
          </ActionButton>
          <ActionButton variant="tertiary" onClick={() => onAct("reassign")}>
            Reassign owner
          </ActionButton>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────── Moment 5: review & approve artifact ─────────────── */

function ReviewCanvas({ onAct }: { onAct: (a: string) => void }) {
  const [sections, setSections] = useState(ARTIFACT.sections.map((s) => s.body));
  const [approved, setApproved] = useState<number[]>([]);

  return (
    <div className="space-y-4">
      <CanvasHeader
        eyebrow="Editable artifact"
        title={ARTIFACT.title}
        meta="Otto drafted the lower-judgment work. You own the language."
        actions={<Chip tone="ai">Draft · not shared</Chip>}
      />
      {ARTIFACT.sections.map((s, i) => (
        <Card key={s.heading}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[14px] font-semibold">{s.heading}</p>
            <ActionButton
              variant="secondary"
              done={approved.includes(i)}
              doneLabel="Approved"
              onClick={() => setApproved((p) => [...p, i])}
            >
              Approve section
            </ActionButton>
          </div>
          <textarea
            value={sections[i]}
            onChange={(e) =>
              setSections((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
            }
            rows={3}
            aria-label={s.heading}
            className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-[13.5px] leading-relaxed outline-none focus:border-otto/50"
          />
          <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <OttoSpark size={11} /> {s.source}
          </p>
        </Card>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <ActionButton variant="primary" onClick={() => onAct("publish")}>
          Update customer thread
        </ActionButton>
        <ActionButton variant="ai" onClick={() => onAct("rewrite")}>
          Ask Otto to tighten the narrative
        </ActionButton>
      </div>
    </div>
  );
}

/* ─────────────── Moment 6: customer thread ─────────────── */

function ThreadCanvas({ onAct }: { onAct: (a: string) => void }) {
  return (
    <div className="space-y-4">
      <CanvasHeader
        eyebrow="One continuous thread"
        title={`${CUSTOMER.name} · ${CUSTOMER.quarter}`}
        meta="Decisions, artifacts and monitoring all attached to the same customer goal"
      />
      <GoalStrip />
      <Card>
        <ol className="space-y-0">
          {THREAD.map((t, i) => (
            <li key={i} className="flex gap-3 border-border pb-4 last:pb-0">
              <span className="flex flex-col items-center">
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    t.kind === "ai" ? "bg-otto" : "bg-human",
                  )}
                />
                {i < THREAD.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
              </span>
              <div className="min-w-0 pb-1">
                <p className="text-[13.5px] leading-snug">{t.what}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {t.who} · {t.when}
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <ActionButton variant="primary" onClick={() => onAct("success-plan")}>
            Update success plan
          </ActionButton>
          <ActionButton variant="secondary" onClick={() => onAct("restart")}>
            Back to my morning
          </ActionButton>
        </div>
      </Card>
    </div>
  );
}

/* ─────────────── Canvas switch ─────────────── */

export function AdaptiveCanvas({
  moment,
  showSupport,
  onAct,
}: {
  moment: AdaptiveMomentId;
  showSupport: boolean;
  onAct: (action: string) => void;
}) {
  return (
    <div key={moment} className="soft-in mx-auto w-full max-w-[62rem]">
      {moment === "signal" && <SignalCanvas onAct={onAct} />}
      {moment === "evidence" && <EvidenceCanvas onAct={onAct} showSupport={showSupport} />}
      {moment === "decision" && <DecisionCanvas onAct={onAct} />}
      {moment === "coordinate" && <CoordinateCanvas onAct={onAct} />}
      {moment === "review" && <ReviewCanvas onAct={onAct} />}
      {moment === "thread" && <ThreadCanvas onAct={onAct} />}
    </div>
  );
}
