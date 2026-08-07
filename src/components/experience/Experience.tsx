import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AGENTS, AI_ACTIVITY, MOMENTS } from "@/lib/story-data";
import { OttoMark } from "./primitives";
import {
  MomentArchitecture,
  MomentBeforeAfter,
  MomentCoordinate,
  MomentPrepare,
  MomentSomethingChanged,
  MomentStartQuarter,
  MomentValue,
} from "./moments";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OVERLAY_SUMMARY: Record<number, string> = {
  1: "Otto → synthesised a prioritised orientation for this person, this week.",
  2: "Otto → synthesised one recommendation: investigate with the TSM first.",
  3: "Otto → packaged context and routed work to the TSM and AE.",
  4: "Otto → generated a decision-first briefing and drafted answers.",
  5: "Otto → assembled the quarter into a customer value narrative.",
};

export function Experience() {
  const [step, setStep] = useState(0);
  const [showActivity, setShowActivity] = useState(false);
  const moment = MOMENTS[step]!;

  const go = useCallback((delta: number) => {
    setStep((s) => Math.min(MOMENTS.length - 1, Math.max(0, s + delta)));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const activity = AI_ACTIVITY[moment.id];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-otto">
              <OttoMark size={20} />
            </span>
            <span className="text-sm font-semibold tracking-tight">CSP on AINPX</span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:inline">
              Future vision · leadership experience
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden text-right text-xs leading-tight text-muted-foreground md:block">
              Maya Chen
              <br />
              <span className="font-mono text-[10px] uppercase tracking-[0.12em]">
                CSM · Strategic Enterprise
              </span>
            </span>
            <button
              type="button"
              onClick={() => setShowActivity((v) => !v)}
              aria-pressed={showActivity}
              className={cn(
                "flex items-center gap-2.5 rounded-full border px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors",
                showActivity
                  ? "border-agent/40 bg-agent-soft text-agent"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "flex h-3 w-6 items-center rounded-full p-0.5 transition-colors",
                  showActivity ? "bg-agent" : "bg-border-strong",
                )}
              >
                <span
                  className={cn(
                    "size-2 rounded-full bg-surface transition-transform",
                    showActivity && "translate-x-3",
                  )}
                />
              </span>
              Show AI activity
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 md:py-20">
        <div
          key={moment.id}
          className={cn("soft-in grid gap-10", showActivity && activity && "lg:grid-cols-[1fr_20rem]")}
        >
          <div className="min-w-0">
            {step === 0 && <MomentStartQuarter />}
            {step === 1 && <MomentSomethingChanged />}
            {step === 2 && <MomentCoordinate />}
            {step === 3 && <MomentPrepare />}
            {step === 4 && <MomentValue />}
            {step === 5 && <MomentArchitecture />}
            {step === 6 && <MomentBeforeAfter />}
          </div>

          {showActivity && activity && (
            <aside className="rise h-fit rounded-2xl border border-agent/30 bg-agent-soft/50 p-5 lg:sticky lg:top-28">
              <span className="eyebrow text-agent">AI activity · behind this moment</span>
              <ul className="mt-4 space-y-3.5">
                {activity.map((a) => {
                  const agent = AGENTS.find((x) => x.key === a.agent)!;
                  return (
                    <li key={agent.key} className="text-sm leading-snug">
                      <span className="flex items-center gap-2 font-medium">
                        <span
                          className="size-1.5 rounded-full bg-agent"
                          style={{ animation: "breathe 3s ease-in-out infinite" }}
                        />
                        {agent.name}
                      </span>
                      <span className="mt-1 block pl-3.5 text-muted-foreground">→ {a.action}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-5 flex gap-2 border-t border-agent/25 pt-4 text-sm">
                <span className="mt-0.5 shrink-0 text-otto">
                  <OttoMark size={14} />
                </span>
                <span>{OVERLAY_SUMMARY[moment.id]}</span>
              </p>
              <p className="mt-4 font-mono text-[10px] uppercase leading-relaxed tracking-[0.1em] text-muted-foreground">
                Leadership explanation view — not the end-user experience.
              </p>
            </aside>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 z-20 border-t border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-3.5">
          <nav className="flex flex-wrap items-center gap-1">
            {MOMENTS.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setStep(i)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-left transition-colors",
                  i === step
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-mono text-[10px] tracking-[0.12em]">
                  {String(m.id).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "ml-2 text-xs",
                    i === step ? "inline" : "hidden lg:inline lg:opacity-70",
                  )}
                >
                  {m.label}
                </span>
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm text-foreground transition-colors hover:border-border-strong disabled:opacity-35"
            >
              <ChevronLeft className="size-4" aria-hidden="true" /> Previous
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={step === MOMENTS.length - 1}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-px disabled:opacity-35"
            >
              Next <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
