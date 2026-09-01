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
import { SearchResultPanel, Surface, TopBar } from "./shell";
import { GlobalRail, OttoPanel, type OttoTurn } from "./lux";
import { AdaptiveExperience } from "./AdaptiveExperience";
import { QuarterInMotion } from "./QuarterInMotion";
import {
  CustomerRecordProvider,
  useRecordAccountProfile,
} from "@/lib/customer-record";
import { ottoReply } from "@/lib/adaptive-data";
import type { SearchDest, SearchResultData } from "@/lib/search-data";
import {
  ACCOUNT_PROFILES,
  AccountProvider,
  personalizeData,
  personalizeText,
  type AccountId,
} from "@/lib/account-context";
import { ActionButton } from "./drawer";
import {
  ConversationalWorkspace,
  HybridStrip,
  ModeSequenceDemo,
  ModesOverview,
  OperatingModelClosing,
  SameIntelligenceView,
  UiDrivenNote,
  WorkModeControl,
  scriptFor,
} from "./modes";
import { MODES_MOMENTS, MODE_CONTEXT_LINE, type ModeId } from "@/lib/mode-data";
import { ChevronLeft, ChevronRight, ChevronsDown, SlidersHorizontal } from "lucide-react";

const BREADCRUMBS: Record<number, string[]> = {
  1: ["Home"],
  2: ["Accounts", "@account"],
  3: ["Accounts", "@account", "Success Plan"],
  4: ["Customer Activity", "@account", "Briefing"],
  5: ["Value", "@account"],
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
  return (
    <CustomerRecordProvider>
      <ExperienceInner />
    </CustomerRecordProvider>
  );
}

