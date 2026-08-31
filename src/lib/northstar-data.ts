/**
 * "A Quarter in the Life of a CSM" — Northstar Health.
 *
 * One customer story told twice: Act 1 as it works today (Maya is the
 * connective tissue), Act 2 reimagined on LUX (LUX becomes the integration
 * layer and Maya spends her time on judgment, strategy and outcomes).
 *
 * Maya Alvarez is the scripted CSM persona for this story. Other personas in
 * the app are untouched.
 */

export const MAYA = { name: "Maya Alvarez", role: "CSM · Strategic Enterprise" };

export const NORTHSTAR = {
  name: "Northstar Health",
  segment: "Strategic Enterprise · Healthcare",
  quarter: "Q3 2026",
  outcome:
    "Reduce clinical service request handling time by 30% across three regional networks.",
  outcomeStatus: "Unchanged",
  progress: 58,
  sponsor: "Dr. Renée Okafor, SVP Clinical Operations",
  champion: "Tom Brady-Nwosu, Director of Service Operations",
  nextMoment: "Quarterly Business Review",
  blocker: "Regional data migration dependency (Wave 2)",
};

/* ───────────────────────── demo step model ───────────────────────── */

export type QimStepId =
  | "t1"
  | "t2"
  | "t3"
  | "transition"
  | "l1"
  | "l2"
  | "l3"
  | "l4"
  | "l5"
  | "wrap";

export type QimAct = "today" | "transition" | "lux" | "wrap";

export const QIM_STEPS: {
  id: QimStepId;
  act: QimAct;
  num?: string;
  label: string;
  crumb: string[];
}[] = [
  { id: "t1", act: "today", num: "01", label: "Notice & Investigate", crumb: ["Home", "My portfolio"] },
  { id: "t2", act: "today", num: "02", label: "Build the Story", crumb: ["Home", "Northstar Health", "Working notes"] },
  {
    id: "t3",
    act: "today",
    num: "03",
    label: "Prepare, Lead & Follow Through",
    crumb: ["Home", "Northstar Health", "QBR preparation"],
  },
  { id: "transition", act: "transition", label: "The opportunity", crumb: ["Home", "The opportunity"] },
  { id: "l1", act: "lux", num: "01", label: "What Deserves My Attention?", crumb: ["Home", "Priority signals"] },
  { id: "l2", act: "lux", num: "02", label: "What Is Really Happening?", crumb: ["Home", "Northstar Health", "Outcome"] },
  { id: "l3", act: "lux", num: "03", label: "What Should We Do?", crumb: ["Home", "Northstar Health", "Recommendations"] },
  { id: "l4", act: "lux", num: "04", label: "Prepare & Conduct the QBR", crumb: ["Home", "Northstar Health", "QBR"] },
  { id: "l5", act: "lux", num: "05", label: "Carry the Outcome Forward", crumb: ["Home", "Northstar Health", "Decisions"] },
  { id: "wrap", act: "wrap", label: "The takeaway", crumb: ["Home", "The takeaway"] },
];

export const ACT_LABEL: Record<QimAct, string> = {
  today: "Today",
  transition: "Transition",
  lux: "Reimagined on LUX",
  wrap: "Takeaway",
};

/* ───────────────────────── Act 1 — Today ───────────────────────── */

export type TodaySource = {
  id: string;
  where: string;
  kind: "portfolio" | "chart" | "calendar" | "notes" | "message" | "risk" | "commitment";
  title: string;
  detail: string[];
  stamp: string;
  /** What Maya has to work out for herself once she has opened it. */
  takeaway: string;
};

