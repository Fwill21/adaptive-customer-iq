/**
 * Path 1 — "A Quarter in the Life of a CSM" (Northstar Health).
 *
 * Act 1 shows the quarter as it works today, with Maya as the connective
 * tissue between systems, people and artifacts. Act 2 replays the same quarter
 * on LUX inside the persistent three-layer workspace: global rail, Otto
 * guidance, adaptive canvas separated by the draggable split.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ACT_LABEL,
  MAYA,
  NORTHSTAR,
  NORTHSTAR_ALERT,
  NS_OTTO,
  NS_OTTO_TRAIL,
  QIM_STEPS,
  nsReply,
  type QimStepId,
} from "@/lib/northstar-data";
import { GlobalRail, OttoPanel, type OttoTurn } from "./lux";
import { ActionButton } from "./drawer";
import { ChevronRight } from "lucide-react";
import {
  DEFAULT_SPLIT,
  WorkspaceDivider,
  canvasDensity,
  ottoVariant,
  splitLabel,
} from "./workspace-split";
import { TodayNotice, TodayBuildStory, TodayPrepareLead } from "./northstar/act1";
import { TransitionScreen, WrapUpScreen } from "./northstar/transition";
import { NorthstarNotification } from "./northstar/why";
import {
  ActivityRail,
  MomentAttention,
  MomentDecide,
  MomentForward,
  MomentQbr,
  MomentUnderstand,
} from "./northstar/act2";

const ORDER: QimStepId[] = QIM_STEPS.map((s) => s.id);

const ottoTurn = (id: QimStepId): OttoTurn[] => [
  {
    kind: "otto",
    lines: NS_OTTO[id].lines,
    ...(NS_OTTO_TRAIL[id] ? { trail: NS_OTTO_TRAIL[id]! } : {}),
    ...(NS_OTTO[id].steps ? { steps: NS_OTTO[id].steps } : {}),
    ...(NS_OTTO[id].sources ? { sources: NS_OTTO[id].sources } : {}),
  },
];

const FOCUS: Partial<Record<QimStepId, string>> = {
  l1: "Whether Northstar deserves attention right now.",
  l2: "Whether the evidence supports the explanation.",
  l3: "Which recommendation matters most, and what may change.",
  l4: "What ServiceNow says to the customer.",
  l5: "Whether the customer commitment changes.",
};

export function QuarterInMotion({
  onChangePath,
  onQbrPath,
  onSearch,
}: {
  onChangePath: () => void;
  onQbrPath?: () => void;
  onSearch?: () => void;
}) {
  const [step, setStep] = useState<QimStepId>("t1");
  const [turns, setTurns] = useState<OttoTurn[]>(ottoTurn("t1"));
  const [split, setSplit] = useState(DEFAULT_SPLIT);
  const [dragging, setDragging] = useState(false);
  // Proactive pull-in: LUX brings Northstar to Maya before she navigates to it.
  const [alertState, setAlertState] = useState<"pending" | "shown" | "closed">("pending");
  const workspaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (alertState !== "pending") return;
    if (step !== "transition") return;
    const t = setTimeout(() => setAlertState("shown"), 1400);
    return () => clearTimeout(t);
  }, [step, alertState]);

  const meta = QIM_STEPS.find((s) => s.id === step)!;
  const variant = ottoVariant(split);
  const density = canvasDensity(split);
  const ease = dragging ? undefined : "width 220ms cubic-bezier(0.4, 0, 0.2, 1)";

  const go = (id: QimStepId, userLine?: string) => {
    setStep(id);
    if (id === step && !userLine) return;
    setTurns((prev) => [
      ...prev,
      ...(userLine ? ([{ kind: "user", text: userLine }] as OttoTurn[]) : []),
      ...ottoTurn(id),
    ]);
  };

  const ask = (question: string) => {
    setTurns((prev) => [
      ...prev,
      { kind: "user", text: question },
      {
        kind: "otto",
        lines: nsReply(question),
        ...(NS_OTTO[step].sources ? { sources: NS_OTTO[step].sources! } : {}),
      },
    ]);
  };

  const next = () => {
    const i = ORDER.indexOf(step);
    if (i < ORDER.length - 1) go(ORDER[i + 1]!);
  };

  const canvas = useMemo(() => {
    switch (step) {
      case "t1":
        return <TodayNotice onNext={next} />;
      case "t2":
        return <TodayBuildStory onNext={next} />;
      case "t3":
        return <TodayPrepareLead onNext={next} />;
      case "transition":
        return <TransitionScreen onNext={next} />;
      case "l1":
        return <MomentAttention onOpenWorkspace={() => go("l2", "Investigate Northstar now.")} />;
      case "l2":
        return <MomentUnderstand onNext={() => go("l3", "What should we do about it?")} />;
      case "l3":
        return <MomentDecide onNext={() => go("l4", "Take me to the QBR.")} />;
      case "l4":
        return <MomentQbr onNext={() => go("l5", "Carry the outcome forward.")} />;
      case "l5":
        return <MomentForward onNext={() => go("wrap")} />;
      case "wrap":
        return (
          <WrapUpScreen
            onRestart={() => {
              setStep("t1");
              setTurns(ottoTurn("t1"));
            }}
            onQbrPath={() => (onQbrPath ? onQbrPath() : onChangePath())}
          />
        );
      default:
        return null;
    }
  }, [step]);

  const isLux = meta.act === "lux";

  return (
    <div className="flex h-screen bg-background">
      <GlobalRail
        active="CSP"
        person={MAYA}
        onSearch={onSearch}
        onSelect={(k) => {
          if (k === "Home") go(meta.act === "today" ? "t1" : "l1");
          if (k === "Otto") {
            if (split < 20) setSplit(DEFAULT_SPLIT);
            ask("What is still open?");
          }
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-border py-2.5 pl-5 pr-6">
          <ol className="flex min-w-0 items-center gap-1.5 text-[12.5px] text-muted-foreground">
            {meta.crumb.map((c, i) => (
              <li key={c} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
                <span
                  className={i === meta.crumb.length - 1 ? "font-medium text-foreground" : undefined}
                >
                  {c}
                </span>
              </li>
            ))}
          </ol>

          <div className="ml-auto flex items-center gap-4">
            <p className="hidden text-[11.5px] text-muted-foreground xl:block">
              {ACT_LABEL[meta.act]} · {NORTHSTAR.name} · {NORTHSTAR.quarter}
            </p>
            <p
              aria-live="polite"
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.12em] transition-opacity duration-200",
                dragging ? "text-otto opacity-100" : "text-muted-foreground opacity-60",
              )}
            >
              {splitLabel(split)}
            </p>
          </div>
        </div>

        <div ref={workspaceRef} className="flex min-h-0 flex-1">
          {split <= 0 ? (
            <WorkspaceDivider
              value={split}
              onChange={setSplit}
              onDragChange={setDragging}
              containerRef={workspaceRef}
              edge="left"
            />
          ) : (
            <OttoPanel
              fluid
              variant={variant === "wide" ? "wide" : variant === "condensed" ? "condensed" : "standard"}
              style={{ width: split >= 100 ? "100%" : `${split}%`, transition: ease }}
              turns={turns}
              prompts={NS_OTTO[step].prompts}
              contextLine={`${NORTHSTAR.name} · ${NORTHSTAR.quarter} · ${MAYA.role}`}
              onAsk={ask}
              onCompose={() => setTurns(ottoTurn(step))}
            />
          )}

          {split > 0 && (
            <WorkspaceDivider
              value={split}
              onChange={setSplit}
              onDragChange={setDragging}
              containerRef={workspaceRef}
              {...(split >= 100 ? ({ edge: "right" } as const) : {})}
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
                    density === "full" && "max-w-[80rem]",
                  )}
                >
                  {isLux && density === "full" ? (
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_16rem]">
                      <div className="min-w-0">{canvas}</div>
                      <ActivityRail step={step} focus={FOCUS[step]} />
                    </div>
                  ) : (
                    canvas
                  )}
                </div>
              </main>
            </div>
          )}
        </div>

        {alertState === "shown" && (
          <NorthstarNotification
            alert={NORTHSTAR_ALERT}
            onOpen={() => {
              setAlertState("closed");
              go("l1", "Open Northstar — what changed?");
            }}
            onDismiss={() => setAlertState("closed")}
          />
        )}

        <footer className="flex flex-wrap items-center gap-2 border-t border-border bg-background/95 px-5 py-2 backdrop-blur">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            A quarter in the life
          </span>
          <nav className="flex flex-wrap items-center gap-0.5">
            {QIM_STEPS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => go(s.id)}
                className={cn(
                  "rounded-md px-2 py-1 text-[11.5px] transition-colors",
                  s.id === step
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                  s.act === "lux" && "text-otto",
                  s.id === step && s.act === "lux" && "bg-otto-soft",
                )}
              >
                {s.num && <span className="font-mono text-[10px]">{s.num}</span>}
                <span className={cn(s.num && "ml-1.5", "hidden lg:inline")}>{s.label}</span>
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <ActionButton variant="tertiary" onClick={next}>
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
