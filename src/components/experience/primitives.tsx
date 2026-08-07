import { cn } from "@/lib/utils";
import { AGENTS, type AgentKey } from "@/lib/story-data";
import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

/** Otto identity mark — a quiet orchestration glyph, not an AI orb. */
export function OttoMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10.25" fill="none" stroke="currentColor" strokeOpacity="0.28" />
      <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeOpacity="0.55" />
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
    </svg>
  );
}

export function OttoVoice({
  children,
  className,
  label = "Otto",
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("flex gap-4", className)}>
      <span className="mt-1 shrink-0 text-otto">
        <OttoMark />
      </span>
      <div className="min-w-0">
        <span className="eyebrow block text-otto/80">{label}</span>
        <div className="mt-2 text-balance text-lg leading-relaxed text-foreground md:text-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Panel({
  children,
  className,
  tone = "surface",
}: {
  children: ReactNode;
  className?: string;
  tone?: "surface" | "quiet" | "signal";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6",
        tone === "surface" && "border-border bg-surface shadow-calm",
        tone === "quiet" && "border-border/70 bg-transparent",
        tone === "signal" && "border-signal/30 bg-signal-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function LayerTag({
  kind,
  children,
}: {
  kind: "detects" | "recommends" | "human" | "coordinates" | "aware";
  children?: ReactNode;
}) {
  const map = {
    detects: { text: "AI detected", cls: "text-signal border-signal/35 bg-signal-soft" },
    aware: { text: "Continuously aware", cls: "text-agent border-agent/30 bg-agent-soft" },
    recommends: { text: "AI recommends", cls: "text-otto border-otto/30 bg-otto-soft" },
    coordinates: { text: "AI coordinates", cls: "text-otto border-otto/30 bg-otto-soft" },
    human: { text: "Your decision", cls: "text-human border-human/30 bg-transparent" },
  }[kind];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em]",
        map.cls,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children ?? map.text}
    </span>
  );
}

export function ProgressiveLayer({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1 border-l border-border pl-5 md:grid-cols-[13rem_1fr] md:gap-6 md:border-l-0 md:pl-0">
      <div>
        <span className="eyebrow">{step}</span>
        <p className="mt-1 text-sm font-semibold text-foreground">{title}</p>
      </div>
      <div className="text-[15px] leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

export function AgentContribution({
  agents,
  summary,
}: {
  agents: AgentKey[];
  summary?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-agent/25 bg-agent-soft/60">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="flex items-center gap-3">
          <AgentDots count={agents.length} />
          <span className="text-sm font-medium text-foreground">
            {agents.length} agents contributed to this recommendation
          </span>
        </span>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-agent">
          How did Otto determine this?
          <ChevronDown
            className={cn("size-4 transition-transform", open && "rotate-180")}
            aria-hidden="true"
          />
        </span>
      </button>
      {open && (
        <div className="soft-in border-t border-agent/20 px-5 py-4">
          <ul className="grid gap-2 md:grid-cols-2">
            {agents.map((key) => {
              const agent = AGENTS.find((a) => a.key === key)!;
              return (
                <li key={key} className="flex items-baseline gap-3 text-sm">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-agent" />
                  <span className="text-foreground">{agent.name}</span>
                  <span className="text-xs text-muted-foreground">{agent.domain}</span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-otto">
              <OttoMark size={14} />
            </span>
            Otto synthesised these signals into one recommendation.
            {summary ? ` ${summary}` : ""}
          </p>
        </div>
      )}
    </div>
  );
}

export function AgentDots({ count }: { count: number }) {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-agent"
          style={{ animation: `breathe 3.2s ${i * 0.35}s ease-in-out infinite` }}
        />
      ))}
    </span>
  );
}

export function ConversationPrompt({
  text,
  onSelect,
  asked,
}: {
  text: string;
  onSelect: () => void;
  asked?: boolean;
}) {
  if (asked) {
    return (
      <div className="flex justify-end">
        <p className="rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {text}
        </p>
      </div>
    );
  }
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onSelect}
        className="rounded-full border border-border-strong bg-surface px-4 py-2.5 text-sm text-foreground transition-colors hover:border-otto hover:text-otto"
      >
        {text}
      </button>
    </div>
  );
}

export function PrimaryAction({
  children,
  onClick,
  done,
  doneLabel,
}: {
  children: ReactNode;
  onClick: () => void;
  done?: boolean;
  doneLabel?: string;
}) {
  if (done) {
    return (
      <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-human">
        <span className="size-1.5 rounded-full bg-human" />
        {doneLabel ?? "Confirmed"}
      </p>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-calm transition-transform hover:-translate-y-px"
    >
      {children}
    </button>
  );
}

export function MomentHeader({
  index,
  title,
  question,
}: {
  index: string;
  title: string;
  question: string;
}) {
  return (
    <header className="rise">
      <span className="eyebrow">
        {index} · {title}
      </span>
      <h1 className="mt-3 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-tight md:text-[2.6rem]">
        {question}
      </h1>
    </header>
  );
}