export const TODAY_SOURCES: TodaySource[] = [
  {
    id: "portfolio",
    where: "Portfolio list",
    kind: "portfolio",
    title: "Northstar Health · health score 71, no flag",
    detail: [
      "Score moved 76 → 71 over five weeks.",
      "No alert threshold was crossed, so nothing was raised.",
      "Renewal is two quarters out.",
    ],
    stamp: "Refreshed nightly",
    takeaway: "Not flagged. Whether it matters is Maya's read.",
  },
  {
    id: "adoption",
    where: "Adoption report",
    kind: "chart",
    title: "Service request automation usage declined",
    detail: [
      "Weekly active use of the priority capability fell 68% → 49%.",
      "Decline concentrated in the two newest regional networks.",
      "Report does not say why.",
    ],
    stamp: "Week 9 of the quarter",
    takeaway: "A real change — but with no cause attached.",
  },
  {
    id: "calendar",
    where: "Calendar",
    kind: "calendar",
    title: "Quarterly Business Review scheduled",
    detail: [
      "QBR with Dr. Okafor and Tom Brady-Nwosu.",
      "Two prior working sessions this quarter.",
      "Sponsor declined the last two invitations.",
    ],
    stamp: "In 4 weeks",
    takeaway: "The clock, and a stakeholder pattern nobody surfaced.",
  },
  {
    id: "notes",
    where: "Customer notes",
    kind: "notes",
    title: "Working session note — Wave 2 migration",
    detail: [
      "\"Wave 2 regional data migration slipped; ops team paused onboarding of the next user group.\"",
      "Written by Maya, never linked to the adoption report.",
    ],
    stamp: "Week 5",
    takeaway: "The likely cause is sitting in a note.",
  },
  {
    id: "internal",
    where: "Internal messages",
    kind: "message",
    title: "Delivery thread — dependency still open",
    detail: [
      "Delivery lead: \"Wave 2 cutover moved again, environment validation still outstanding.\"",
      "Thread is in a channel Maya is not the owner of.",
    ],
    stamp: "Week 8",
    takeaway: "Technical truth lives outside Maya's tooling.",
  },
  {
    id: "commitment",
    where: "Success plan",
    kind: "commitment",
    title: "Open commitment from last quarter",
    detail: [
      "\"Enable regional network 3 super users by end of Q3.\"",
      "Status has not moved since it was written.",
    ],
    stamp: "Carried from Q2",
    takeaway: "A promise still outstanding, unconnected to the rest.",
  },
];

export const TODAY_SCENE2_SOURCES = [
  { where: "Previous QBR deck", note: "Outcome framing and Q2 commitments" },
  { where: "Customer outcomes page", note: "30% handling-time target, unchanged" },
  { where: "Adoption/usage export", note: "Weekly usage by regional network" },
  { where: "Open risks", note: "Migration dependency, no owner in the plan" },
  { where: "Roadmap commitments", note: "Two items promised for Q3" },
  { where: "Stakeholder history", note: "Sponsor engagement down since week 5" },
  { where: "Internal delivery thread", note: "Wave 2 slipped twice" },
];

export const TODAY_SPECIALISTS = [
  {
    name: "Priya Raghavan",
    role: "Migration Specialist",
    lens: "Technical / deployment",
    recommendation:
      "Wave 2 needs environment validation before any new user group onboards. Two-week path if we get the customer's infra window.",
  },
  {
    name: "Dan Whitfield",
    role: "Adoption Consultant",
    lens: "Adoption",
    recommendation:
      "Re-run enablement for networks 1 and 2 now; do not wait for Wave 2. Usage will keep sliding otherwise.",
  },
  {
    name: "Sofia Marchetti",
    role: "Account Executive",
    lens: "Executive / relationship",
    recommendation:
      "The sponsor has gone quiet. Get the outcome conversation back in front of Dr. Okafor before the QBR sets the tone.",
  },
];

export const TODAY_MAYA_STRATEGY = [
  "The outcome is still the right one — 30% handling-time reduction, unchanged.",
  "Adoption is down because the path changed, not because the customer stepped back.",
  "The migration dependency is the constraint we have to name and own.",
  "The QBR should be about the path to the outcome, not an adoption post-mortem.",
];

export const TODAY_DECK_ITEMS = [
  { slide: "Outcome & progress", issue: "Metrics from week 3 — stale", fix: "Re-pull usage and handling time" },
  { slide: "Adoption trend", issue: "Chart ends before the decline", fix: "Rebuild chart to week 9" },
  { slide: "Q2 commitments", issue: "One still open, shown as complete", fix: "Correct status by hand" },
  { slide: "Roadmap", issue: "Two items changed since last quarter", fix: "Reconcile with product update" },
  { slide: "Risks", issue: "Migration dependency missing entirely", fix: "Write new slide" },
  { slide: "Next quarter", issue: "Not drafted", fix: "Draft from working notes" },
];

export const TODAY_FOLLOWUP = [
  "Review meeting notes",
  "Send customer recap",
  "Create internal tasks",
  "Update customer plan",
  "Message delivery + AE",
  "Schedule next working session",
  "Record context for next quarter",
];

export const TODAY_SCATTER = [
  "Meeting notes app",
  "Success plan",
  "Email recap",
  "Task tracker",
  "Slide deck",
  "Internal chat",
  "Maya's memory",
];

/* ───────────────────────── Transition ───────────────────────── */

