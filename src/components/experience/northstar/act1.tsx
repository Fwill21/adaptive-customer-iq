/**
 * Act 1 — Today. Three compressed scenes that show (not tell) Maya acting as
 * the integration layer. No Less/More/Human-judgment ledger here by design.
 */

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  TODAY_DECK_ITEMS,
  TODAY_FOLLOWUP,
  TODAY_MAYA_STRATEGY,
  TODAY_SCATTER,
  TODAY_SCENE2_SOURCES,
  TODAY_SOURCES,
  TODAY_SPECIALISTS,
  NORTHSTAR,
} from "@/lib/northstar-data";
import { ActionButton } from "../drawer";
import { CanvasHeader, Chip } from "../lux";
import { Surface } from "../shell";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  FileText,
  Flag,
  LayoutList,
  MessageSquare,
  Search,
  StickyNote,
} from "lucide-react";

const ICONS = {
  portfolio: LayoutList,
  chart: BarChart3,
  calendar: CalendarDays,
  notes: StickyNote,
  message: MessageSquare,
  risk: Flag,
  commitment: CheckCircle2,
} as const;

function MayaSays({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-human/30 bg-transparent p-4">
      <span className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-human">
        Maya
      </span>
      <p className="text-[14.5px] leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

/* ───────────────── Scene 1 ───────────────── */

export function TodayNotice({ onNext }: { onNext: () => void }) {
  const [opened, setOpened] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [compared, setCompared] = useState(false);
  const source = TODAY_SOURCES.find((s) => s.id === active) ?? null;
  const enough = opened.length >= 3;

  const open = (id: string) => {
    setActive(id);
    setOpened((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <div className="space-y-6">
      <CanvasHeader
        eyebrow="Today · Scene 01"
        title="Notice, connect & investigate"
        meta={`Beginning of the quarter · ${NORTHSTAR.name} QBR in 4 weeks · nothing is marked urgent`}
        actions={<Chip>{opened.length} of {TODAY_SOURCES.length} sources opened</Chip>}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-3">
          {TODAY_SOURCES.map((s) => {
            const Icon = ICONS[s.kind];
            const isOpen = opened.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => open(s.id)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                  active === s.id
                    ? "border-border-strong bg-surface shadow-calm"
                    : "border-border bg-surface hover:border-border-strong",
                )}
              >
                <span className="mt-0.5 text-muted-foreground">
                  <Icon className="size-4" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {s.where}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{s.stamp}</span>
                    {isOpen && <Chip tone="quiet">Opened</Chip>}
                  </span>
                  <span className="mt-1 block text-[14.5px] font-medium">{s.title}</span>
                </span>
              </button>
            );
          })}
        </div>

        <aside className="space-y-4">
          <Surface className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              {source ? source.where : "Open a source"}
            </p>
            {source ? (
              <>
                <p className="text-[14px] font-medium">{source.title}</p>
                <ul className="space-y-2 text-[13px] leading-relaxed text-muted-foreground">
                  {source.detail.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <p className="border-t border-border pt-3 text-[13px] text-foreground">
                  {source.takeaway}
                </p>
              </>
            ) : (
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                Six places hold part of the picture. None of them says Northstar is at risk.
              </p>
            )}
          </Surface>

          {enough && (
            <Surface className="soft-in space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Maya compares
              </p>
              {compared ? (
                <ul className="space-y-2 text-[13px] leading-relaxed">
                  <li>Week 5 — Wave 2 slips (note)</li>
                  <li>Week 5 — sponsor stops attending (calendar)</li>
                  <li>Weeks 6–9 — usage falls 68% → 49% (report)</li>
                  <li>Q2 — commitment still open (success plan)</li>
                </ul>
              ) : (
                <ActionButton variant="secondary" onClick={() => setCompared(true)}>
                  Compare dates & evidence
                </ActionButton>
              )}
            </Surface>
          )}
        </aside>
      </div>

      <MayaSays>
        “The QBR is coming, but I need to know whether this is normal noise or whether something
        actually changed.”
      </MayaSays>

      <div className="flex flex-wrap items-center gap-3">
        <ActionButton variant="primary" onClick={onNext}>
          <Search className="size-3.5" aria-hidden="true" /> Investigate Northstar
        </ActionButton>
        <p className="text-[12.5px] text-muted-foreground">
          Useful information exists. Maya determines what deserves attention.
        </p>
      </div>
    </div>
  );
}

/* ───────────────── Scene 2 ───────────────── */

export function TodayBuildStory({ onNext }: { onNext: () => void }) {
  const [visited, setVisited] = useState<string[]>([]);
  const [found, setFound] = useState(false);
  const [stage, setStage] = useState(0); // 0 none, 1 searched, 2 opened, 3 context sent, 4 reviewed
  const [strategy, setStrategy] = useState<string[]>([]);

  const steps = [
    "Search for the right specialist",
    "Open internal collaboration",
    "Transfer Northstar context",
    "Review their recommendations",
  ];

  return (
    <div className="space-y-6">
      <CanvasHeader
        eyebrow="Today · Scene 02"
        title="Build the customer story & align the team"
        meta="Seven places, three colleagues, one story Maya has to assemble herself"
      />

      <div className="grid gap-3 md:grid-cols-2">
        {TODAY_SCENE2_SOURCES.map((s) => {
          const on = visited.includes(s.where);
          return (
            <button
              key={s.where}
              type="button"
              onClick={() => setVisited((p) => (p.includes(s.where) ? p : [...p, s.where]))}
              className={cn(
                "rounded-xl border p-3 text-left transition-colors",
                on ? "border-border-strong bg-secondary/60" : "border-border bg-surface hover:border-border-strong",
              )}
            >
              <p className="flex items-center gap-2 text-[13.5px] font-medium">
                <FileText className="size-3.5 text-muted-foreground" aria-hidden="true" />
                {s.where}
              </p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">{s.note}</p>
            </button>
          );
        })}
      </div>

      {visited.length >= 3 &&
        (found ? (
          <Surface className="soft-in border-signal/30 bg-signal-soft">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">
              Maya works it out
            </p>
            <p className="mt-2 text-[15px] font-medium">
              The adoption slowdown began after the migration dependency moved off schedule.
            </p>
          </Surface>
        ) : (
          <ActionButton variant="secondary" onClick={() => setFound(true)}>
            Line up the timeline across sources
          </ActionButton>
        ))}

      <Surface className="space-y-4">
        <p className="text-[15px] font-semibold">Maya starts the cross-functional work herself</p>
        <ol className="grid gap-2 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                disabled={i > stage}
                onClick={() => setStage(i + 1)}
                className={cn(
                  "h-full w-full rounded-xl border p-3 text-left text-[13px] transition-colors",
                  i < stage
                    ? "border-otto/30 bg-otto-soft text-otto"
                    : i === stage
                      ? "border-border-strong bg-surface hover:border-otto/50"
                      : "border-border/60 text-muted-foreground/60",
                )}
              >
                <span className="font-mono text-[10px] tracking-[0.12em]">0{i + 1}</span>
                <span className="mt-1 block font-medium">{s}</span>
              </button>
            </li>
          ))}
        </ol>

        {stage >= 4 && (
          <div className="soft-in grid gap-3 md:grid-cols-3">
            {TODAY_SPECIALISTS.map((p) => (
              <div key={p.name} className="rounded-xl border border-border p-4">
                <p className="text-[13.5px] font-semibold">{p.name}</p>
                <p className="text-[12px] text-muted-foreground">{p.role}</p>
                <p className="mt-2"><Chip>{p.lens}</Chip></p>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {p.recommendation}
                </p>
              </div>
            ))}
          </div>
        )}
      </Surface>

      {stage >= 4 && (
        <Surface className="soft-in space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px] font-semibold">Maya's working strategy document</p>
            <ActionButton
              variant="secondary"
              done={strategy.length === TODAY_MAYA_STRATEGY.length}
              doneLabel="Synthesized"
              onClick={() => setStrategy(TODAY_MAYA_STRATEGY.slice(0, strategy.length + 1))}
            >
              Add the next line herself
            </ActionButton>
          </div>
          <ul className="space-y-2">
            {TODAY_MAYA_STRATEGY.map((line) => {
              const on = strategy.includes(line);
              return (
                <li
                  key={line}
                  className={cn(
                    "flex gap-2 text-[13.5px] leading-relaxed",
                    on ? "text-foreground" : "text-muted-foreground/45",
                  )}
                >
                  {on ? (
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-otto" aria-hidden="true" />
                  ) : (
                    <CircleDashed className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  )}
                  {line}
                </li>
              );
            })}
          </ul>
        </Surface>
      )}

      <MayaSays>
        “I don't think the story is simply that adoption is down. Their outcome still matters. We
        need to show what changed, what is blocking progress, and what we recommend next.”
      </MayaSays>

      <ActionButton variant="primary" onClick={onNext}>
        Prepare for the QBR
      </ActionButton>
    </div>
  );
}

