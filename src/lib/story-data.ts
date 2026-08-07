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
