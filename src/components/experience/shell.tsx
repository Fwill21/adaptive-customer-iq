import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  NAV,
  ACTIVITY_RAIL,
  ADOPTION_SERIES,
  VALUE_SERIES,
  OTTO_SUGGESTIONS,
  OTTO_ANSWERS,
  OTTO_FALLBACK,
  
} from "@/lib/story-data";
import type { Detail } from "@/lib/story-data";
import { OttoMark } from "./primitives";
import { DetailDrawer, useDrawer } from "./drawer";

/** Every metric in the environment is explainable — Otto can always show its reasoning. */
export function metricDetail(label: string, value: string, note?: string): Detail {
  return {
    title: label,
    meta: `Q3 2026 · ${value}`,
    summary: `Otto assembled ${label.toLowerCase()} (${value}) from live product telemetry, workflow records and account history — refreshed continuously, not at reporting time.`,
    sections: [
      {
        label: "How Otto calculates this",
        items: [
          `Current reading: ${value}${note ? ` (${note})` : ""}`,
          "Source: product usage events, deployment records, support and workflow history",
          "Refreshed continuously as new signals arrive from the environment",
        ],
      },
      {
        label: "Contributing agents",
        items: [
          "Adoption Signal Agent — usage pattern and workflow-level movement",
          "Deployment Health Agent — configuration and release correlation",
          "Value Realization Agent — links movement to committed business outcomes",
        ],
      },
      {
        label: "What this changes",
        items: [
          "Feeds the prioritized situations on your home surface",
          "Included automatically in the customer value story",
          "Shared context — the same reading is visible to CSM, TSM and AE",
        ],
      },
    ],
    confirm: "Add to the customer value story",
  };
}
import {
  Activity,
  ArrowUp,
  Building2,
  ChevronDown,
  ClipboardList,
  Home,
  Lightbulb,
  Search,
  TrendingUp,
} from "lucide-react";

const NAV_ICONS = [Home, Building2, ClipboardList, Activity, TrendingUp, Lightbulb];

/* ─────────────── Global shell ─────────────── */