/* ───────────────── Scene 3 ───────────────── */

export function TodayPrepareLead({ onNext }: { onNext: () => void }) {
  const [fixed, setFixed] = useState<string[]>([]);
  const [late, setLate] = useState(false);
  const [reworked, setReworked] = useState(false);
  const [inMeeting, setInMeeting] = useState(false);
  const [adapted, setAdapted] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const allFixed = fixed.length === TODAY_DECK_ITEMS.length;

  return (
    <div className="space-y-6">
      <CanvasHeader
        eyebrow="Today · Scene 03"
        title="Prepare, lead & follow through"
        meta="Last quarter's deck, opened and rebuilt by hand"
      />

      <Surface className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[15px] font-semibold">Previous QBR deck</p>
          <Chip tone={allFixed ? "positive" : "attention"}>
            {fixed.length}/{TODAY_DECK_ITEMS.length} slides updated manually
          </Chip>
        </div>
        <ul className="divide-y divide-border">
          {TODAY_DECK_ITEMS.map((d) => {
            const on = fixed.includes(d.slide);
            return (
              <li key={d.slide} className="flex flex-wrap items-center gap-3 py-3">
                <span className="w-44 text-[13.5px] font-medium">{d.slide}</span>
                <span className={cn("flex-1 text-[12.5px]", on ? "text-muted-foreground line-through" : "text-destructive")}>
                  {d.issue}
                </span>
                <ActionButton
                  variant={on ? "tertiary" : "secondary"}
                  done={on}
                  doneLabel="Updated"
                  onClick={() => setFixed((p) => [...p, d.slide])}
                >
                  {d.fix}
                </ActionButton>
              </li>
            );
          })}
        </ul>
      </Surface>

      {allFixed && !late && (
        <ActionButton variant="secondary" onClick={() => setLate(true)}>
          A late stakeholder update arrives
        </ActionButton>
      )}

      {late && (
        <Surface className="soft-in space-y-3 border-signal/30 bg-signal-soft">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-signal">
            Two days before the QBR
          </p>
          <p className="text-[14.5px]">
            Northstar adds a new attendee from IT and asks that Wave 2 sequencing be on the agenda.
          </p>
          {reworked ? (
            <Chip tone="positive">Maya rewrote the story again</Chip>
          ) : (
            <ActionButton variant="primary" onClick={() => setReworked(true)}>
              Update the story again
            </ActionButton>
          )}
        </Surface>
      )}

      {reworked && !inMeeting && (
        <ActionButton variant="primary" onClick={() => setInMeeting(true)}>
          Start the QBR
        </ActionButton>
      )}

      {inMeeting && (
        <Surface className="soft-in space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            During the QBR
          </p>
          <p className="rounded-xl border border-border bg-secondary/50 p-4 text-[14.5px] leading-relaxed">
            <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Northstar
            </span>
            “We're not sure adoption is the real issue. The migration dependency has been the bigger
            constraint.”
          </p>
          {adapted ? (
            <MayaSays>
              “Then let's spend the time on sequencing. I'll walk through the dependency and what we
              recommend, and we can come back to the adoption milestone.”
            </MayaSays>
          ) : (
            <ActionButton variant="primary" onClick={() => setAdapted(true)}>
              Adapt the conversation live
            </ActionButton>
          )}
        </Surface>
      )}

      {adapted && (
        <Surface className="soft-in space-y-4">
          <p className="text-[15px] font-semibold">After the meeting — all of it by hand</p>
          <div className="flex flex-wrap gap-2">
            {TODAY_FOLLOWUP.map((f) => (
              <ActionButton
                key={f}
                variant="secondary"
                done={done.includes(f)}
                doneLabel={f}
                onClick={() => setDone((p) => [...p, f])}
              >
                {f}
              </ActionButton>
            ))}
          </div>
          {done.length === TODAY_FOLLOWUP.length && (
            <div className="soft-in space-y-3 border-t border-border pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Where Northstar context now lives
              </p>
              <div className="flex flex-wrap gap-2">
                {TODAY_SCATTER.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
              <p className="text-[15px] font-medium">
                The work succeeds — but Maya is the connective tissue keeping everything coherent.
              </p>
              <ActionButton variant="primary" onClick={onNext}>
                Continue
              </ActionButton>
            </div>
          )}
        </Surface>
      )}
    </div>
  );
}