function ExperienceInner() {
  const [path, setPath] = useState<PathId | null>("adaptive");
  const [step, setStep] = useState(0);
  const [showActivity, setShowActivity] = useState(false);
  // Presenter panel visibility — collapsible so the story can fill the screen.
  const [showPanel, setShowPanel] = useState(true);
  const [role, setRole] = useState<Role>("CSM");
  // Work mode is how the person interacts. Hybrid best shows the future state.
  const [mode, setMode] = useState<ModeId>("hybrid");
  // The last search Otto answered — every suggestion and custom query lands
  // its own destination and its own result payload on the page.
  const [searchResult, setSearchResult] = useState<SearchResultData | null>(null);
  // The account in focus. Search sets it, and every stage of the path then
  // renders its metrics, evidence, owners and narrative.
  // The real customer record is the default account in focus; search can pivot
  // to another portfolio account.
  const [account, setAccount] = useState<AccountId>("northstar");
  const recordProfile = useRecordAccountProfile();
  const profile =
    account === "northstar"
      ? recordProfile ?? ACCOUNT_PROFILES.northstar
      : ACCOUNT_PROFILES[account];

  const applySearch = (payload: {
    dest: SearchDest;
    account: AccountId | undefined;
    result: SearchResultData;
  }) => {
    if (payload.account) setAccount(payload.account);
    setPath(payload.dest.path as PathId);
    setStep(payload.dest.step);
    setShowActivity(false);
    setSearchResult(payload.result);
  };

  const isQbr = path === "qbr";
  const isModes = path === "modes";
  const moments = isModes ? MODES_MOMENTS : isQbr ? QBR_MOMENTS : MOMENTS;
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

  // Every page's breadcrumb starts at Home so the header always offers a way back.
  const withHome = (crumbs: string[]) => {
    const named = crumbs.map((c) =>
      c === "@account" ? profile.name : personalizeText(c, profile),
    );
    return named[0] === "Home" ? named : ["Home", ...named];
  };

  const openPath = (p: PathId) => {
    setSearchResult(null);
    setPath(p);
    setStep(0);
    setRole("CSM");
    setShowActivity(false);
    // Mode is deliberately preserved across paths and steps — switching never
    // resets account, role or workflow context.
  };

  // From the path selector, any nav or breadcrumb item enters the primary
  // Quarter in Motion path at the closest matching moment.
  const navigateFromSelector = (item: string) => {
    setSearchResult(null);
    if (item === "Home" || item === "Customer Success" || item === "Explore the future") {
      setPath("quarter");
      setStep(0);
      return;
    }
    const explicit: Record<string, number> = { "Success Plans": 2, Meetings: 3 };
    const target = explicit[item] ?? MOMENTS.findIndex((m) => NAV_ACTIVE[m.id] === item);
    setPath("quarter");
    setStep(target >= 0 ? target : 0);
  };

  if (path === "quarter")
    return (
      <AccountProvider account={account} profile={profile}>
        <QuarterInMotion
          onChangePath={() => setPath(null)}
          onQbrPath={() => setPath("qbr")}
        />
      </AccountProvider>
    );

  if (path === "adaptive")
    return (
      <AccountProvider account={account} profile={profile}>
        <AdaptiveExperience
          person={{ name: "Maya Alvarez", role: "CSM · Strategic Enterprise" }}
          mode={mode}
          onChangePath={() => setPath(null)}
        />
      </AccountProvider>
    );


  if (!path)
    return (
      <AccountProvider account={account} profile={profile}>
      <div className="flex min-h-screen bg-background">
        <GlobalRail
          active="Home"
          person={{ name: "Maya Alvarez", role: "CSM · Strategic Enterprise" }}
          onSelect={navigateFromSelector}
        />
        <PathOtto
          contextLine="Choose a demo path · Strategic Enterprise portfolio"
          intro={[
            "Every path runs inside the same LUX environment: global rail, persistent Otto guidance, adaptive canvas.",
            "The Adaptive Experience is the clearest expression of the future state.",
          ]}
          prompts={["Which path shows the future best?", "What changes for the CSM?"]}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            breadcrumb={["Home", "Explore the future"]}
            onBreadcrumb={navigateFromSelector}
            onSearch={applySearch}
            person={{ name: "Alex Rivera", role: "CSM · Strategic Enterprise" }}
          />
          <PathSelector onSelect={openPath} />
        </div>
      </div>
      </AccountProvider>
    );

  const pathMeta = PATHS.find((p) => p.id === path)!;
  const stages = isModes ? [] : (isQbr ? QBR_MOMENT_STAGES : MOMENT_STAGES)[moment.id] ?? [];
  const activityAvailable = isModes
    ? false
    : isQbr
      ? moment.id >= 1 && moment.id <= 5
      : moment.id >= 2 && moment.id <= 5;
  const roleAvailable = isModes ? false : isQbr ? moment.id === 4 || moment.id === 5 : true;
  const rawScript = isModes ? undefined : scriptFor(path, moment.id);
  const script = rawScript ? personalizeData(rawScript, profile) : undefined;
  const contextLine = personalizeText(
    MODE_CONTEXT_LINE[`${path}-${moment.id}`] ?? "Acme Corporation · Q3",
    profile,
  );
  const conversationalOnly = !isModes && mode === "conversational" && !!script;

  const navigate = (item: string) => {
    setSearchResult(null);
    // Home and Insights are global anchors: they always resolve, whichever
    // path the presenter is currently in.
    if (item === "Home" || item === "Customer Success") {
      setPath("quarter" as PathId);
      setStep(0);
      return;
    }
    if (item === "Insights") {
      setPath("quarter" as PathId);
      setStep(MOMENTS.findIndex((m) => m.id === 6));
      return;
    }

    if (isQbr) {
      const target = QBR_MOMENTS.findIndex((m) => QBR_NAV_ACTIVE[m.id] === item);
      if (target >= 0) {
        setStep(target);
        return;
      }
    }
    // Fall back to the Quarter in Motion map so no nav item is ever a dead end.
    const explicit: Record<string, number> = { "Success Plans": 2, Meetings: 3 };
    const target = explicit[item] ?? MOMENTS.findIndex((m) => NAV_ACTIVE[m.id] === item);
    if (target >= 0) {
      setPath("quarter" as PathId);
      setStep(target);
    }
  };


  return (
    <AccountProvider account={account} profile={profile}>
    <div className="flex min-h-screen bg-background">
      <GlobalRail
        active="CSP"
        person={
          role === "CSM"
            ? { name: profile.csm.split(" · ")[0]!, role: "CSM · Strategic Enterprise" }
            : { name: profile.tsm.split(" · ")[0]!, role: "TSM · Technical Success" }
        }
        onSelect={(k) => {
          if (k === "Home") navigate("Home");
          if (k === "Workspace") navigate("Accounts");
          if (k === "Files") navigate("Success Plans");
          if (k === "CSP") navigate("Customer Success");
        }}
      />

      <PathOtto
        key={`${path}-${moment.id}-${role}`}
        contextLine={`${profile.name} · ${moment.label} · ${role}`}
        intro={[
          `You are in ${pathMeta.label}, at "${moment.label}".`,
          "I keep the context — customer, commitments, decisions — while the canvas on the right changes around the work.",
        ]}
        prompts={["Why does this matter now?", "What should I do next?", "Show the evidence"]}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          breadcrumb={withHome(
            isModes
              ? ["Insights", "Three ways to work"]
              : (isQbr ? QBR_BREADCRUMBS : BREADCRUMBS)[moment.id] ?? ["Home"],
          )}
          onBreadcrumb={navigate}
          onSearch={applySearch}
          person={
            role === "CSM"
              ? { name: profile.csm.split(" · ")[0]!, role: "CSM · Strategic Enterprise" }
              : { name: profile.tsm.split(" · ")[0]!, role: "TSM · Technical Success" }
          }
        />


        <main className="flex-1 px-6 pb-32 pt-8 lg:px-10 lg:pt-10">
          <div
            key={`${path}-${moment.id}-${role}-${mode}-${account}-${searchResult?.query ?? ""}`}
            className={cn(
              "soft-in mx-auto w-full max-w-[80rem]",
              showActivity && activityAvailable && "grid gap-6 lg:grid-cols-[1fr_19rem]",
            )}
          >
            <div className="min-w-0 space-y-6">
              {searchResult && (
                <SearchResultPanel
                  result={searchResult}
                  onDismiss={() => setSearchResult(null)}
                />
              )}
              {script && mode === "ui" && (
                <UiDrivenNote script={script} contextLine={contextLine} />
              )}
              {script && mode === "hybrid" && (
                <HybridStrip script={script} contextLine={contextLine} />
              )}

              {conversationalOnly && script ? (
                <ConversationalWorkspace
                  script={script}
                  contextLine={contextLine}
                  momentLabel={moment.label}
                  role={role}
                />
              ) : isModes ? (
                <>
                  {step === 0 && <ModesOverview mode={mode} onSetMode={setMode} />}
                  {step === 1 && <ModeSequenceDemo onSetMode={setMode} />}
                  {step === 2 && <SameIntelligenceView />}
                  {step === 3 && <OperatingModelClosing />}
                  {step === 3 && (
                    <Surface className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-[15px] font-semibold">See the modes in a real story</p>
                        <p className="mt-1 text-[13px] text-muted-foreground">
                          Run Quarter in Motion or the AI-Native QBR in any work mode.
                        </p>
                      </div>
                      <ActionButton variant="solid" onClick={() => openPath("quarter")}>
                        Open Quarter in Motion
                      </ActionButton>
                    </Surface>
                  )}
                </>
              ) : isQbr ? (
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
        {!showPanel && (
          <button
            type="button"
            onClick={() => setShowPanel(true)}
            className="fixed bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-xl border border-border bg-surface/95 px-3 py-2 text-[12px] text-muted-foreground shadow-lift backdrop-blur transition-colors hover:text-foreground"
          >
            <SlidersHorizontal className="size-3.5" aria-hidden="true" /> Show demo path
          </button>
        )}
        <footer
          className={cn(
            "fixed bottom-4 left-1/2 z-20 w-[min(80rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-lift backdrop-blur",
            !showPanel && "hidden",
          )}
        >
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              <button
                type="button"
                onClick={() => setShowPanel(false)}
                aria-label="Hide demo path panel"
                className="rounded-lg border border-border p-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronsDown className="size-3.5" aria-hidden="true" />
              </button>
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

              <WorkModeControl mode={mode} onChange={setMode} disabled={isModes} />


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
    </AccountProvider>
  );
}


/** Layer 2 for the scripted paths: persistent Otto guidance beside the rail. */
function PathOtto({
  contextLine,
  intro,
  prompts,
}: {
  contextLine: string;
  intro: string[];
  prompts: string[];
}) {
  const base: OttoTurn[] = [
    {
      kind: "otto",
      lines: intro,
      steps: [
        "Held the customer, role and quarter context across the whole session",
        "Selected guidance for the current moment only",
      ],
      sources: ["Customer thread", "Success plan", "Live signals"],
    },
  ];
  const [turns, setTurns] = useState<OttoTurn[]>(base);

  return (
    <OttoPanel
      turns={turns}
      prompts={prompts}
      contextLine={contextLine}
      onCompose={() => setTurns(base)}
      onAsk={(q) =>
        setTurns((prev) => [
          ...prev,
          { kind: "user", text: q },
          { kind: "otto", lines: ottoReply(q), sources: ["Live signals", "Customer thread"] },
        ])
      }
    />
  );
}