export function LeftNav({
  active = "Home",
  onNavigate,
}: {
  active?: string;
  onNavigate?: (item: string) => void;
}) {
  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 hidden h-screen w-[13.5rem] shrink-0 flex-col border-r border-border bg-background px-3 py-5 lg:flex"
    >
      <div className="flex items-center gap-2.5 px-2 pb-6">
        <span className="text-otto">
          <OttoMark size={18} />
        </span>
        <span className="text-[13px] font-semibold tracking-tight">Customer Success</span>
      </div>
      <ul className="space-y-0.5">
        {NAV.map((item, i) => {
          const Icon = NAV_ICONS[i]!;
          const on = item === active;
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => onNavigate?.(item)}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
                  on
                    ? "bg-surface font-medium text-foreground shadow-calm"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={1.6} aria-hidden="true" />
                {item}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-auto px-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
        CSP on AINPX
      </p>
    </nav>
  );
}

/* Searchable index — every entry resolves to a real destination in the
 * experience so search is navigation, not decoration. */
type SearchEntry = { label: string; group: string; hint: string; target: string };

const SEARCH_INDEX: SearchEntry[] = [
  { label: "Acme Corporation", group: "Accounts", hint: "Strategic Enterprise · Q3 in motion", target: "Accounts" },
  { label: "Globex Industries", group: "Accounts", hint: "Enterprise · healthy adoption", target: "Accounts" },
  { label: "Contoso Group", group: "Accounts", hint: "Enterprise · renewal in 90 days", target: "Accounts" },
  { label: "Acme adoption trajectory", group: "Signals", hint: "Adoption declined 18% since week 6", target: "Customer Activity" },
  { label: "Wave 2 rollout milestone", group: "Signals", hint: "Deployment history and configuration change", target: "Customer Activity" },
  { label: "Q3 value realized", group: "Value", hint: "Outcomes linked to committed objectives", target: "Value" },
  { label: "Success plan — Acme", group: "Success Plans", hint: "Objectives, owners and next actions", target: "Success Plans" },
  { label: "Executive briefing", group: "Meetings", hint: "Decision-first prep for the next review", target: "Meetings" },
  { label: "What needs my attention this week?", group: "Ask Otto", hint: "Prioritized situations across the portfolio", target: "Home" },
  { label: "Which accounts are at risk?", group: "Ask Otto", hint: "Risk signals ranked by revenue exposure", target: "Home" },
  { label: "How does this environment actually work?", group: "Ask Otto", hint: "The operating model and the three awarenesses", target: "Insights" },
];

/* A custom query still has to land somewhere real — keyword routing maps free
 * text to the closest destination in the experience. */
const CUSTOM_ROUTES: { keys: string[]; target: string; hint: string }[] = [
  { keys: ["value", "roi", "outcome", "impact"], target: "Value", hint: "Strategic value and realized outcomes" },
  { keys: ["risk", "churn", "adoption", "signal", "decline", "usage"], target: "Customer Activity", hint: "Signals and adoption trajectory" },
  { keys: ["plan", "objective", "milestone", "owner"], target: "Success Plans", hint: "Success plan objectives and owners" },
  { keys: ["meeting", "qbr", "brief", "review", "exec"], target: "Meetings", hint: "Executive briefing and meeting prep" },
  { keys: ["account", "acme", "globex", "contoso", "customer"], target: "Accounts", hint: "Account workspace" },
  { keys: ["agent", "otto", "architecture", "model", "awareness", "insight"], target: "Insights", hint: "Operating model and agent intelligence" },
];

function resolveCustom(query: string) {
  const q = query.trim().toLowerCase();
  const match = CUSTOM_ROUTES.find((r) => r.keys.some((k) => q.includes(k)));
  return match ?? { target: "Home", hint: "Prioritized situations across the portfolio" };
}

export function TopBar({
  breadcrumb,
  person,
  onBreadcrumb,
}: {
  breadcrumb: string[];
  person: { name: string; role: string };
  onBreadcrumb?: (item: string) => void;
}) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  // The entry the presenter has staged in the box — a suggestion click fills
  // the input first so the search reads like a real query before it navigates.
  const [staged, setStaged] = useState<SearchEntry | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const q = query.trim().toLowerCase();
  const results = q
    ? SEARCH_INDEX.filter(
        (e) =>
          e.label.toLowerCase().includes(q) ||
          e.group.toLowerCase().includes(q) ||
          e.hint.toLowerCase().includes(q),
      )
    : SEARCH_INDEX;
  const groups = Array.from(new Set(results.map((r) => r.group)));

  const closeSearch = () => {
    setSearchOpen(false);
    setQuery("");
    setStaged(null);
  };

  const go = (target: string) => {
    closeSearch();
    onBreadcrumb?.(target);
  };

  // First click stages the criteria in the box; a second click (or Enter, or
  // the Open button) runs it.
  const pick = (entry: SearchEntry) => {
    if (staged?.label === entry.label) {
      go(entry.target);
      return;
    }
    setQuery(entry.label);
    setStaged(entry);
    setSearchOpen(true);
    inputRef.current?.focus();
  };

  const runSearch = () => {
    if (!q) return;
    if (staged) return go(staged.target);
    if (results[0]) return go(results[0].target);
    go(resolveCustom(query).target);
  };

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);


  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-3 lg:px-10">
      <ol className="flex items-center gap-2 text-[13px] text-muted-foreground">
        {breadcrumb.map((b, i) => {
          const isLast = i === breadcrumb.length - 1;
          // "Home" is a global anchor and stays clickable everywhere, even when
          // it is the current crumb — any other trailing crumb is static text.
          const clickable = !isLast || b === "Home";
          return (
            <li key={b} className="flex items-center gap-2">
              {i > 0 && <span className="text-border-strong">/</span>}
              {clickable ? (
                <button
                  type="button"
                  onClick={() => onBreadcrumb?.(b)}
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "rounded transition-colors hover:text-foreground",
                    isLast && "font-medium text-foreground",
                  )}
                >
                  {b}
                </button>
              ) : (
                <span className="text-foreground">{b}</span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="relative flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onFocus={() => setSearchOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) select(results[0]);
            }}
            placeholder="Search accounts, signals, value…"
            aria-label="Search"
            className="w-[15rem] rounded-lg border border-border bg-surface py-1.5 pl-9 pr-3 text-[13px] outline-none transition-colors placeholder:text-muted-foreground focus:border-otto/50 lg:w-[19rem]"
          />

          {searchOpen && (
            <>
              <button
                type="button"
                aria-label="Close search"
                onClick={closeSearch}
                className="fixed inset-0 z-40 cursor-default"
              />
              <div className="soft-in absolute right-0 top-[calc(100%+0.5rem)] z-50 max-h-[26rem] w-[24rem] overflow-y-auto rounded-2xl border border-border bg-surface p-2 shadow-lift">
                {groups.length === 0 && (
                  <p className="px-3 py-4 text-[13px] text-muted-foreground">
                    Nothing matches “{query}”. Try an account, a signal or a value question.
                  </p>
                )}
                {groups.map((g) => (
                  <div key={g} className="py-1">
                    <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                      {g}
                    </p>
                    {results
                      .filter((r) => r.group === g)
                      .map((r) => (
                        <button
                          key={r.label}
                          type="button"
                          onClick={() => select(r)}
                          className="block w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-secondary"
                        >
                          <span className="block text-[13px] font-medium">{r.label}</span>
                          <span className="mt-0.5 block text-[12px] text-muted-foreground">
                            {r.hint}
                          </span>
                        </button>
                      ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <span className="text-right text-[12px] leading-tight">
          {person.name}
          <br />
          <span className="text-muted-foreground">{person.role}</span>
        </span>
      </div>
    </div>
  );
}



/* ─────────────── Surfaces ─────────────── */

export function Surface({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border bg-surface shadow-calm",
        padded && "p-6 md:p-8",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionTitle({
  children,
  meta,
}: {
  children: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-3">
      <h2 className="text-[15px] font-semibold tracking-tight">{children}</h2>
      {meta && <span className="text-[12px] text-muted-foreground">{meta}</span>}
    </div>
  );
}

export function PageHeading({
  title,
  meta,
  intent,
}: {
  title: string;
  meta?: string;
  intent?: string;
}) {
  return (
    <header className="rise">
      <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight md:text-[2.1rem]">
        {title}
      </h1>
      {meta && <p className="mt-1.5 text-[13px] text-muted-foreground">{meta}</p>}
      {intent && <p className="mt-4 max-w-2xl text-[15px] leading-relaxed">{intent}</p>}
    </header>
  );
}

export function Tabs({
  items,
  value,
  onChange,
}: {
  items: readonly string[];
  value: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border">
      {items.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange?.(t)}
          className={cn(
            "-mb-px border-b-2 px-3 py-2.5 text-[13px] transition-colors",
            t === value
              ? "border-otto font-medium text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground",
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ─────────────── Metrics ─────────────── */

export function Kpi({
  value,
  label,
  note,
  tone = "flat",
  detail,
}: {
  value: string;
  label: string;
  note?: string;
  tone?: "up" | "down" | "flat" | "warn";
  detail?: Detail;
}) {
  const drawer = useDrawer();
  const d = detail ?? metricDetail(label, value, note);
  return (
    <div className="border-l border-border pl-4 first:border-l-0 first:pl-0">
      <button
        type="button"
        onClick={() => drawer.open(`kpi:${label}`, d)}
        className="group w-full text-left"
      >
        <p className="text-[13px] text-muted-foreground group-hover:text-foreground">{label}</p>
        <p className="mt-1.5 text-[1.6rem] font-semibold leading-none tracking-tight">{value}</p>
        {note && (
          <p
            className={cn(
              "mt-1.5 text-[12px]",
              tone === "down" && "text-destructive",
              tone === "up" && "text-human",
              tone === "warn" && "text-signal",
              tone === "flat" && "text-muted-foreground",
            )}
          >
            {note}
          </p>
        )}
        <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          How Otto knows
        </span>
      </button>
      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    </div>
  );
}

export function ScoreCard({ items }: { items: { value: string; label: string }[] }) {
  const drawer = useDrawer();
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-6">
      {items.map((i) => (
        <button
          key={i.label}
          type="button"
          onClick={() => drawer.open(`score:${i.label}`, metricDetail(i.label, i.value))}
          className="group text-left"
        >
          <p className="text-[1.5rem] font-semibold leading-none tracking-tight">{i.value}</p>
          <p className="mt-1.5 text-[12px] leading-snug text-muted-foreground group-hover:text-foreground">
            {i.label}
          </p>
        </button>
      ))}
      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    </div>
  );
}

export function Meter({ value, label }: { value: number; label: string }) {
  const drawer = useDrawer();
  return (
    <div>
      <button
        type="button"
        onClick={() => drawer.open(`meter:${label}`, metricDetail(label, `${value}%`))}
        className="group w-full text-left"
      >
        <div className="flex items-baseline justify-between text-[12px] text-muted-foreground">
          <span className="group-hover:text-foreground">{label}</span>
          <span className="text-foreground">{value}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-otto" style={{ width: `${value}%` }} />
        </div>
      </button>
      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    </div>
  );
}

/* ─────────────── Progressive disclosure ─────────────── */

export function Disclosure({
  label,
  children,
  tone = "quiet",
}: {
  label: string;
  children: ReactNode;
  tone?: "quiet" | "agent";
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-xl border",
        tone === "agent" ? "border-agent/20 bg-agent-soft" : "border-border bg-background",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-[13px] font-medium"
      >
        {label}
        <ChevronDown
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && <div className="soft-in border-t border-border/70 px-4 py-4 text-[14px]">{children}</div>}
    </div>
  );
}

/* ─────────────── Intelligence activity rail ─────────────── */

export function IntelligenceRail({
  items = ACTIVITY_RAIL,
  title = "Customer Intelligence Activity",
}: {
  items?: typeof ACTIVITY_RAIL;
  title?: string;
}) {
  const drawer = useDrawer();
  return (
    <Surface className="lg:sticky lg:top-6">
      <SectionTitle meta="Continuous">{title}</SectionTitle>
      <ol className="mt-5 space-y-5">
        {items.map((a, i) => (
          <li key={a.title} className="relative pl-6">
            <span className="absolute left-0 top-1.5 size-2 rounded-full bg-otto" />
            {i < items.length - 1 && (
              <span className="absolute left-[3.5px] top-4 h-[calc(100%+0.7rem)] w-px bg-border" />
            )}
            <button
              type="button"
              onClick={() =>
                drawer.open(`activity:${a.title}`, {
                  title: a.title,
                  meta: `${a.when} · Continuous intelligence`,
                  summary:
                    "This ran without being asked. Otto keeps working the account between your moments and only surfaces what changes a decision.",
                  sections: [
                    { label: "What the agent observed", items: [...a.lines] },
                    {
                      label: "Where it went",
                      items: [
                        "Written into the shared Acme Corporation context",
                        "Visible to CSM, TSM and AE without hand-off",
                        "Carried forward into the quarterly value story",
                      ],
                    },
                  ],
                  confirm: "Acknowledge and keep monitoring",
                })
              }
              className="group w-full text-left"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {a.when}
              </p>
              <p className="mt-1 text-[14px] font-medium leading-snug group-hover:text-otto">
                {a.title}
              </p>
              {a.lines.map((l) => (
                <p key={l} className="mt-1 text-[13px] leading-snug text-muted-foreground">
                  {l}
                </p>
              ))}
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-6 border-t border-border pt-4 text-[12px] leading-relaxed text-muted-foreground">
        The environment maintains customer context between moments, not only when prompted.
      </p>
      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    </Surface>
  );
}

/* ─────────────── Charts ─────────────── */

const W = 640;
const H = 200;

function scale(v: number, min: number, max: number) {
  return H - ((v - min) / (max - min)) * (H - 24) - 12;
}

function path(values: (number | null)[], min: number, max: number) {
  const step = W / (values.length - 1);
  let d = "";
  values.forEach((v, i) => {
    if (v == null) return;
    const x = i * step;
    const y = scale(v, min, max);
    d += d === "" ? `M${x} ${y}` : ` L${x} ${y}`;
  });
  return d;
}

export function AdoptionChart() {
  const { labels, actual, target, projected, divergeIndex } = ADOPTION_SERIES;
  const min = 55;
  const max = 95;
  const step = W / (labels.length - 1);
  const dx = divergeIndex * step;
  const dy = scale(actual[divergeIndex]!, min, max);
  const drawer = useDrawer();

  const weekDetail = (i: number) => ({
    title: `${labels[i]} — adoption detail`,
    meta: `Acme Corporation · Strategic workflow adoption`,
    summary:
      i >= divergeIndex
        ? "From this point the actual adoption curve separates from the committed target. Otto correlated the break with a deployment configuration change."
        : "Adoption tracked to plan in this period. Otto kept monitoring without raising anything.",
    sections: [
      {
        label: "Readings",
        items: [
          `Actual adoption: ${actual[i]}%`,
          `Target adoption: ${target[i]}%`,
          projected[i] != null ? `Projected if unaddressed: ${projected[i]}%` : "Projection not applicable for this period",
        ],
      },
      {
        label: "Agent evidence",
        items: [
          "Adoption Signal Agent — workflow-level usage per deployment group",
          "Deployment Health Agent — configuration change history",
          "Support Signal Agent — related tickets and user friction",
        ],
      },
    ],
    confirm: "Use this period as evidence",
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-5 text-[12px] text-muted-foreground">
        <Legend color="bg-primary" label="Actual" />
        <Legend color="bg-border-strong" label="Target" dashed />
        <Legend color="bg-signal" label="Projected" dashed />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 h-52 w-full" role="img" aria-label="Strategic adoption trajectory">
        {[0, 1, 2, 3].map((g) => (
          <line
            key={g}
            x1="0"
            x2={W}
            y1={12 + (g * (H - 24)) / 3}
            y2={12 + (g * (H - 24)) / 3}
            stroke="var(--color-border)"
          />
        ))}
        <path d={path(target, min, max)} fill="none" stroke="var(--color-border-strong)" strokeWidth="1.5" strokeDasharray="5 5" />
        <path d={path(projected, min, max)} fill="none" stroke="var(--color-signal)" strokeWidth="1.5" strokeDasharray="3 4" />
        <path d={path(actual, min, max)} fill="none" stroke="var(--color-primary)" strokeWidth="2.25" />
        <line x1={dx} x2={dx} y1="8" y2={H - 8} stroke="var(--color-signal)" strokeOpacity="0.5" strokeDasharray="3 3" />
        <circle
          cx={dx}
          cy={dy}
          r="7"
          fill="var(--color-signal)"
          fillOpacity="0.2"
          className="cursor-pointer"
          onClick={() => drawer.open(`week:${divergeIndex}`, weekDetail(divergeIndex))}
        />
        <circle cx={dx} cy={dy} r="4.5" fill="var(--color-signal)" className="pointer-events-none" />
      </svg>
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        {labels.map((l, i) => (
          <button
            key={l}
            type="button"
            onClick={() => drawer.open(`week:${i}`, weekDetail(i))}
            className="rounded px-1 py-0.5 uppercase tracking-[0.1em] hover:bg-surface hover:text-foreground"
          >
            {l}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => drawer.open(`week:${divergeIndex}`, weekDetail(divergeIndex))}
        className="mt-3 block text-left text-[13px] text-muted-foreground hover:text-foreground"
      >
        <span className="font-medium text-foreground">Week 4 —</span> adoption diverged from target,
        one day after the deployment configuration change.
      </button>
      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className={cn("h-0.5 w-5", color, dashed && "opacity-70")} />
      {label}
    </span>
  );
}

export function ValueChart() {
  const { points, marks } = VALUE_SERIES;
  const min = 0;
  const max = 2.8;
  const step = W / (points.length - 1);
  const line = path(points, min, max);
  const area = `${line} L${W} ${H - 12} L0 ${H - 12} Z`;
  const drawer = useDrawer();

  const markDetail = (m: { i: number; label: string }) => ({
    title: m.label,
    meta: `Acme Corporation · Value realized: $${points[m.i]}M`,
    summary:
      "Otto captured this value moment when it happened, with the evidence attached — nothing had to be reconstructed at quarter end.",
    sections: [
      {
        label: "What happened",
        items: [
          m.label,
          `Cumulative value realized at this point: $${points[m.i]}M`,
          "Captured automatically from workflow and outcome records",
        ],
      },
      {
        label: "Evidence attached",
        items: [
          "Value Realization Agent — outcome linked to the customer's committed objective",
          "Adoption Signal Agent — usage change that produced the outcome",
          "Executive Narrative Agent — phrasing prepared for the customer review",
        ],
      },
    ],
    confirm: "Include in the executive value story",
  });

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-56 w-full" role="img" aria-label="Value realized this quarter">
        <defs>
          <linearGradient id="valueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-otto)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--color-otto)" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((g) => (
          <line
            key={g}
            x1="0"
            x2={W}
            y1={12 + (g * (H - 24)) / 3}
            y2={12 + (g * (H - 24)) / 3}
            stroke="var(--color-border)"
          />
        ))}
        <path d={area} fill="url(#valueFill)" />
        <path d={line} fill="none" stroke="var(--color-otto)" strokeWidth="2.25" />
        {marks.map((m) => (
          <circle
            key={m.label}
            cx={m.i * step}
            cy={scale(points[m.i]!, min, max)}
            r="7"
            fill="var(--color-otto)"
            fillOpacity="0.14"
            className="cursor-pointer"
            onClick={() => drawer.open(`mark:${m.label}`, markDetail(m))}
          />
        ))}
        {marks.map((m) => (
          <circle
            key={`dot-${m.label}`}
            cx={m.i * step}
            cy={scale(points[m.i]!, min, max)}
            r="4"
            fill="var(--color-surface)"
            stroke="var(--color-otto)"
            strokeWidth="2"
            className="pointer-events-none"
          />
        ))}
      </svg>
      <ol className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
        {marks.map((m) => (
          <li key={m.label}>
            <button
              type="button"
              onClick={() => drawer.open(`mark:${m.label}`, markDetail(m))}
              className="group flex items-baseline gap-2 text-left text-[13px]"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-otto" />
              <span className="text-muted-foreground group-hover:text-foreground">{m.label}</span>
            </button>
          </li>
        ))}
      </ol>
      <DetailDrawer
        detail={drawer.detail}
        onClose={drawer.close}
        onConfirm={drawer.confirm}
        confirmed={drawer.confirmed}
      />
    </div>
  );
}

/* ─────────────── Otto native input ─────────────── */

export function OttoAsk({ placeholder }: { placeholder: string }) {
  const [value, setValue] = useState("");
  const [asked, setAsked] = useState<string | null>(null);

  const submit = (q: string) => {
    if (!q.trim()) return;
    setAsked(q.trim());
    setValue("");
  };

  const answer = (asked && OTTO_ANSWERS[asked]) || OTTO_FALLBACK;

  return (
    <div className="space-y-3 text-left">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(value);
        }}
        className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-4 shadow-calm focus-within:border-otto/50"
      >
        <span className="text-otto">
          <OttoMark size={18} />
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          aria-label="Ask Otto"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          aria-label="Ask Otto"
          className="rounded-full bg-primary p-1.5 text-primary-foreground disabled:opacity-35"
          disabled={!value.trim()}
        >
          <ArrowUp className="size-3.5" aria-hidden="true" />
        </button>
      </form>

      <div className="flex flex-wrap justify-center gap-2">
        {OTTO_SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => submit(s)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[12px] transition-colors",
              asked === s
                ? "border-otto/40 bg-otto-soft text-otto"
                : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {asked && (
        <div className="soft-in space-y-3 rounded-2xl border border-border bg-surface px-5 py-4 shadow-calm">
          <div className="flex justify-end">
            <p className="rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-[13px] text-primary-foreground">
              {asked}
            </p>
          </div>
          <div className="flex gap-3">
            <span className="mt-0.5 shrink-0 text-otto">
              <OttoMark size={16} />
            </span>
            <div className="space-y-2">
              {answer.map((a) => (
                <p key={a} className="text-[14px] leading-relaxed">
                  {a}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export function StatusPill({
  children,
  tone = "quiet",
}: {
  children: ReactNode;
  tone?: "quiet" | "risk" | "attention" | "positive";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium",
        tone === "quiet" && "border-border text-muted-foreground",
        tone === "risk" && "border-destructive/25 bg-destructive/8 text-destructive",
        tone === "attention" && "border-signal/30 bg-signal-soft text-signal",
        tone === "positive" && "border-otto/25 bg-otto-soft text-otto",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
