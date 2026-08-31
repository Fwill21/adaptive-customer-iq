/**
 * LUX shell primitives — Horizon 2.0 structural layers.
 *
 * Layer 1  GlobalRail   narrow persistent global navigation on the far left
 * Layer 2  OttoPanel    persistent contextual Otto guidance beside the rail
 * Layer 3  the adaptive work canvas (see adaptive-canvas.tsx / existing moments)
 */

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Bell,
  CircleUser,
  FileText,
  Home,
  LayoutGrid,
  MessageSquarePlus,
  Mic,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  Users,
  ArrowUp,
  ChevronRight,
} from "lucide-react";

/* ─────────────── Otto identity ─────────────── */

/** The small green intelligence mark. Native chrome, never a mascot. */
export function OttoSpark({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <Sparkles
      className={cn("text-otto", className)}
      style={{ width: size, height: size }}
      strokeWidth={1.8}
      aria-hidden="true"
    />
  );
}

/* ─────────────── Avatars ─────────────── */

export function LuxAvatar({
  initials,
  size = 28,
  status,
}: {
  initials: string;
  size?: number;
  status?: "online" | "busy" | "away";
}) {
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className="inline-flex items-center justify-center rounded-full bg-secondary font-medium text-secondary-foreground"
        style={{ width: size, height: size, fontSize: Math.max(9, size * 0.36) }}
      >
        {initials}
      </span>
      {status && (
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-surface",
            status === "online" && "bg-otto",
            status === "busy" && "bg-signal",
            status === "away" && "bg-border-strong",
          )}
          style={{ width: size * 0.32, height: size * 0.32 }}
          aria-label={status}
        />
      )}
    </span>
  );
}

/* ─────────────── Layer 1: global navigation rail ─────────────── */

type RailItem = {
  key: string;
  label: string;
  icon: typeof Home;
  badge?: number;
};

const RAIL_TOP: RailItem[] = [
  { key: "Home", label: "Home", icon: Home },
  { key: "Otto", label: "Otto", icon: Sparkles },
  { key: "Search", label: "Search", icon: Search },
  { key: "Notifications", label: "Notifications", icon: Bell, badge: 3 },
  { key: "Workspace", label: "Workspace", icon: LayoutGrid },
  { key: "Files", label: "Files", icon: FileText },
];

const RAIL_APPS: RailItem[] = [{ key: "CSP", label: "Customer Success", icon: Users }];

export function GlobalRail({
  active = "Home",
  onSelect,
  onSearch,
  person,
}: {
  active?: string;
  onSelect?: (key: string) => void;
  onSearch?: (() => void) | undefined;
  person: { name: string; role: string };
}) {
  const initials = person.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  const Item = ({ item }: { item: RailItem }) => {
    const on = item.key === active;
    return (
      <li>
        <button
          type="button"
          title={item.label}
          aria-label={item.label}
          aria-current={on ? "page" : undefined}
          onClick={() => (item.key === "Search" ? onSearch?.() : onSelect?.(item.key))}
          className={cn(
            "relative flex size-9 items-center justify-center rounded-lg transition-colors",
            on
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
          )}
        >
          <item.icon className="size-[18px]" strokeWidth={1.7} aria-hidden="true" />
          {item.badge ? (
            <span className="absolute right-0.5 top-0.5 flex min-w-[14px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-semibold leading-[14px] text-destructive-foreground">
              {item.badge}
            </span>
          ) : null}
        </button>
      </li>
    );
  };

  return (
    <nav
      aria-label="Global navigation"
      className="sticky top-0 hidden h-screen w-14 shrink-0 flex-col items-center gap-1 border-r border-border bg-background py-3 md:flex"
    >
      {/* ServiceNow mark */}
      <button
        type="button"
        aria-label="ServiceNow home"
        onClick={() => onSelect?.("Home")}
        className="mb-1 flex size-9 items-center justify-center rounded-lg text-otto transition-colors hover:bg-secondary/70"
      >
        <svg viewBox="0 0 24 24" className="size-[19px]" aria-hidden="true">
          <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M6.6 17.4a7 7 0 1 1 10.8 0 8.6 8.6 0 0 0-10.8 0Z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      </button>
      <span className="mb-1 h-px w-7 bg-border" />

      <ul className="flex flex-col items-center gap-1">
        {RAIL_TOP.map((i) => (
          <Item key={i.key} item={i} />
        ))}
      </ul>

      <span className="my-1 h-px w-7 bg-border" />
      <ul className="flex flex-col items-center gap-1">
        {RAIL_APPS.map((i) => (
          <Item key={i.key} item={i} />
        ))}
        <li>
          <button
            type="button"
            aria-label="Add"
            title="Add"
            onClick={() => onSelect?.("Add")}
            className="flex size-9 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            <Plus className="size-[16px]" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </li>
      </ul>

      <div className="mt-auto flex flex-col items-center gap-2">
        <button
          type="button"
          aria-label="Settings"
          title="Settings"
          onClick={() => onSelect?.("Settings")}
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
        >
          <Settings className="size-[17px]" strokeWidth={1.7} aria-hidden="true" />
        </button>
        <button
          type="button"
          title={`${person.name} · ${person.role}`}
          aria-label="Account"
          onClick={() => onSelect?.("Account")}
          className="rounded-full ring-offset-2 ring-offset-background transition-shadow hover:ring-1 hover:ring-border-strong"
        >
          {initials ? (
            <LuxAvatar initials={initials} size={28} status="online" />
          ) : (
            <CircleUser className="size-6" aria-hidden="true" />
          )}
        </button>
      </div>
    </nav>
  );
}

