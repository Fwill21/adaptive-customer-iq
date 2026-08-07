export type AgentKey =
  | "health"
  | "adoption"
  | "risk"
  | "opportunity"
  | "planning"
  | "meeting"
  | "context"
  | "support"
  | "value"
  | "coordination";

export const AGENTS: { key: AgentKey; name: string; domain: string }[] = [
  { key: "health", name: "Customer Health Agent", domain: "Health signals" },
  { key: "adoption", name: "Adoption Agent", domain: "Product usage" },
  { key: "risk", name: "Risk Agent", domain: "Milestone exposure" },
  { key: "opportunity", name: "Opportunity Agent", domain: "Expansion signals" },
  { key: "planning", name: "Success Planning Agent", domain: "Plans & goals" },
  { key: "meeting", name: "Meeting Intelligence Agent", domain: "Meetings & outcomes" },
  { key: "context", name: "Customer Context Agent", domain: "Account continuity" },
  { key: "support", name: "Support Intelligence Agent", domain: "Cases & escalations" },
  { key: "value", name: "Value Realization Agent", domain: "Outcomes & ROI" },
  { key: "coordination", name: "Coordination Agent", domain: "Cross-role handoffs" },
];

export const ROLES = ["CSM", "TSM", "AE", "Support", "Services", "BPC", "Renewals"];

export const MOMENTS = [
  { id: 1, label: "Start My Quarter" },
  { id: 2, label: "Something Changed" },
  { id: 3, label: "Coordinate Response" },
  { id: 4, label: "Prepare for Customer" },
  { id: 5, label: "Show the Value" },
  { id: 6, label: "The Architecture" },
  { id: 7, label: "Today vs. Future" },
];

export const ACCOUNTS = [
  {
    name: "Acme Corporation",
    signal: "Adoption slowed 18% in the primary deployment group",
    why: "Q3 milestone “Global rollout wave 2” may slip",
    horizon: "Executive check-in in 4 days",
    agents: ["adoption", "health", "risk", "context"] as AgentKey[],
    priority: "Highest",
  },
  {
    name: "Globex Industries",
    signal: "New executive sponsor identified in ITSM org",
    why: "Relationship map and success plan need re-alignment",
    horizon: "Introduction window closes this week",
    agents: ["context", "opportunity", "planning"] as AgentKey[],
    priority: "High",
  },
  {
    name: "Contoso Group",
    signal: "Approaching success milestone: 5,000 active agents",
    why: "Value moment worth capturing with the sponsor",
    horizon: "Milestone expected in 9 days",
    agents: ["value", "planning", "adoption"] as AgentKey[],
    priority: "Moderate",
  },
];

export const AI_ACTIVITY: Record<number, { agent: AgentKey; action: string }[]> = {
  1: [
    { agent: "context", action: "assembled portfolio context across 6 accounts" },
    { agent: "adoption", action: "compared 21-day usage trends per deployment group" },
    { agent: "planning", action: "matched quarter goals to open milestones" },
    { agent: "risk", action: "ranked accounts by milestone exposure" },
  ],
  2: [
    { agent: "adoption", action: "detected 18% usage decline, wave-2 group" },
    { agent: "health", action: "detected health change from A– to B" },
    { agent: "support", action: "correlated 3 cases with a config change" },
    { agent: "risk", action: "evaluated milestone impact: 2-week slip likely" },
    { agent: "context", action: "linked change window to release 24.3 config" },
  ],
  3: [
    { agent: "coordination", action: "prepared TSM investigation with full context" },
    { agent: "opportunity", action: "flagged expansion exposure for the AE" },
    { agent: "planning", action: "drafted adoption recovery plan" },
    { agent: "meeting", action: "reserved pre-read for the customer meeting" },
  ],
  4: [
    { agent: "meeting", action: "generated decision-first briefing" },
    { agent: "support", action: "summarised remediation path from TSM findings" },
    { agent: "risk", action: "quantified timeline risk and mitigation" },
    { agent: "context", action: "surfaced stakeholder history and commitments" },
  ],
  5: [
    { agent: "value", action: "assembled outcomes against stated customer goals" },
    { agent: "adoption", action: "quantified recovery: +34% vs. trough" },
    { agent: "planning", action: "mapped milestone completion to the success plan" },
    { agent: "meeting", action: "reconciled 3 monitored commitments" },
  ],
};