export const TRANSITION_REVEALS = [
  "What would this quarter look like if the system understood the customer continuously?",
  "What if important change could be recognized as it happened?",
  "What if specialized intelligence could coordinate work around the customer?",
  "What if customer context followed the work?",
  "What if Maya could spend more of her time on strategy, relationships, decisions, and customer outcomes?",
];

/* ───────────────────────── Act 2 — LUX ───────────────────────── */

export const LUX_ACTIVITY: { at: string; text: string; step: QimStepId }[] = [
  { at: "Week 5", text: "New customer signal connected", step: "l1" },
  { at: "Week 6", text: "Dependency evidence refreshed", step: "l1" },
  { at: "Week 7", text: "Stakeholder activity evaluated", step: "l1" },
  { at: "Week 8", text: "Customer context updated", step: "l2" },
  { at: "Week 9", text: "Recommendation refreshed", step: "l3" },
  { at: "Week 10", text: "QBR story updated", step: "l4" },
  { at: "Week 11", text: "Follow-up synchronized", step: "l5" },
];

export const PRIORITY_SIGNAL = {
  headline: "Priority changed",
  support: "Three related changes may affect the customer's path to its outcome.",
  signals: [
    {
      label: "Priority capability adoption declined",
      value: "68% → 49%",
      note: "Concentrated in regional networks 2 and 3",
    },
    {
      label: "Migration dependency remains unresolved",
      value: "Wave 2 · slipped twice",
      note: "Environment validation outstanding",
    },
    {
      label: "Engagement from one key stakeholder decreased",
      value: "Sponsor · 2 sessions missed",
      note: "No executive touch since week 5",
    },
  ],
  outcomeNote: "The customer's primary outcome has not changed.",
  whySurfaced: {
    reasoning: [
      "The three changes share a single time origin: the Wave 2 slip in week 5.",
      "Surfaced because the connected pattern affects the committed outcome — not because the QBR is approaching.",
      "Nothing in the evidence suggests Northstar is stepping away from the initiative.",
    ],
    evidence: [
      "Working session note · week 5",
      "Internal delivery update · week 8",
      "Adoption trend · weeks 1–9",
      "Customer commitment · Q2 QBR",
      "Stakeholder engagement history",
    ],
  },
};

export type EvidenceId =
  | "session-note"
  | "delivery-update"
  | "adoption-trend"
  | "commitment"
  | "timeline";

export const EVIDENCE: Record<
  EvidenceId,
  { label: string; source: string; when: string; body: string[] }
> = {
  "session-note": {
    label: "Working Session Note",
    source: "Customer working session · Maya + Tom Brady-Nwosu",
    when: "Week 5",
    body: [
      "\"Wave 2 regional data migration has slipped. Ops paused onboarding of the next user group until the environment is validated.\"",
      "Customer restated the 30% handling-time goal in the same session.",
    ],
  },
  "delivery-update": {
    label: "Internal Delivery Update",
    source: "Delivery team · Wave 2 cutover",
    when: "Week 8",
    body: [
      "Cutover moved a second time; environment validation outstanding.",
      "Estimated two-week path once the customer's infrastructure window opens.",
    ],
  },
  "adoption-trend": {
    label: "Adoption Trend",
    source: "Usage telemetry · priority capability",
    when: "Weeks 1–9",
    body: [
      "Weekly active use 68% → 49%.",
      "Networks 1 and 2 flat; network 3 never onboarded.",
      "Decline begins the week after the Wave 2 slip.",
    ],
  },
  commitment: {
    label: "Customer Commitment",
    source: "Q2 QBR record",
    when: "Last quarter",
    body: [
      "\"Enable regional network 3 super users by end of Q3.\"",
      "Blocked by the same dependency.",
    ],
  },
  timeline: {
    label: "Timeline Event",
    source: "Northstar customer timeline",
    when: "Week 5 → week 9",
    body: [
      "Wave 2 slip → next user group delayed → adoption decline.",
      "No change recorded to the customer's stated outcome.",
    ],
  },
};

export const ADOPTION_TRAJECTORY = [
  { week: "W1", value: 68 },
  { week: "W3", value: 67 },
  { week: "W5", value: 64 },
  { week: "W7", value: 55 },
  { week: "W9", value: 49 },
];

export const CAUSAL_CHAIN = [
  { title: "Migration dependency", note: "Wave 2 cutover slipped in week 5", evidence: "delivery-update" as EvidenceId },
  { title: "Delayed next user group", note: "Network 3 onboarding paused by ops", evidence: "session-note" as EvidenceId },
  { title: "Adoption decline", note: "Priority capability usage 68% → 49%", evidence: "adoption-trend" as EvidenceId },
];

