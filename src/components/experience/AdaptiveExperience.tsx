/**
 * The split-screen future experience: LUX rail + persistent Otto guidance +
 * an adaptive canvas that changes with the moment.
 */

import { useState } from "react";
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

  const meta = ADAPTIVE_MOMENTS.find((m) => m.id === moment)!;

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

  return (
    <div className="flex min-h-screen bg-background">
      <GlobalRail
        active="CSP"
        person={person}
        onSearch={onSearch}
        onSelect={(k) => {
          if (k === "Home") goMoment("signal", "Back to my morning.");
          if (k === "Otto") ask("What should I focus on right now?");
        }}
      />

      <OttoPanel
        turns={turns}
        prompts={prompts}
        contextLine={`${CUSTOMER.name} · ${CUSTOMER.quarter} · ${person.role}`}
        onAsk={ask}
        onCompose={() => setTurns(firstTurns(moment))}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* app bar: breadcrumb + moment context */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-5 py-2.5">
          <ol className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
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
          <p className="ml-auto text-[11.5px] text-muted-foreground">{meta.intent}</p>
        </div>

        <main className="flex-1 px-5 py-6 lg:px-8">
          <AdaptiveCanvas moment={moment} showSupport={showSupport} onAct={onAct} />
        </main>

        {/* presenter strip — moments, not production navigation */}
        <footer className="sticky bottom-0 flex flex-wrap items-center gap-2 border-t border-border bg-background/95 px-5 py-2 backdrop-blur">
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
