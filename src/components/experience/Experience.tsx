import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MOMENTS, MOMENT_STAGES } from "@/lib/story-data";
import {
  AgentChainPanel,
  MomentArchitecture,
  MomentBeforeAfter,
  MomentCoordinate,
  MomentPrepare,
  MomentSomethingChanged,
  MomentStartQuarter,
  MomentValue,
  type Role,
} from "./moments";
import { LeftNav, TopBar } from "./shell";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BREADCRUMBS: Record<number, string[]> = {
  1: ["Home"],
  2: ["Accounts", "Acme Corporation"],
  3: ["Accounts", "Acme Corporation", "Success Plan"],
  4: ["Customer Activity", "Acme Corporation", "Briefing"],
  5: ["Value", "Acme Corporation"],
  6: ["Insights", "Operating model"],
  7: ["Insights", "Today vs. future"],
};

const NAV_ACTIVE: Record<number, string> = {
  1: "Home",
  2: "Accounts",
  3: "Accounts",
  4: "Customer Activity",
  5: "Value",
  6: "Insights",
  7: "Insights",
};

export function Experience() {
  const [step, setStep] = useState(0);
  const [showActivity, setShowActivity] = useState(false);
  const [role, setRole] = useState<Role>("CSM");
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

  const stages = MOMENT_STAGES[moment.id] ?? [];
  const activityAvailable = moment.id >= 2 && moment.id <= 5;

  return (
    <div className="flex min-h-screen bg-background">
      <LeftNav active={NAV_ACTIVE[moment.id]} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          breadcrumb={BREADCRUMBS[moment.id] ?? ["Home"]}
          person={
            role === "CSM"
              ? { name: "Alex Rivera", role: "CSM · Strategic Enterprise" }
              : { name: "Maya Chen", role: "TSM · Technical Success" }
          }
        />

        <main className="flex-1 px-6 pb-32 pt-8 lg:px-10 lg:pt-10">
          <div
            key={`${moment.id}-${role}`}
            className={cn(
              "soft-in mx-auto w-full max-w-[80rem]",
              showActivity && activityAvailable && "grid gap-6 lg:grid-cols-[1fr_19rem]",
            )}
          >
            <div className="min-w-0">
              {step === 0 && <MomentStartQuarter />}
              {step === 1 && <MomentSomethingChanged role={role} />}
              {step === 2 && <MomentCoordinate role={role} />}
              {step === 3 && <MomentPrepare role={role} />}
              {step === 4 && <MomentValue />}
              {step === 5 && <MomentArchitecture />}
              {step === 6 && <MomentBeforeAfter />}
            </div>
            {showActivity && activityAvailable && (
              <aside className="rise h-fit">
                <AgentChainPanel />
              </aside>
            )}
          </div>
        </main>

        {/* Presentation controls — not production navigation */}
        <footer className="fixed bottom-4 left-1/2 z-20 w-[min(72rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-lift backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Q3 Customer Journey
              </span>
              <nav className="flex flex-wrap items-center gap-0.5">
                {MOMENTS.slice(0, 5).map((m, i) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setStep(i)}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-[12px] transition-colors",
                      i === step
                        ? "bg-secondary font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="font-mono text-[10px] tracking-[0.1em]">
                      {String(m.id).padStart(2, "0")}
                    </span>
                    <span className="ml-1.5 hidden xl:inline">{m.label}</span>
                  </button>
                ))}
                {MOMENTS.slice(5).map((m, i) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setStep(i + 5)}
                    className={cn(
                      "rounded-lg px-2.5 py-1.5 text-[12px] transition-colors",
                      step === i + 5
                        ? "bg-primary font-medium text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {m.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {stages.length > 0 && (
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-otto md:inline">
                  Moment {String(moment.id).padStart(2, "0")} · {stages.join(" → ")}
                </span>
              )}

              <div className="flex items-center rounded-lg border border-border p-0.5">
                <span className="px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                  View as
                </span>
                {(["CSM", "TSM"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-[12px] transition-colors",
                      role === r
                        ? "bg-secondary font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowActivity((v) => !v)}
                aria-pressed={showActivity}
                disabled={!activityAvailable}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-[12px] transition-colors disabled:opacity-40",
                  showActivity && activityAvailable
                    ? "border-otto/40 bg-otto-soft text-otto"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                Show AI activity
              </button>

              <button
                type="button"
                onClick={() => go(-1)}
                disabled={step === 0}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-[12px] disabled:opacity-35"
              >
                <ChevronLeft className="size-3.5" aria-hidden="true" /> Previous
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={step === MOMENTS.length - 1}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3.5 py-1.5 text-[12px] font-medium text-primary-foreground disabled:opacity-35"
              >
                Next <ChevronRight className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