export const OUTCOME_VIEW = {
  commitments: [
    { text: "Enable regional network 3 super users", status: "Blocked by dependency", owner: "Northstar ops + Delivery" },
    { text: "Handling-time baseline validated with finance", status: "Complete", owner: "Maya + Northstar finance" },
    { text: "Automation playbooks for networks 1–2", status: "On track", owner: "Adoption consultant" },
  ],
  blockers: [
    { text: "Wave 2 regional data migration", severity: "Current blocker" },
    { text: "Network 3 environment validation", severity: "Dependent" },
  ],
  stakeholders: [
    { name: "Dr. Renée Okafor", role: "Sponsor · SVP Clinical Ops", activity: "Down · 2 sessions missed" },
    { name: "Tom Brady-Nwosu", role: "Champion · Service Ops", activity: "Active weekly" },
    { name: "Regional ops leads", role: "Users", activity: "Networks 1–2 active" },
  ],
  internalWork: [
    { text: "Wave 2 cutover validation", owner: "Delivery" },
    { text: "Enablement refresh, networks 1–2", owner: "Adoption" },
    { text: "Renewal narrative alignment", owner: "AE" },
  ],
  moments: [
    { text: "Working session with ops", when: "In 6 days" },
    { text: "Quarterly Business Review", when: "In 4 weeks" },
  ],
};

export type RecStatus = "READY TO PREPARE" | "NEEDS HUMAN JUDGMENT" | "CUSTOMER COMMITMENT";

export const RECOMMENDATIONS: {
  id: string;
  title: string;
  reason: string;
  evidence: EvidenceId[];
  impact: string;
  commitment: string;
  status: RecStatus;
  luxCanPrepare: boolean;
  mayaMustApprove: boolean;
}[] = [
  {
    id: "specialist",
    title: "Bring migration specialist into next customer working session",
    reason: "The dependency, not adoption behaviour, is what is holding the outcome back.",
    evidence: ["delivery-update", "session-note"],
    impact: "Unblocks network 3 onboarding roughly two weeks earlier.",
    commitment: "Enable regional network 3 super users",
    status: "READY TO PREPARE",
    luxCanPrepare: true,
    mayaMustApprove: false,
  },
  {
    id: "milestone",
    title: "Adjust adoption milestone to reflect dependency",
    reason: "The milestone assumes an onboarding date that no longer exists.",
    evidence: ["adoption-trend", "commitment"],
    impact: "Restores a credible plan the customer can hold us to.",
    commitment: "Q3 adoption milestone",
    status: "CUSTOMER COMMITMENT",
    luxCanPrepare: true,
    mayaMustApprove: true,
  },
  {
    id: "framing",
    title:
      "Reframe QBR around the path to the customer outcome rather than an isolated adoption risk",
    reason: "The outcome is unchanged; the path to it is what moved.",
    evidence: ["timeline", "session-note"],
    impact: "Keeps the executive conversation on progress and the plan.",
    commitment: "30% handling-time reduction",
    status: "NEEDS HUMAN JUDGMENT",
    luxCanPrepare: true,
    mayaMustApprove: true,
  },
];

export const ORCHESTRATION_STAGES = [
  "Maya intent",
  "Relevant specialized work activated",
  "Northstar customer context attached",
  "Evidence and actions prepared",
  "Results returned",
];

export const PREPARED_BY_LUX = [
  "Specialist briefing prepared",
  "QBR story updated",
  "Proposed milestone drafted",
  "Customer evidence attached",
];

export const NEEDS_MAYA = [
  "Approve the customer commitment",
  "Validate the QBR framing",
  "Determine whether the milestone should change",
];

export const SPECIALIST_HANDOFF = {
  name: "Priya Raghavan",
  role: "Migration Specialist",
  attached: [
    { label: "Customer", value: "Northstar Health · Strategic Enterprise" },
    { label: "Customer outcome", value: "30% reduction in clinical service request handling time" },
    { label: "Current blocker", value: "Wave 2 regional data migration" },
    { label: "Supporting evidence", value: "Delivery update wk 8 · Session note wk 5 · Adoption trend" },
    { label: "Reason for involvement", value: "Dependency owns the critical path to the outcome" },
    { label: "Upcoming customer moment", value: "Working session in 6 days · QBR in 4 weeks" },
    { label: "Current recommendation", value: "Join the working session and commit a validation window" },
  ],
  reply:
    "Got it — I can commit a two-week validation path if Northstar opens the infra window at the working session. I'll bring the cutover checklist.",
};

