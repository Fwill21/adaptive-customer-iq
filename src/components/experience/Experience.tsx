import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MOMENTS, MOMENT_STAGES } from "@/lib/story-data";
import {
  PATHS,
  QBR_AWARENESS_LABEL,
  QBR_BREADCRUMBS,
  QBR_MOMENTS,
  QBR_MOMENT_STAGES,
  QBR_NAV_ACTIVE,
  type PathId,
} from "@/lib/qbr-data";
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
import {
  QbrActivateNextQuarter,
  QbrAgentChainPanel,
  QbrApproaching,
  QbrBuildStory,
  QbrCaptureOutcomes,
  QbrCloseGaps,
  QbrCoordinate,
  QbrMeetingMode,
  QbrPrepareMe,
} from "./qbr-moments";
import { PathSelector } from "./PathSelector";
import { LeftNav, Surface, TopBar } from "./shell";
import { ActionButton } from "./drawer";
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
  const [path, setPath] = useState<PathId | null>(null);
  const [step, setStep] = useState(0);
  const [showActivity, setShowActivity] = useState(false);
  const [role, setRole] = useState<Role>("CSM");

  const isQbr = path === "qbr";
  const moments = isQbr ? QBR_MOMENTS : MOMENTS;
  const moment = moments[step] ?? moments[0]!;

  const go = useCallback(
    (delta: number) => {
      setStep((s) => Math.min(moments.length - 1, Math.max(0, s + delta)));
    },
    [moments.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const openPath = (p: PathId) => {
    setPath(p);
    setStep(0);
    setRole("CSM");
    setShowActivity(false);
  };

  if (!path) return <PathSelector onSelect={openPath} />;

  const pathMeta = PATHS.find((p) => p.id === path)!;
  const stages = (isQbr ? QBR_MOMENT_STAGES : MOMENT_STAGES)[moment.id] ?? [];
  const activityAvailable = isQbr
    ? moment.id >= 1 && moment.id <= 5
    : moment.id >= 2 && moment.id <= 5;
  const roleAvailable = isQbr ? moment.id === 4 || moment.id === 5 : true;

  return (
    <div className="flex min-h-screen bg-background">
      <LeftNav
        active={(isQbr ? QBR_NAV_ACTIVE : NAV_ACTIVE)[moment.id] ?? "Home"}
        onNavigate={(item) => {
          if (isQbr) {
            const target = QBR_MOMENTS.findIndex((m) => QBR_NAV_ACTIVE[m.id] === item);
            if (target >= 0) setStep(target);
            return;
          }
          const explicit: Record<string, number> = { "Success Plans": 2 };
          const target =
            explicit[item] ?? MOMENTS.findIndex((m) => NAV_ACTIVE[m.id] === item);
          if (target >= 0) setStep(target);
        }}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          breadcrumb={(isQbr ? QBR_BREADCRUMBS : BREADCRUMBS)[moment.id] ?? ["Home"]}
          person={
            role === "CSM"
              ? { name: "Alex Rivera", role: "CSM · Strategic Enterprise" }
              : { name: "Maya Chen", role: "TSM · Technical Success" }
          }
        />

        <main className="flex-1 px-6 pb-32 pt-8 lg:px-10 lg:pt-10">
          <div
            key={`${path}-${moment.id}-${role}`}
            className={cn(
              "soft-in mx-auto w-full max-w-[80rem]",
              showActivity && activityAvailable && "grid gap-6 lg:grid-cols-[1fr_19rem]",
            )}
          >
            <div className="min-w-0 space-y-6">
              {isQbr ? (
                <>
                  {step === 0 && <QbrApproaching />}
                  {step === 1 && <QbrBuildStory />}
                  {step === 2 && <QbrCloseGaps />}
                  {step === 3 && <QbrCoordinate role={role} />}
                  {step === 4 && <QbrPrepareMe role={role} />}
                  {step === 5 && <QbrMeetingMode />}
                  {step === 6 && <QbrCaptureOutcomes />}
                  {step === 7 && (
                    <QbrActivateNextQuarter onContinue={() => openPath("quarter")} />
                  )}
                </>
              ) : (
                <>
                  {step === 0 && <MomentStartQuarter />}
                  {step === 1 && <MomentSomethingChanged role={role} />}
                  {step === 2 && <MomentCoordinate role={role} />}
                  {step === 3 && <MomentPrepare role={role} />}
                  {step === 4 && <MomentValue />}
                  {step === 5 && <MomentArchitecture />}
                  {step === 6 && <MomentBeforeAfter />}
                  {step === 4 && (
                    <Surface className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-[15px] font-semibold">Continue to AI-Native QBR</p>
                        <p className="mt-1 text-[13px] text-muted-foreground">
                          See how this quarter's intelligence becomes the customer value
                          conversation.
                        </p>
                      </div>
                      <ActionButton variant="solid" onClick={() => openPath("qbr")}>
                        Continue to AI-Native QBR
                      </ActionButton>
                    </Surface>
                  )}
                </>
              )}
            </div>
            {showActivity && activityAvailable && (
              <aside className="rise h-fit">
                {isQbr ? <QbrAgentChainPanel /> : <AgentChainPanel />}
              </aside>
            )}
          </div>
        </main>

        {/* Presentation controls — not production navigation */}
        <footer className="fixed bottom-4 left-1/2 z-20 w-[min(80rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-lift backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Demo path
              </span>
              <span className="text-[12px] font-medium">{pathMeta.label}</span>
              <nav className="flex flex-wrap items-center gap-0.5">
                {moments.map((m, i) => (
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
              </nav>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {stages.length > 0 && (
                <span className="hidden font-mono text-[10px] uppercase tracking-[0.12em] text-otto md:inline">
                  {isQbr && QBR_AWARENESS_LABEL[moment.id]
                    ? `${QBR_AWARENESS_LABEL[moment.id]} · `
                    : ""}
                  {stages.join(" → ")}
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
                    disabled={!roleAvailable}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-[12px] transition-colors disabled:opacity-40",
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
                onClick={() => setPath(null)}
                className="rounded-lg border border-border px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Change demo path
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
                disabled={step === moments.length - 1}
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