export const TIMELINE = [
  { label: "Start quarter", detail: "Portfolio orientation", agents: 4 },
  { label: "Adoption signal", detail: "−18% wave-2 usage", agents: 5 },
  { label: "Cross-role response", detail: "CSM → TSM → AE", agents: 4 },
  { label: "Customer meeting", detail: "Remediation agreed", agents: 4 },
  { label: "Recovery", detail: "+34% adoption", agents: 3 },
  { label: "Value review", detail: "Narrative assembled", agents: 4 },
];

/* ───────── Horizon 2.0 refinement: six-step AI story ───────── */

export type Stage =
  | "Awareness"
  | "Understanding"
  | "Orchestration"
  | "Action"
  | "Continuity"
  | "Value";

export const STAGES: Stage[] = [
  "Awareness",
  "Understanding",
  "Orchestration",
  "Action",
  "Continuity",
  "Value",
];

/** Which AI capability each moment demonstrates. */
export const MOMENT_STAGES: Record<number, Stage[]> = {
  1: ["Awareness", "Understanding"],
  2: ["Awareness", "Understanding"],
  3: ["Orchestration", "Action"],
  4: ["Continuity", "Action"],
  5: ["Continuity", "Value"],
  6: ["Value"],
  7: ["Value"],
};

export const NAV = [
  "Home",
  "Accounts",
  "Success Plans",
  "Customer Activity",
  "Value",
  "Insights",
] as const;

export const SITUATIONS = [
  {
    account: "Acme Corporation",
    kind: "Adoption risk detected",
    tone: "risk" as const,
    detail: "Strategic adoption declined 18%.",
    impact: "Q3 adoption milestone",
    action: "Review",
  },
  {
    account: "Globex",
    kind: "Stakeholder change",
    tone: "attention" as const,
    detail: "New executive sponsor identified.",
    impact: "Relationship coverage",
    action: "Prepare outreach",
  },
  {
    account: "Contoso",
    kind: "Milestone achieved",
    tone: "positive" as const,
    detail: "Adoption target completed two weeks early.",
    impact: "Value moment available",
    action: "Review value",
  },
];

export const QUARTER_SCORECARD = [
  { value: "7", label: "Customer outcomes progressing" },
  { value: "2", label: "Need attention" },
  { value: "1", label: "At risk" },
  { value: "4", label: "Ahead of plan" },
];

export const DECISIONS = [
  { account: "Acme", task: "Coordinate technical investigation", cta: "Review" },
  { account: "Globex", task: "Approve executive sponsor outreach", cta: "Review" },
  { account: "Contoso", task: "Confirm value milestone", cta: "Confirm" },
];

export const ACME_TABS = [
  "Overview",
  "Success Plan",
  "Adoption",
  "Value",
  "Risks",
  "Activity",
] as const;

export const ACME_METRICS = [
  { label: "Customer Health", value: "82", delta: "↓ 5 points", tone: "down" as const },
  { label: "Strategic Adoption", value: "68%", delta: "↓ 18%", tone: "down" as const },
  { label: "Value Realization", value: "74%", delta: "On track", tone: "flat" as const },
  { label: "Open Risks", value: "1", delta: "Needs attention", tone: "warn" as const },
];

export const ADOPTION_EVIDENCE = [
  "Usage declined after a recent configuration change.",
  "Support activity increased during the same period.",
  "Adoption among the strategic deployment group is declining faster than the account average.",
  "Similar behaviour historically preceded delayed adoption milestones.",
];

export const AGENT_CHAIN = [
  { agent: "Adoption Agent", action: "Detected abnormal usage decline." },
  { agent: "Customer Health Agent", action: "Detected negative health trajectory." },
  { agent: "Risk Agent", action: "Connected the change to the Q3 milestone." },
  { agent: "Customer Context Agent", action: "Correlated support and configuration activity." },
  { agent: "Otto", action: "Synthesized the findings and recommended action." },
];

export const WORKSTREAMS = [
  {
    title: "Technical investigation",
    owner: "Maya Chen · TSM",
    detail: "Determine whether the configuration change caused the adoption decline.",
    status: "Context ready",
  },
  {
    title: "Commercial awareness",
    owner: "Daniel Brooks · AE",
    detail: "Keep informed because adoption risk could affect the Q4 expansion discussion.",
    status: "No action required",
  },
  {
    title: "Customer preparation",
    owner: "Alex Rivera · CSM",
    detail: "Prepare a recovery conversation before Tuesday's meeting.",
    status: "Pending investigation",
  },
];