/* ── QBR story & artifact ── */

export type StorySectionId = "achieved" | "progress" | "changed" | "dependency" | "commitments" | "next";

export const QBR_STORY: {
  id: StorySectionId;
  heading: string;
  body: string;
  evidence: EvidenceId[];
  incomplete?: boolean;
}[] = [
  {
    id: "progress",
    heading: "Outcome progress",
    body: "Northstar has realised an estimated 17% reduction in clinical service request handling time against a 30% commitment.",
    evidence: ["commitment"],
  },
  {
    id: "achieved",
    heading: "What Northstar accomplished this quarter",
    body: "Networks 1 and 2 moved fully onto automated request routing, and the finance-validated handling-time baseline was agreed.",
    evidence: ["adoption-trend"],
  },
  {
    id: "changed",
    heading: "Why progress slowed",
    body: "Adoption of the priority capability fell from 68% to 49% after the Wave 2 migration slip delayed the next user group.",
    evidence: ["adoption-trend", "timeline"],
  },
  {
    id: "dependency",
    heading: "The migration dependency",
    body: "Wave 2 cutover has moved twice; environment validation is the remaining step before network 3 onboards.",
    evidence: ["delivery-update"],
  },
  {
    id: "commitments",
    heading: "Regional rollout cost avoidance",
    body: "Regional rollout is estimated to avoid $1.4M in annual contractor spend across all three networks.",
    evidence: [],
    incomplete: true,
  },
  {
    id: "next",
    heading: "Sponsor satisfaction improved this quarter",
    body: "Executive sentiment is trending positive based on partial survey response.",
    evidence: [],
    incomplete: true,
  },
];

export const QBR_ARTIFACT_SLIDES = [
  "Outcome & progress",
  "What you accomplished",
  "Why progress slowed",
  "The dependency and the plan",
  "Commitments & owners",
  "Next quarter direction",
];

export const CUSTOMER_LINE =
  "We're not sure adoption is the real issue. The migration dependency has been the bigger constraint.";

export const MAYA_MEETING_LINE =
  "I agree. Let's treat adoption as an effect, not the root problem. We'll keep the outcome, address the dependency, and revisit the adoption milestone together once that work moves.";

/* ── Decisions & follow-through ── */

export type DecisionState = "Captured" | "Prepared" | "Pending Approval" | "Synchronized";

export const QBR_DECISIONS: {
  id: string;
  text: string;
  state: DecisionState;
  needsMaya?: boolean;
}[] = [
  { id: "d1", text: "Keep customer outcome unchanged", state: "Synchronized" },
  { id: "d2", text: "Treat migration dependency as current priority", state: "Prepared" },
  {
    id: "d3",
    text: "Keep adoption milestone proposed until dependency progresses",
    state: "Pending Approval",
    needsMaya: true,
  },
  { id: "d4", text: "Add migration specialist to next customer working session", state: "Captured" },
];

export const PROPOSED_MILESTONE = {
  title: "Revised adoption milestone",
  wording:
    "Network 3 super users enabled within three weeks of Wave 2 environment validation, with 65% priority-capability adoption across all networks by end of Q4.",
  owner: "Maya Alvarez (ServiceNow) + Tom Brady-Nwosu (Northstar)",
  timing: "Dependent on Wave 2 validation window · review at next working session",
  commitment: "Affects the Q3 adoption commitment recorded at the Q2 QBR",
};

export const SYNC_TARGETS = [
  "Customer Plan",
  "Internal Actions",
  "Next Working Session",
  "QBR Decisions",
  "Customer Context",
];

/* ── Ledger (Act 2 only) ── */

export const LEDGER: Record<
  "l1" | "l2" | "l3" | "l4" | "l5",
  { less: string; more: string; human: string }
> = {
  l1: {
    less: "Portfolio scanning and manual prioritization",
    more: "Reviewing the reasoning behind a recommendation and deciding whether to act",
    human: "Maya determines whether Northstar actually deserves attention",
  },
  l2: {
    less: "Reconstructing customer context",
    more: "Understanding cause, consequence, and customer meaning",
    human: "Maya validates whether the synthesized explanation matches what she knows about the customer",
  },
  l3: {
    less: "Finding people, transferring context, coordinating routine actions",
    more: "Selecting the right strategy and navigating customer commitments",
    human: "Maya determines when human expertise must reshape or override the recommendation",
  },
  l4: {
    less: "QBR production and manual reconstruction",
    more: "Customer strategy and facilitation",
    human: "Maya owns what ServiceNow says to the customer and how the strategy changes in the room",
  },
  l5: {
    less: "Follow-up administration and rebuilding context later",
    more: "Keeping the customer moving toward the desired outcome",
    human: "Maya approves meaningful changes to customer commitments and strategy",
  },
};