/* ─────────────── Layer 2: Otto guidance panel ─────────────── */

export type OttoTurn =
  | { kind: "user"; text: string }
  | {
      kind: "otto";
      lines: string[];
      steps?: string[];
      sources?: string[];
      /** Inspectable reasoning trail behind this conclusion. */
      trail?: TrailId;
    };


export function OttoPanel({
  turns,
  prompts,
  contextLine,
  onAsk,
  onCompose,
  /** How much room Otto has. Content recomposes rather than shrinking. */
  variant = "standard",
  /** Inline workspace content that materializes inside the conversation. */
  inline,
  style,
  fluid = false,
}: {
  turns: OttoTurn[];
  prompts: string[];
  contextLine: string;
  onAsk: (question: string) => void;
  onCompose?: () => void;
  variant?: "wide" | "standard" | "condensed";
  inline?: React.ReactNode;
  style?: React.CSSProperties;
  fluid?: boolean;
}) {
  const [value, setValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns.length]);

  const submit = (q: string) => {
    if (!q.trim()) return;
    onAsk(q.trim());
    setValue("");
  };

  // Condensed Otto keeps only the live guidance; wide Otto keeps everything.
  const shown = variant === "condensed" ? turns.slice(-2) : turns;
  const shownPrompts = variant === "condensed" ? prompts.slice(0, 1) : prompts;
  // Reading width stays comfortable even when Otto owns the whole workspace.
  const column = variant === "wide" ? "mx-auto w-full max-w-[46rem]" : "";

  return (
    <aside
      aria-label="Otto guidance"
      style={style}
      className={cn(
        "sticky top-0 flex min-w-0 flex-col overflow-hidden border-r border-border bg-background",
        fluid ? "h-full" : "h-screen hidden w-[21rem] shrink-0 xl:flex",
      )}
    >

      {/* compact header, integrated into the chrome */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <OttoSpark size={16} />
        <span className="text-[13px] font-semibold tracking-tight">Otto</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="New conversation"
            onClick={onCompose}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <MessageSquarePlus className="size-4" strokeWidth={1.7} aria-hidden="true" />
          </button>
          <div className="relative">
            <button
              type="button"
              aria-label="More options"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <MoreHorizontal className="size-4" strokeWidth={1.7} aria-hidden="true" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-30 w-48 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lift">
                {["Show AI steps by default", "Export conversation", "Otto preferences"].map(
                  (m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full px-3 py-2 text-left text-[12px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      {m}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="border-b border-border px-4 py-2 text-[11px] text-muted-foreground">
        {contextLine}
      </p>

      {/* conversation */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className={cn("space-y-4", column)}>
          {shown.map((t, i) =>
            t.kind === "user" ? (
              <div key={i} className="flex justify-end">
                <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-[13px] leading-snug text-primary-foreground">
                  {t.text}
                </p>
              </div>
            ) : (
              <OttoMessage key={i} turn={t} wide={variant === "wide"} />
            ),
          )}
          {inline && <div className="pt-1">{inline}</div>}
        </div>
      </div>

      {/* prompts */}
      {shownPrompts.length > 0 && (
        <div className={cn("flex flex-wrap gap-1.5 px-4 pb-2", column)}>
          {shownPrompts.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => submit(p)}
              className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-otto/40 hover:text-otto"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* anchored composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className={cn(
          "m-3 mt-1 flex items-center gap-1.5 rounded-2xl border border-border bg-surface px-2 py-1.5 shadow-calm focus-within:border-otto/50",
          variant === "wide" && "mx-auto w-full max-w-[46rem]",
        )}
      >
        <button
          type="button"
          aria-label="Add context"
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Plus className="size-4" strokeWidth={1.8} aria-hidden="true" />
        </button>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask or search for anything"
          aria-label="Ask Otto"
          className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          aria-label="Voice input"
          className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Mic className="size-4" strokeWidth={1.7} aria-hidden="true" />
        </button>
        <button
          type="submit"
          aria-label="Send to Otto"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-otto text-otto-foreground transition-opacity disabled:opacity-40"
          disabled={!value.trim()}
        >
          <ArrowUp className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
        </button>
      </form>
    </aside>
  );
}

function OttoMessage({
  turn,
  wide = false,
}: {
  turn: { kind: "otto"; lines: string[]; steps?: string[]; sources?: string[] };
  wide?: boolean;
}) {
  const [stepsOpen, setStepsOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  return (
    <div className={cn("space-y-2", wide && "space-y-3")}>
      {turn.lines.map((l, i) => (
        <p
          key={i}
          className={cn("leading-relaxed text-foreground", wide ? "text-[14.5px]" : "text-[13px]")}
        >
          {l}
        </p>
      ))}

      {turn.steps && turn.steps.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setStepsOpen((v) => !v)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-otto transition-opacity hover:opacity-80"
          >
            <OttoSpark size={12} />
            AI steps
            <ChevronRight
              className={cn("size-3 transition-transform", stepsOpen && "rotate-90")}
              aria-hidden="true"
            />
          </button>
          {stepsOpen && (
            <ol className="mt-1.5 space-y-1 border-l border-otto/25 pl-3">
              {turn.steps.map((s) => (
                <li key={s} className="text-[11.5px] leading-snug text-muted-foreground">
                  {s}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}

      {turn.sources && turn.sources.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setSourcesOpen((v) => !v)}
            className="inline-flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Sources and more
            <ChevronRight
              className={cn("size-3 transition-transform", sourcesOpen && "rotate-90")}
              aria-hidden="true"
            />
          </button>
          {sourcesOpen && (
            <ul className="mt-1.5 flex flex-wrap gap-1.5">
              {turn.sources.map((s) => (
                <li
                  key={s}
                  className="rounded-md border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────── Shared canvas primitives ─────────────── */

export function CanvasHeader({
  eyebrow,
  title,
  meta,
  actions,
}: {
  eyebrow: string;
  title: string;
  meta?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-1 text-[21px] font-semibold tracking-tight">{title}</h1>
        {meta && <p className="mt-1 text-[12.5px] text-muted-foreground">{meta}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Chip({
  children,
  tone = "quiet",
}: {
  children: ReactNode;
  tone?: "quiet" | "risk" | "attention" | "positive" | "ai";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium",
        tone === "quiet" && "border-border text-muted-foreground",
        tone === "risk" && "border-destructive/25 text-destructive",
        tone === "attention" && "border-signal/35 bg-signal-soft text-signal",
        tone === "positive" && "border-otto/30 bg-otto-soft text-otto",
        tone === "ai" && "border-otto/30 bg-otto-soft text-otto",
      )}
    >
      {tone === "ai" && <OttoSpark size={11} />}
      {children}
    </span>
  );
}

/* ─────────────── Otto at minimum width: quiet contextual intelligence ─────────────── */

/**
 * When the workspace is given almost entirely to the adaptive UI, Otto stays
 * present as a compact LUX intelligence affordance — never a chat bubble.
 */
export function OttoMinimalRail({
  onExpand,
  headline,
  hasGuidance = true,
}: {
  onExpand: () => void;
  headline?: string;
  hasGuidance?: boolean;
}) {
  return (
    <aside
      aria-label="Otto"
      className="sticky top-0 flex h-full w-11 shrink-0 flex-col items-center gap-3 border-r border-border bg-background py-3"
    >
      <button
        type="button"
        onClick={onExpand}
        title={headline ? `Otto · ${headline}` : "Open Otto"}
        className="group relative flex w-8 flex-col items-center gap-2 rounded-lg border border-otto/25 bg-otto-soft py-2 text-otto transition-colors hover:border-otto/50"
      >
        <OttoSpark size={14} />
        <span className="[writing-mode:vertical-rl] text-[10px] font-semibold tracking-[0.14em]">
          OTTO
        </span>
        {hasGuidance && (
          <span
            aria-hidden="true"
            className="absolute -right-1 top-1 size-1.5 rounded-full bg-otto"
          />
        )}
        <span className="sr-only">Open Otto guidance</span>
      </button>
      {hasGuidance && headline && (
        <p className="[writing-mode:vertical-rl] max-h-[18rem] truncate text-[10.5px] text-muted-foreground">
          {headline}
        </p>
      )}
    </aside>
  );
}
