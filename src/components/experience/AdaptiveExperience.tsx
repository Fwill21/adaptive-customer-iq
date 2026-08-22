/**
 * One continuous workspace: LUX rail + Otto + adaptive canvas, where the user
 * controls the balance between conversation and direct UI with a single
 * workspace-level slider. The underlying state model never changes with it.
 */

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ADAPTIVE_MOMENTS,
  CUSTOMER,
  OTTO_SCRIPT,
  ottoReply,
  type AdaptiveMomentId,
} from "@/lib/adaptive-data";
import { GlobalRail, OttoPanel, type OttoTurn } from "./lux";
import { AdaptiveCanvas } from "./adaptive-canvas";
import { ActionButton } from "./drawer";
import type { ModeId } from "@/lib/mode-data";
import { ChevronRight } from "lucide-react";
import {
  DEFAULT_SPLIT,
  WorkspaceDivider,
  canvasDensity,
  ottoVariant,
  splitLabel,
} from "./workspace-split";

const ORDER: AdaptiveMomentId[] = ADAPTIVE_MOMENTS.map((m) => m.id);

const firstTurns = (id: AdaptiveMomentId): OttoTurn[] => [
  {
    kind: "otto",
    lines: OTTO_SCRIPT[id].say,
    steps: OTTO_SCRIPT[id].steps,
    sources: OTTO_SCRIPT[id].sources,
  },
];