/* ── Otto script per Act 2 moment ── */

export const NS_OTTO: Record<
  QimStepId,
  { lines: string[]; steps?: string[]; sources?: string[]; prompts: string[] }
> = {
  t1: {
    lines: ["Otto is not part of the story yet — this is how the quarter works today."],
    prompts: ["What is Maya doing here?"],
  },
  t2: {
    lines: ["Today Maya is the integration layer between systems, people and artifacts."],
    prompts: ["Why is this expensive?"],
  },
  t3: {
    lines: ["The work succeeds. Maya is what keeps it coherent."],
    prompts: ["What does this cost the customer?"],
  },
  transition: {
    lines: ["The opportunity is bigger than automating the QBR deck."],
    prompts: ["What changes on LUX?"],
  },
  l1: {
    lines: [
      "Northstar moved to the top of your attention list. The QBR is approaching, but that is not why I surfaced it.",
      "Three changes appear connected. I've assembled the evidence if you want to review why.",
    ],
    steps: [
      "Watched committed outcomes rather than activity volume",
      "Connected three changes sharing one time origin",
      "Confirmed the customer's stated outcome is unchanged",
    ],
    sources: ["Adoption telemetry", "Delivery updates", "Q2 QBR commitments", "Stakeholder activity"],
    prompts: ["Why surfaced?", "Is the outcome still healthy?", "Show the evidence"],
  },
  l2: {
    lines: [
      "The adoption decline started after the migration dependency moved off schedule.",
      "The customer goal is unchanged, and the current evidence does not suggest they are abandoning the initiative.",
    ],
    steps: [
      "Aligned the usage decline with the Wave 2 slip",
      "Traced the paused onboarding of network 3",
      "Compared customer statements with internal delivery updates",
    ],
    sources: ["Working session note wk 5", "Delivery update wk 8", "Adoption trend", "Customer timeline"],
    prompts: ["Is this a product or adoption issue?", "Show dependency timeline", "What does the customer think?"],
  },
  l3: {
    lines: [
      "Three options. I can prepare all of them, but two change something the customer is holding us to.",
      "Reorder them however you read the situation — your priority becomes the plan.",
    ],
    steps: [
      "Ranked options by effect on the committed outcome",
      "Separated what I can prepare from what needs your approval",
      "Drafted a specialist brief in case you choose to bring expertise in",
    ],
    sources: ["Dependency forecast", "Customer commitments", "Enablement history"],
    prompts: ["What is the risk of waiting?", "Who should own the fix?", "Why this order?"],
  },
  l4: {
    lines: [
      "The QBR story is ready for your review. It has been assembling all quarter, not since last week.",
      "Two claims do not have complete evidence — I've held them out of the customer-facing version.",
    ],
    steps: [
      "Assembled the story from the quarter's decisions and evidence",
      "Flagged claims with incomplete customer data",
      "Kept every section linked to its source",
    ],
    sources: ["Quarter timeline", "Value model", "Your recommendations"],
    prompts: ["Which claims are weak?", "Show dependency timeline", "Why this opening?"],
  },
  l5: {
    lines: [
      "Four decisions came out of the meeting. Three are already moving; one changes a customer commitment, so it's yours.",
    ],
    steps: [
      "Captured decisions and their rationale from the meeting",
      "Prepared the recap, internal follow-up and next-session context",
      "Held the milestone change for your approval",
    ],
    sources: ["QBR decisions", "Customer plan", "Working session agenda"],
    prompts: ["What is still open?", "What happens next quarter?", "Show the customer plan"],
  },
  wrap: {
    lines: ["This is not simply a faster QBR. It is a different operating model for Customer Success."],
    prompts: ["Summarize the change"],
  },
};

