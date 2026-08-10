import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowUp, ChevronRight } from "lucide-react";
import {
  CLOSING_MESSAGE,
  HUMAN_CONTROL_STATES,
  MODES_X_AWARENESS,
  MODE_BEHAVIOUR,
  MODE_CONTEXT_LINE,
  MODE_DEMO_CLOSE,
  MODE_DEMO_SEQUENCE,
  MODE_FALLBACK_ANSWER,
  MODE_SCRIPTS,
  OPERATING_MODEL_FULL,
  SAME_INTELLIGENCE,
  SITUATIONAL_MODE,
  WORK_MODES,
  type ModeId,
  type ModeScript,
} from "@/lib/mode-data";
import { OttoMark } from "./primitives";
import { Disclosure, SectionTitle, StatusPill, Surface } from "./shell";
import { ActionButton } from "./drawer";

export function scriptFor(path: string, momentId: number): ModeScript | undefined {
  return MODE_SCRIPTS[`${path}-${momentId}`];
}

/* ─────────────── Compact work-mode control (presentation) ─────────────── */

export function WorkModeControl({
  mode,
  onChange,
  disabled,
}: {
  mode: ModeId;
  onChange: (m: ModeId) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center rounded-lg border border-border p-0.5">
      <span className="px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        Work mode
      </span>
      {WORK_MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onChange(m.id)}
          disabled={disabled}
          title={m.blurb}
          className={cn(
            "rounded-md px-2.5 py-1 text-[12px] transition-colors disabled:opacity-40",
            mode === m.id
              ? "bg-secondary font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────────── Shared generated-view surface ─────────────── */

function GeneratedView({ script }: { script: ModeScript }) {
  const [acted, setActed] = useState<string | null>(null);
  const g = script.generated;
  return (
    <div className="soft-in rounded-2xl border border-otto/25 bg-otto-soft/40 p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[15px] font-semibold tracking-tight">{g.title}</p>
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-otto">
          Assembled around your question
        </span>
      </div>
      <p className="mt-1 text-[12px] text-muted-foreground">{g.note}</p>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        {g.metrics.map((m) => (
          <div key={m.label}>
            <p className="text-[1.35rem] font-semibold leading-none tracking-tight">{m.value}</p>
            <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground">{m.label}</p>
          </div>
        ))}
      </div>

      <p className="mt-5 border-t border-otto/20 pt-4 text-[14px] leading-relaxed">
        {g.connection}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {g.actions.map((a, i) => (
          <ActionButton
            key={a}
            variant={i === 0 ? "solid" : "quiet"}
            onClick={() => setActed(a)}
          >
            {a}
          </ActionButton>
        ))}
        {acted && (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-human">
            {acted} · awaiting your confirmation
          </span>
        )}
      </div>
      <p className="mt-4 text-[12px] text-muted-foreground">
        Human control stays constant: {HUMAN_CONTROL_STATES.join(" · ")}.
      </p>
    </div>
  );
}

/* ─────────────── Mode 1 · Conversational workspace ─────────────── */

export function ConversationalWorkspace({
  script,
  contextLine,
  momentLabel,
  role,
}: {
  script: ModeScript;
  contextLine: string;
  momentLabel: string;
  role: string;
}) {
  const [value, setValue] = useState("");
  const [turns, setTurns] = useState<{ q: string; a: string[]; generated: boolean }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (q: string) => {
    const question = q.trim();
    if (!question) return;
    const primary = question.toLowerCase() === script.ask.toLowerCase() || turns.length === 0;
    setTurns((t) => [
      ...t,
      {
        q: question,
        a: primary ? script.answer : MODE_FALLBACK_ANSWER,
        generated: true,
      },
    ]);
    setValue("");
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-6">
      <header className="rise">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone="positive">Conversational mode</StatusPill>
          <span className="text-[12px] text-muted-foreground">
            {momentLabel} · {contextLine} · viewing as {role}
          </span>
        </div>
        <h1 className="mt-4 text-[1.75rem] font-semibold leading-tight tracking-tight md:text-[2.1rem]">
          Good morning, {role === "TSM" ? "Maya" : "Alex"}.
        </h1>
        <p className="mt-1.5 text-[15px] text-muted-foreground">
          What do you want to accomplish?
        </p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-5 shadow-calm focus-within:border-otto/50"
      >
        <span className="text-otto">
          <OttoMark size={20} />
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask Otto anything, or describe what you want to get done…"
          aria-label="Ask Otto"
          className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Send to Otto"
          disabled={!value.trim()}
          className="rounded-full bg-primary p-2 text-primary-foreground disabled:opacity-35"
        >
          <ArrowUp className="size-4" aria-hidden="true" />
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {script.prompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => submit(p)}
            className="rounded-full border border-border px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            {p}
          </button>
        ))}
      </div>

      {turns.length === 0 && (
        <Surface>
          <SectionTitle meta="Continuous">Otto already has your context</SectionTitle>
          <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
            {contextLine}. You do not need to restate the account, the quarter or the workflow — the
            environment carries it between modes.
          </p>
        </Surface>
      )}

      {turns.map((t, i) => (
        <div key={`${t.q}-${i}`} className="soft-in space-y-4">
          <div className="flex justify-end">
            <p className="max-w-xl rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-[14px] text-primary-foreground">
              {t.q}
            </p>
          </div>
          <div className="flex gap-4">
            <span className="mt-1 shrink-0 text-otto">
              <OttoMark size={18} />
            </span>
            <div className="min-w-0 flex-1 space-y-4">
              {t.a.map((line) => (
                <p key={line} className="text-[15px] leading-relaxed">
                  {line}
                </p>
              ))}
              {t.generated && <GeneratedView script={script} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────── Mode 3 · Hybrid strip above the structured view ─────────────── */

export function HybridStrip({
  script,
  contextLine,
}: {
  script: ModeScript;
  contextLine: string;
}) {
  const [value, setValue] = useState("");
  const [asked, setAsked] = useState<string | null>(null);

  const submit = (q: string) => {
    if (!q.trim()) return;
    setAsked(q.trim());
    setValue("");
  };

  const answer =
    asked && asked.toLowerCase() === script.ask.toLowerCase()
      ? script.answer
      : asked
        ? script.answer
        : [];

  return (
    <Surface className="border-otto/25" padded={false}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-5 pt-5">
        <StatusPill tone="positive">Hybrid mode</StatusPill>
        <span className="text-[12px] text-muted-foreground">{contextLine}</span>
      </div>

      <div className="px-5 pb-5 pt-4">
        <div className="flex gap-4">
          <span className="mt-0.5 shrink-0 text-otto">
            <OttoMark size={18} />
          </span>
          <div className="min-w-0 space-y-1.5">
            {script.hybrid.map((l) => (
              <p key={l} className="text-[14px] leading-relaxed">
                {l}
              </p>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
          className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 focus-within:border-otto/50"
        >
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask about this…"
            aria-label="Ask Otto about this view"
            className="min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            aria-label="Ask Otto"
            disabled={!value.trim()}
            className="rounded-full bg-primary p-1.5 text-primary-foreground disabled:opacity-35"
          >
            <ArrowUp className="size-3.5" aria-hidden="true" />
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {[script.ask, ...script.prompts.slice(0, 3)].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => submit(p)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[12px] transition-colors",
                asked === p
                  ? "border-otto/40 bg-otto-soft text-otto"
                  : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {p}
            </button>
          ))}
        </div>

        {asked && (
          <div className="soft-in mt-5 space-y-4">
            <div className="flex justify-end">
              <p className="max-w-xl rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-[13px] text-primary-foreground">
                {asked}
              </p>
            </div>
            <div className="flex gap-4">
              <span className="mt-0.5 shrink-0 text-otto">
                <OttoMark size={16} />
              </span>
              <div className="min-w-0 flex-1 space-y-4">
                {answer.map((line) => (
                  <p key={line} className="text-[14px] leading-relaxed">
                    {line}
                  </p>
                ))}
                <GeneratedView script={script} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Surface>
  );
}

/* ─────────────── UI-driven quiet AI note ─────────────── */

export function UiDrivenNote({ script, contextLine }: { script: ModeScript; contextLine: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-background px-4 py-3">
      <StatusPill>UI-Driven mode</StatusPill>
      <span className="text-[12px] text-muted-foreground">{contextLine}</span>
      <span className="hidden text-[12px] text-muted-foreground md:inline">·</span>
      <span className="text-[12px] text-muted-foreground">{script.uiHint}</span>
      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-otto">
        Agents still monitoring
      </span>
    </div>
  );
}

/* ═════════ Leadership path: Three Ways to Work ═════════ */

export function ModesOverview() {
  return (
    <div className="space-y-6">
      <header className="rise">
        <span className="eyebrow">01 · Three Ways to Work</span>
        <h1 className="mt-3 max-w-3xl text-balance text-[1.9rem] font-semibold leading-tight tracking-tight md:text-[2.5rem]">
          One environment. Three ways to work.
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          The future customer success experience should not force everyone into a single interaction
          model. Different people — and different moments — require different ways of working.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {WORK_MODES.map((m) => (
          <Surface key={m.id}>
            <span className="eyebrow">{m.id === "hybrid" ? "Default" : "Mode"}</span>
            <p className="mt-2 text-[1.15rem] font-semibold tracking-tight">{m.label}</p>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">{m.blurb}</p>
            <p className="mt-4 border-t border-border pt-4 text-[13px] leading-relaxed">
              {MODE_BEHAVIOUR[m.id]}
            </p>
          </Surface>
        ))}
      </div>

      <Surface>
        <SectionTitle meta="Presentation view">Three Modes × Three Awarenesses</SectionTitle>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-[14rem] border-b border-border pb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  What the environment understands
                </th>
                {MODES_X_AWARENESS.modes.map((m) => (
                  <th
                    key={m.label}
                    className="border-b border-border pb-3 text-[13px] font-semibold"
                  >
                    {m.label}
                    <span className="mt-1 block text-[11px] font-normal text-muted-foreground">
                      {m.note}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODES_X_AWARENESS.awarenesses.map((a) => (
                <tr key={a.label}>
                  <th className="border-b border-border py-4 pr-4 text-[13px] font-semibold">
                    {a.label}
                    <span className="mt-1 block text-[11px] font-normal text-muted-foreground">
                      {a.question}
                    </span>
                  </th>
                  {MODES_X_AWARENESS.modes.map((m) => (
                    <td
                      key={m.label}
                      className="border-b border-border py-4 pr-4 text-[13px] text-muted-foreground"
                    >
                      Same understanding, surfaced through {m.label.toLowerCase()} interaction.
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-[13px] leading-relaxed text-muted-foreground">
          {MODES_X_AWARENESS.note}
        </p>
      </Surface>

      <Surface>
        <SectionTitle meta="Situational, not a user profile">Mode choice follows the moment</SectionTitle>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {SITUATIONAL_MODE.map((s) => (
            <div key={s.when} className="rounded-xl border border-border bg-background p-4">
              <span className="eyebrow">{s.when}</span>
              <p className="mt-2 text-[14px] font-medium">{s.mode}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-muted-foreground">{s.what}</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-[13px] text-muted-foreground">
          Nobody is a “conversational user” or a “UI user”. A person moves between modes as the work
          changes.
        </p>
      </Surface>
    </div>
  );
}

export function ModeSequenceDemo({ onSetMode }: { onSetMode?: (m: ModeId) => void }) {
  const [step, setStep] = useState(0);
  return (
    <div className="space-y-6">
      <header className="rise">
        <span className="eyebrow">02 · Live Mode Sequence</span>
        <h1 className="mt-3 max-w-3xl text-balance text-[1.9rem] font-semibold leading-tight tracking-tight md:text-[2.4rem]">
          The same account, three ways of working — in under two minutes.
        </h1>
      </header>

      <Surface>
        <SectionTitle meta="Context is never reset">Presenter sequence</SectionTitle>
        <ol className="mt-6 space-y-4">
          {MODE_DEMO_SEQUENCE.map((s, i) => {
            const on = i <= step;
            return (
              <li
                key={s.label}
                className={cn(
                  "rounded-xl border p-5 transition-colors",
                  on ? "border-otto/30 bg-otto-soft/30" : "border-border bg-background",
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[14px] font-semibold">{s.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(i);
                      onSetMode?.(s.mode);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                  >
                    Switch to {s.label}
                    <ChevronRight className="size-3.5" aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed">{s.line}</p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {s.detail}
                </p>
              </li>
            );
          })}
        </ol>
        <p className="mt-6 border-t border-border pt-5 text-[15px] font-semibold">
          {MODE_DEMO_CLOSE}
        </p>
      </Surface>

      <Surface>
        <SectionTitle>Nothing is restated when the mode changes</SectionTitle>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            "Alex is the CSM",
            "Acme is the active account",
            "Q3, week 6",
            "Strategic adoption decline",
            "Coordination workflow in progress",
            "Previous actions and approvals",
          ].map((c) => (
            <p key={c} className="flex items-baseline gap-3 text-[14px]">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-otto" />
              {c}
            </p>
          ))}
        </div>
      </Surface>
    </div>
  );
}

export function SameIntelligenceView() {
  return (
    <div className="space-y-6">
      <header className="rise">
        <span className="eyebrow">03 · Same Intelligence</span>
        <h1 className="mt-3 max-w-3xl text-balance text-[1.9rem] font-semibold leading-tight tracking-tight md:text-[2.4rem]">
          “{SAME_INTELLIGENCE.question}”
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Three different interactions. One underlying understanding of the customer.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        {SAME_INTELLIGENCE.paths.map((p) => (
          <Surface key={p.mode}>
            <span className="eyebrow">{p.mode}</span>
            <p className="mt-3 text-[15px] leading-relaxed">{p.action}</p>
          </Surface>
        ))}
      </div>

      <Surface>
        <SectionTitle meta="Shared by all three">Same underlying intelligence</SectionTitle>
        <div className="mt-5 flex flex-wrap gap-2">
          {SAME_INTELLIGENCE.shared.map((s) => (
            <span
              key={s}
              className="rounded-full border border-agent/25 bg-agent-soft px-3 py-1.5 text-[12px] text-foreground"
            >
              {s}
            </span>
          ))}
        </div>
        <p className="mt-6 border-t border-border pt-5 text-[1.15rem] font-semibold tracking-tight">
          {SAME_INTELLIGENCE.takeaway}
        </p>
      </Surface>

      <Disclosure label="Human control is identical in every mode" tone="agent">
        <p className="text-[14px] leading-relaxed">
          AI detects, analyses, recommends, prepares and coordinates. Consequential customer
          decisions still surface as {HUMAN_CONTROL_STATES.join(" · ")} — changing mode never changes
          the user's authority.
        </p>
      </Disclosure>
    </div>
  );
}

export function OperatingModelClosing() {
  return (
    <div className="space-y-6">
      <header className="rise">
        <span className="eyebrow">04 · Operating Model</span>
        <h1 className="mt-3 max-w-3xl text-balance text-[1.9rem] font-semibold leading-tight tracking-tight md:text-[2.4rem]">
          Flexible interaction on top. Continuous intelligence underneath.
        </h1>
      </header>

      <Surface>
        <div className="rounded-2xl border border-otto/25 bg-otto-soft/25 p-5 md:p-7">
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-otto">
            CSP on AINPX
          </p>
          <div className="mt-6 space-y-3">
            {OPERATING_MODEL_FULL.map((layer, i) => (
              <div key={layer.layer}>
                <div className="rounded-xl border border-border bg-surface p-4 text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {layer.layer}
                  </p>
                  <div className="mt-2.5 flex flex-wrap justify-center gap-2">
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border px-3 py-1 text-[12px]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                {i < OPERATING_MODEL_FULL.length - 1 && (
                  <p aria-hidden="true" className="py-1 text-center text-[12px] text-muted-foreground">
                    ↓
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Surface>

      <Surface>
        <h2 className="text-balance text-[1.4rem] font-semibold leading-snug tracking-tight md:text-[1.7rem]">
          {CLOSING_MESSAGE.headline}
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {CLOSING_MESSAGE.support}
        </p>
        <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
          {CLOSING_MESSAGE.lines.map((l) => (
            <li key={l} className="flex items-baseline gap-3 text-[15px]">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-otto" />
              {l}
            </li>
          ))}
        </ul>
        <p className="mt-7 text-[1.25rem] font-semibold tracking-tight">{CLOSING_MESSAGE.close}</p>
      </Surface>
    </div>
  );
}

export { MODE_CONTEXT_LINE };