export function AdaptiveExperience({
  person,
  mode,
  onChangePath,
  onSearch,
}: {
  person: { name: string; role: string };
  mode: ModeId;
  onChangePath: () => void;
  onSearch?: () => void;
}) {
  const [moment, setMoment] = useState<AdaptiveMomentId>("signal");
  const [showSupport, setShowSupport] = useState(false);
  const [turns, setTurns] = useState<OttoTurn[]>(firstTurns("signal"));
  // Otto's share of the workspace: 0 = full UI, 100 = full chat.
  const [split, setSplit] = useState(DEFAULT_SPLIT);
  const [dragging, setDragging] = useState(false);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const meta = ADAPTIVE_MOMENTS.find((m) => m.id === moment)!;
  const variant = ottoVariant(split);
  const density = canvasDensity(split);
  const ease = dragging
    ? undefined
    : "width 220ms cubic-bezier(0.4, 0, 0.2, 1)";

  const goMoment = (id: AdaptiveMomentId, userLine?: string) => {
    setMoment(id);
    if (id === "signal") setShowSupport(false);
    setTurns((prev) => [
      ...prev,
      ...(userLine ? ([{ kind: "user", text: userLine }] as OttoTurn[]) : []),
      ...firstTurns(id),
    ]);
  };

  const ask = (question: string) => {
    if (/back to my morning/i.test(question)) return goMoment("signal", question);
    setTurns((prev) => [
      ...prev,
      { kind: "user", text: question },
      { kind: "otto", lines: ottoReply(question), sources: OTTO_SCRIPT[moment].sources },
    ]);
  };

  /** Canvas actions drive both the canvas and Otto — one continuous thread. */
  const onAct = (action: string) => {
    switch (action) {
      case "review":
        return goMoment("evidence", "Why is Northwind at risk?");
      case "support":
        setShowSupport(true);
        return setTurns((prev) => [
          ...prev,
          {
            kind: "otto",
            lines: [
              "There is another factor. Three P1 cases affected the same workflows during the adoption decline.",
              "I held this back until it became relevant to what you were investigating.",
            ],
            sources: ["P1-4471", "P1-4488", "P1-4502"],
          },
        ]);
      case "intervene":
        return goMoment("decision", "This matters. What should I do?");
      case "coordinate":
        return goMoment("coordinate", "Coordinate the account team.");
      case "draft-qir":
      case "sent":
        return goMoment("review", "Draft the QIR narrative from this.");
      case "publish":
        return goMoment("thread", "Update the customer thread.");
      case "restart":
        return goMoment("signal", "Back to my morning.");
      case "second":
        return ask("Show second priority");
      case "qir":
        return ask("Compare last QIR");
      case "contact":
        return ask("Draft the customer message instead");
      case "monitor":
        return ask("What is the risk of waiting?");
      case "rewrite":
        return ask("Make it more direct");
      case "reassign":
        return ask("Who should own the fix?");
      case "success-plan":
        return ask("Show the success plan update");
      default:
        return ask(action);
    }
  };

  const prompts =
    mode === "ui" ? OTTO_SCRIPT[moment].prompts.slice(0, 1) : OTTO_SCRIPT[moment].prompts;

  const canvas = <AdaptiveCanvas moment={moment} showSupport={showSupport} onAct={onAct} />;

  return (
    <div className="flex h-screen bg-background">
      <GlobalRail
        active="CSP"
        person={person}
        onSearch={onSearch}
        onSelect={(k) => {
          if (k === "Home") goMoment("signal", "Back to my morning.");
          if (k === "Otto") {
            if (split < 20) setSplit(DEFAULT_SPLIT);
            ask("What should I focus on right now?");
          }
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* workspace chrome: breadcrumb + the workspace balance control */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border py-2.5 pl-5 pr-6">
          <ol className="flex min-w-0 items-center gap-1.5 text-[12.5px] text-muted-foreground">
            {meta.breadcrumb.map((c, i) => (
              <li key={c} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
                <span
                  className={
                    i === meta.breadcrumb.length - 1 ? "font-medium text-foreground" : undefined
                  }
                >
                  {c}
                </span>
              </li>
            ))}
          </ol>

          <div className="ml-auto flex items-center gap-4">
            {/* Otto may suggest a different balance — it never changes it itself. */}
            {density === "hidden" && (
              <button
                type="button"
                onClick={() => setBalance(65)}
                className="hidden items-center gap-1.5 rounded-full border border-otto/30 bg-otto-soft px-2.5 py-1 text-[11px] text-otto transition-colors hover:border-otto/60 lg:inline-flex"
              >
                <OttoSpark size={11} /> Easier with more workspace · Expand
              </button>
            )}
            {variant === "minimal" && (
              <button
                type="button"
                onClick={() => setBalance(50)}
                className="hidden items-center gap-1.5 rounded-full border border-otto/30 bg-otto-soft px-2.5 py-1 text-[11px] text-otto transition-colors hover:border-otto/60 lg:inline-flex"
              >
                <OttoSpark size={11} /> Work through this together · Open Otto
              </button>
            )}
            <p className="hidden text-[11.5px] text-muted-foreground xl:block">{meta.intent}</p>
            <WorkspaceBalance
              value={balance}
              onChange={setBalance}
              onDragChange={setDragging}
            />
          </div>
        </div>

        {/* the single workspace: Otto and the adaptive canvas share it */}
        <div className="flex min-h-0 flex-1">
          {variant === "minimal" ? (
            <OttoMinimalRail
              onExpand={() => setBalance(50)}
              headline={
                moment === "signal"
                  ? "Northwind outcome at risk"
                  : `${balanceLabel(balance)} · ${meta.label}`
              }
            />
          ) : (
            <OttoPanel
              fluid
              variant={variant === "wide" ? "wide" : variant === "condensed" ? "condensed" : "standard"}
              style={{ width: `${share * 100}%`, transition: ease }}
              turns={turns}
              prompts={prompts}
              contextLine={`${CUSTOMER.name} · ${CUSTOMER.quarter} · ${person.role}`}
              onAsk={ask}
              onCompose={() => setTurns(firstTurns(moment))}
              inline={
                density === "hidden" ? (
                  <div className="rounded-2xl border border-border bg-surface p-4">{canvas}</div>
                ) : undefined
              }
            />
          )}

          {density !== "hidden" && (
            <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
              <main className="flex-1 px-5 py-6 lg:px-8">
                <div
                  className={cn(
                    "mx-auto w-full",
                    density === "compact" && "max-w-[34rem]",
                    density === "medium" && "max-w-[56rem]",
                    density === "full" && "max-w-[76rem]",
                  )}
                  data-density={density}
                >
                  {canvas}
                </div>
              </main>
            </div>
          )}
        </div>

        {/* presenter strip — moments, not production navigation */}
        <footer className="flex flex-wrap items-center gap-2 border-t border-border bg-background/95 px-5 py-2 backdrop-blur">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Adaptive canvas
          </span>
          <nav className="flex flex-wrap items-center gap-0.5">
            {ADAPTIVE_MOMENTS.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => goMoment(m.id)}
                className={cn(
                  "rounded-md px-2 py-1 text-[11.5px] transition-colors",
                  m.id === moment
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-mono text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                <span className="ml-1.5 hidden lg:inline">{m.label}</span>
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ActionButton
              variant="tertiary"
              onClick={() => {
                const i = ORDER.indexOf(moment);
                if (i < ORDER.length - 1) goMoment(ORDER[i + 1]!);
              }}
            >
              Next moment
            </ActionButton>
            <ActionButton variant="tertiary" onClick={onChangePath}>
              Change demo path
            </ActionButton>
          </div>
        </footer>
      </div>
    </div>
  );
}