/** Otto's answer to prompts and typed questions inside the Northstar story. */
export function nsReply(q: string): string[] {
  const s = q.toLowerCase();
  if (s.includes("why surfaced") || s.includes("why northstar"))
    return PRIORITY_SIGNAL.whySurfaced.reasoning;
  if (s.includes("outcome") && s.includes("healthy"))
    return [
      "Yes. The 30% handling-time target is unchanged and the customer restated it in the week 5 session.",
      "What moved is the path: the Wave 2 dependency delayed the next user group.",
    ];
  if (s.includes("product") || s.includes("adoption issue"))
    return [
      "Primarily a dependency issue. Network 3 never onboarded, and networks 1–2 are flat rather than falling.",
      "There is an enablement component, but fixing enablement alone will not recover the outcome.",
    ];
  if (s.includes("dependency timeline"))
    return [
      "Week 5: Wave 2 slips and ops pauses onboarding. Week 8: cutover moves again, validation outstanding.",
      "Two-week path to validation once Northstar opens the infrastructure window.",
    ];
  if (s.includes("risk of waiting") || s.includes("wait"))
    return [
      "Waiting through the QBR means presenting a plan the customer already knows is stale.",
      "Realised saving lands near 18% against a 30% commitment if network 3 stays unonboarded.",
    ];
  if (s.includes("own") || s.includes("who"))
    return [
      "Priya Raghavan owns the Wave 2 validation path, so the date is hers to commit.",
      "You own the customer commitment that depends on it.",
    ];
  if (s.includes("weak") || s.includes("claims"))
    return [
      "The $1.4M cost avoidance and the sponsor satisfaction claim both rest on partial customer data.",
      "I've marked them evidence incomplete and excluded them from the customer-facing version.",
    ];
  if (s.includes("customer think") || s.includes("customer say"))
    return [
      "Tom has consistently framed this as a sequencing problem, not a value problem.",
      "The sponsor has been quiet, which is a relationship signal rather than an outcome signal.",
    ];
  if (s.includes("next") || s.includes("still open"))
    return [
      "The revised adoption milestone is waiting on you. Everything else is synchronized.",
      "I'll keep watching the Wave 2 dependency and bring Northstar back into focus if it changes the outcome plan.",
    ];
  if (s.includes("integration") || s.includes("summarize"))
    return [
      "Today the CSM is the integration layer. On LUX, LUX is.",
      "Maya's time moves to judgment, strategy, relationships and customer outcomes.",
    ];
  return [
    "Here is what I can establish from the Northstar context we're working in.",
    "The outcome is unchanged; the Wave 2 dependency is the constraint on the path to it.",
  ];
}

/* ───────────── Inspectable reasoning: "why surfaced" trails ─────────────
 * Every AI conclusion in Act 2 — Otto's guidance and each specialist agent's
 * output — can be opened to show which agent concluded it, what it read, how
 * it reasoned, what it ruled out, and the underlying evidence.
 */

export type TrailId =
  | "priority-signal"
  | "causal-chain"
  | "recommendations"
  | "qbr-story"
  | "carry-forward";

export type WhyTrailData = {
  conclusion: string;
  agent: string;
  confidence: string;
  inputs: { label: string; detail: string }[];
  reasoning: string[];
  ruledOut: string[];
  evidence: EvidenceId[];
};