export const COORDINATION_CONFIRMED = [
  "TSM investigation initiated",
  "Relevant customer context shared",
  "AE informed",
  "Tuesday meeting connected",
  "Outcome monitoring activated",
];

export const ACTIVITY_RAIL = [
  {
    when: "Today · 9:01 AM",
    title: "Adoption decline detected",
    lines: [
      "Adoption Agent identified an abnormal decrease.",
      "Otto connected it to the Q3 milestone.",
    ],
  },
  {
    when: "Today · 9:04 AM",
    title: "Technical investigation recommended",
    lines: ["Maya Chen identified as the appropriate collaborator.", "CSM decision required"],
  },
  {
    when: "Today · 11:42 AM",
    title: "Root cause confirmed",
    lines: ["Configuration issue identified.", "Added to shared customer context"],
  },
  {
    when: "Tuesday · 10:52 AM",
    title: "Customer commitments updated",
    lines: ["Three commitments are now being monitored."],
  },
];

/** Strategic adoption trajectory — weeks of Q3. */
export const ADOPTION_SERIES = {
  labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
  actual: [86, 85, 84, 78, 72, 68, null, null] as (number | null)[],
  target: [86, 86, 87, 88, 89, 90, 91, 92],
  projected: [null, null, null, null, null, 68, 64, 61] as (number | null)[],
  divergeIndex: 3,
};

export const VALUE_SERIES = {
  points: [0.2, 0.5, 0.8, 0.85, 1.1, 1.5, 1.95, 2.4],
  marks: [
    { i: 0, label: "Start of Q3" },
    { i: 2, label: "Adoption decline detected" },
    { i: 3, label: "Recovery initiated" },
    { i: 5, label: "Adoption restored" },
    { i: 6, label: "Success milestone achieved" },
    { i: 7, label: "Customer Value Review" },
  ],
};

export const VALUE_METRICS = [
  { value: "91%", label: "Strategic adoption", note: "Recovered from 68%" },
  { value: "4 / 4", label: "Success milestones", note: "Completed" },
  { value: "0", label: "Critical risks", note: "1 resolved" },
  { value: "3 / 3", label: "Executive goals", note: "On track" },
];

export const OPPORTUNITIES = [
  {
    title: "Expand advanced workflow adoption",
    metricLabel: "Estimated value",
    metric: "$1.1M",
    reason: "Two additional teams are ready to expand.",
  },
  {
    title: "Executive sponsor alignment",
    metricLabel: "Strategic impact",
    metric: "High",
    reason: "New executive stakeholder identified.",
  },
  {
    title: "Automation expansion",
    metricLabel: "Estimated value",
    metric: "$650K",
    reason: "Three workflows show significant automation potential.",
  },
];

export const POST_MEETING = [
  { value: "3", label: "Decisions" },
  { value: "4", label: "Actions" },
  { value: "3", label: "Owners" },
  { value: "2", label: "Changed commitments" },
];

export const POST_MEETING_CONFIRMED = [
  "Success plan updated",
  "Team context synchronized",
  "Commitments assigned",
  "Three outcomes now monitored",
];

export const OPERATING_MODEL = [
  { title: "PEOPLE", items: ["CSM", "TSM", "AE", "Support", "Services", "BPC"] },
  { title: "OTTO", items: ["Understands", "Synthesizes", "Recommends", "Orchestrates"] },
  {
    title: "SPECIALIZED AGENTS",
    items: ["Monitor", "Analyze", "Prepare", "Coordinate", "Act"],
  },
  {
    title: "CUSTOMER SUCCESS INTELLIGENCE",
    items: [
      "Customer data",
      "Product signals",
      "Workflows",
      "Knowledge",
      "Communications",
      "History",
    ],
  },
];

export const AWARENESSES = [
  {
    title: "System Awareness",
    body: "The environment knows something changed — strategic adoption declined.",
  },
  {
    title: "Workflow Awareness",
    body: "The environment knows where work stands — investigation completed, customer preparation should begin.",
  },
  {
    title: "Role Awareness",
    body: "The environment knows who needs what — TSM needs technical evidence, CSM needs customer strategy, AE needs commercial context.",
  },
];