export const WHY_TRAILS: Record<TrailId, WhyTrailData> = {
  "priority-signal": {
    conclusion: "Northstar Health deserves attention before the QBR.",
    agent: "Otto · orchestrator, with Adoption and Deployment agents",
    confidence: "High — three independent sources agree on the same origin week",
    inputs: [
      { label: "Usage telemetry", detail: "Priority capability, weeks 1–9, per regional network" },
      { label: "Delivery record", detail: "Wave 2 cutover history and validation status" },
      { label: "Customer record", detail: "Q2 QBR commitments and stated outcome" },
      { label: "Engagement history", detail: "Sponsor and super-user session attendance" },
    ],
    reasoning: [
      "Adoption fell 68% → 49%, and the decline starts the week after the Wave 2 slip.",
      "The three changes share one time origin, so they are treated as one pattern, not three alerts.",
      "The pattern touches a committed outcome, which is why it is surfaced now.",
      "Priority is not driven by the QBR date — the same signal would surface without a meeting.",
    ],
    ruledOut: [
      "Seasonal usage dip — network 1 and 2 volumes are flat, not seasonal.",
      "Customer disengagement — the outcome was restated in the week 5 session.",
      "Licence or access fault — no entitlement or error signals in the window.",
    ],
    evidence: ["adoption-trend", "delivery-update", "session-note", "commitment"],
  },
  "causal-chain": {
    conclusion: "Adoption is an effect. The Wave 2 dependency is the root cause.",
    agent: "Deployment agent, reviewed by the Adoption agent",
    confidence: "High — sequence confirmed in delivery and customer records",
    inputs: [
      { label: "Cutover timeline", detail: "Two Wave 2 slips, week 5 and week 8" },
      { label: "Onboarding queue", detail: "Network 3 super users never enabled" },
      { label: "Adoption curve", detail: "Weekly active use by network" },
    ],
    reasoning: [
      "Onboarding of the next user group paused when the environment failed validation.",
      "The adoption curve bends one week after that pause, in the paused networks only.",
      "Networks already onboarded held steady, which separates cause from effect.",
    ],
    ruledOut: [
      "Capability fit — satisfaction and task completion held for onboarded users.",
      "Training gap — enabled cohorts show no drop after enablement.",
    ],
    evidence: ["timeline", "delivery-update", "adoption-trend"],
  },
  recommendations: {
    conclusion: "Unblock the dependency first; the milestone change stays a proposal.",
    agent: "Value agent, with Deployment and Adoption inputs",
    confidence: "Medium — impact modelled, customer position not yet confirmed",
    inputs: [
      { label: "Root cause", detail: "Wave 2 environment validation outstanding" },
      { label: "Commitment ledger", detail: "Network 3 super users by end of Q3" },
      { label: "Comparable accounts", detail: "Recovery pattern after similar dependency clears" },
    ],
    reasoning: [
      "Adoption work before the dependency clears would move the effect, not the cause.",
      "Specialist involvement is ranked first because it shortens the blocking path.",
      "A milestone date change touches a customer commitment, so it cannot be applied by the system.",
    ],
    ruledOut: [
      "Launching an adoption campaign now — the paused networks cannot act on it.",
      "Silently re-dating the commitment — that is Maya's decision with the customer.",
    ],
    evidence: ["delivery-update", "commitment", "adoption-trend"],
  },
  "qbr-story": {
    conclusion: "Open with what was achieved, then explain the dependency honestly.",
    agent: "Value agent, narrative assembly",
    confidence: "Medium — framing is Maya's to edit",
    inputs: [
      { label: "Quarter of decisions", detail: "Working sessions, delivery updates, commitments" },
      { label: "Outcome progress", detail: "17% handling-time reduction of a 30% target" },
      { label: "Customer language", detail: "Phrases the sponsor used in her own sessions" },
    ],
    reasoning: [
      "Achievement first, because progress against the outcome is real and verifiable.",
      "The slowdown is explained by cause rather than symptom, so the customer hears one story.",
      "Every section carries its evidence, so nothing in the deck is unsourced.",
    ],
    ruledOut: [
      "Leading with the adoption number — it reads as a customer failure, not a dependency.",
      "Omitting the slip — the customer already knows and would lose trust.",
    ],
    evidence: ["commitment", "session-note", "timeline"],
  },
  "carry-forward": {
    conclusion: "The commitment change propagates only after Maya approves it.",
    agent: "Otto · orchestrator, continuity",
    confidence: "High — synchronization targets are deterministic",
    inputs: [
      { label: "Captured decision", detail: "Milestone moved after the customer conversation" },
      { label: "Downstream records", detail: "Success plan, delivery plan, account team, next QBR" },
    ],
    reasoning: [
      "The decision was captured in the customer conversation, with its own evidence.",
      "Each target is updated from that single record, so no one re-enters it by hand.",
      "Nothing synchronizes while the decision is still pending approval.",
    ],
    ruledOut: [
      "Auto-applying the new date at capture time — it is a customer commitment.",
    ],
    evidence: ["commitment", "session-note"],
  },
};

/** Which trail sits behind Otto's guidance at each LUX moment. */
export const NS_OTTO_TRAIL: Partial<Record<QimStepId, TrailId>> = {
  l1: "priority-signal",
  l2: "causal-chain",
  l3: "recommendations",
  l4: "qbr-story",
  l5: "carry-forward",
};

/** Proactive notification — LUX pulls Maya in before she navigates to Northstar. */
export const NORTHSTAR_ALERT = {
  agent: "Otto · priority signal",
  at: "Just now · while Maya works another account",
  headline: "Northstar Health needs attention before the QBR",
  support:
    "Three related changes may affect Northstar's path to its committed outcome. The outcome itself has not changed.",
  bullets: [
    "Adoption 68% → 49% in the paused regional networks",
    "Wave 2 dependency unresolved, slipped twice",
    "Sponsor engagement down since week 5",
  ],
  trail: "priority-signal" as TrailId,
  open: "Open Northstar workspace",
  later: "Not now",
};
