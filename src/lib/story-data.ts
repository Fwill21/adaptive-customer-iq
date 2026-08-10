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

/* ───────── Interactive example data for CTAs ───────── */

export type DetailSection = { label: string; items: string[] };
export type Detail = { title: string; meta?: string; summary?: string; sections: DetailSection[]; confirm?: string };

export const SITUATION_DETAILS: Record<string, Detail> = {
  "Acme Corporation": {
    title: "Adoption risk — Acme Corporation",
    meta: "Detected today · 9:01 AM · 4 agents contributed",
    summary:
      "Strategic adoption declined 18% in the primary deployment group over the past three weeks, ahead of the Q3 executive check-in.",
    sections: [
      {
        label: "Evidence",
        items: [
          "Wave-2 deployment group usage: 86% → 68%",
          "Configuration change applied in release 24.3 on Jul 14",
          "3 support cases opened in the same window",
          "Weekly active agents down 412 vs. plan",
        ],
      },
      {
        label: "Exposed commitments",
        items: [
          "Q3 milestone: Global rollout wave 2 (may slip ~2 weeks)",
          "Executive check-in in 4 days",
          "$1.1M Q4 expansion discussion",
        ],
      },
      {
        label: "Otto recommends",
        items: [
          "Open a technical investigation with Maya Chen (TSM)",
          "Share the adoption evidence pack with the account team",
          "Prepare a recovery conversation before Tuesday",
        ],
      },
    ],
    confirm: "Accept recommendation",
  },
  Globex: {
    title: "Stakeholder change — Globex Industries",
    meta: "Detected Friday · 4:22 PM · 3 agents contributed",
    summary:
      "A new executive sponsor was identified in the ITSM organisation. The relationship map and success plan need re-alignment this week.",
    sections: [
      {
        label: "What changed",
        items: [
          "Priya Raman appointed VP, Service Operations",
          "Previous sponsor moved to a different business unit",
          "Two success plan goals were owned by the previous sponsor",
        ],
      },
      {
        label: "Coverage gaps",
        items: [
          "No executive relationship above director level",
          "Q4 renewal narrative not yet socialised",
          "Introduction window closes this week",
        ],
      },
      {
        label: "Otto prepared",
        items: [
          "Draft introduction note referencing Globex's stated outcomes",
          "One-page value summary for the new sponsor",
          "Suggested 30-minute agenda",
        ],
      },
    ],
    confirm: "Send outreach draft",
  },
  Contoso: {
    title: "Milestone achieved — Contoso Group",
    meta: "Confirmed today · 7:40 AM · 3 agents contributed",
    summary:
      "Contoso reached its 5,000 active agents adoption target two weeks early — a value moment worth capturing with the sponsor.",
    sections: [
      {
        label: "Result",
        items: [
          "5,140 active agents (target 5,000)",
          "Completed 14 days ahead of plan",
          "Time-to-value: 71 days vs. 90-day benchmark",
        ],
      },
      {
        label: "Value evidence",
        items: [
          "$480K estimated annual efficiency gain",
          "Case deflection up 21%",
          "Two teams ready for the next expansion wave",
        ],
      },
      {
        label: "Otto prepared",
        items: [
          "Value moment summary for the executive sponsor",
          "Updated success plan status",
          "Suggested next milestone: automation expansion",
        ],
      },
    ],
    confirm: "Confirm value moment",
  },
};

export const DECISION_DETAILS: Record<string, Detail> = {
  Acme: {
    title: "Coordinate technical investigation",
    meta: "Decision required · Acme Corporation",
    summary:
      "Otto has prepared the investigation context. Approving assigns it to the TSM with full customer history attached.",
    sections: [
      {
        label: "Prepared context",
        items: [
          "Adoption timeline and divergence point (week 4)",
          "Release 24.3 configuration diff",
          "3 related support cases and 1 knowledge article",
        ],
      },
      { label: "Owner", items: ["Maya Chen · Technical Success Manager", "Due before Tuesday 10:00 AM"] },
    ],
    confirm: "Assign to Maya Chen",
  },
  Globex: {
    title: "Approve executive sponsor outreach",
    meta: "Decision required · Globex Industries",
    summary: "A drafted introduction to Priya Raman is ready for your review before it is sent.",
    sections: [
      {
        label: "Draft highlights",
        items: [
          "References Globex's stated service-reliability outcome",
          "Offers a 30-minute alignment session",
          "Attaches the one-page Q3 value summary",
        ],
      },
      { label: "Owner", items: ["Alex Rivera · CSM", "Send window closes Friday"] },
    ],
    confirm: "Approve and send",
  },
  Contoso: {
    title: "Confirm value milestone",
    meta: "Decision required · Contoso Group",
    summary:
      "Confirming publishes the milestone to the success plan and notifies the account team.",
    sections: [
      { label: "Milestone", items: ["5,000 active agents — achieved 14 days early"] },
      {
        label: "On confirmation",
        items: [
          "Success plan status updated",
          "Value moment added to the Q3 narrative",
          "Sponsor summary queued for review",
        ],
      },
    ],
    confirm: "Confirm milestone",
  },
};

export const RECOMMENDATION_DETAIL: Detail = {
  title: "Otto's recommendation",
  meta: "Adoption risk · Acme Corporation",
  summary:
    "Investigate the configuration change with the Technical Success Manager before Tuesday's customer meeting.",
  sections: [
    {
      label: "Why this action",
      items: [
        "The decline began one day after the release 24.3 configuration change",
        "Similar patterns previously delayed adoption milestones by 2–3 weeks",
        "A technical root cause is required before the customer conversation",
      ],
    },
    {
      label: "What happens if you approve",
      items: [
        "Investigation created with full customer context",
        "AE informed of commercial exposure",
        "Recovery conversation prepared for Tuesday",
        "Outcome monitoring activated",
      ],
    },
  ],
  confirm: "Approve recommendation",
};

export const OTTO_SUGGESTIONS = [
  "What needs my attention this week?",
  "Why did Acme adoption decline?",
  "Prepare me for Tuesday's Acme meeting",
  "Show Q3 value realized for Acme",
];

export const OTTO_ANSWERS: Record<string, string[]> = {
  "What needs my attention this week?": [
    "Three accounts. Acme is highest priority — strategic adoption fell 18% ahead of an executive check-in in 4 days.",
    "Globex needs executive sponsor outreach before Friday, and Contoso reached its adoption milestone two weeks early.",
  ],
  "Why did Acme adoption decline?": [
    "Adoption diverged from target in week 4, one day after the release 24.3 deployment configuration change.",
    "Three support cases were opened in the same window, and the wave-2 group declined faster than the account average.",
  ],
  "Prepare me for Tuesday's Acme meeting": [
    "The briefing is ready: root cause confirmed, remediation complete, milestone moves approximately two weeks.",
    "I've drafted answers to the three questions the customer is most likely to ask.",
  ],
  "Show Q3 value realized for Acme": [
    "$2.4M estimated realized business value, 4 of 4 success milestones complete, adoption recovered to 91%.",
    "Three next-quarter opportunities are identified, worth an estimated $1.75M.",
  ],
};

export const OTTO_FALLBACK = [
  "I've assembled what I know across adoption, support, value and success plan signals for this portfolio.",
  "Acme remains the highest priority this week because of the adoption decline ahead of the executive check-in.",
];

export const ASK_OTTO_THREAD = [
  {
    q: "How confident are you in this?",
    a: "High. Four agents independently corroborated the decline, and the timing aligns with a specific configuration change.",
  },
  {
    q: "Has this happened before at Acme?",
    a: "Twice — in Q4 2024 and Q2 2025. Both followed configuration changes and were resolved within three weeks.",
  },
  {
    q: "What happens if we do nothing?",
    a: "The Q3 adoption milestone slips approximately two weeks and the Q4 expansion discussion loses its adoption evidence.",
  },
];

export const INVESTIGATION_STEPS = [
  "Configuration diff reviewed — release 24.3",
  "Root cause confirmed: assignment rule scoped to the wrong group",
  "Remediation applied and validated in the wave-2 group",
  "Findings added to shared customer context",
  "Alex Rivera notified for Tuesday's meeting",
];

export const OPPORTUNITY_DETAILS: Record<string, Detail> = {
  "Expand advanced workflow adoption": {
    title: "Expand advanced workflow adoption",
    meta: "Estimated value $1.1M · Next quarter",
    summary: "Two additional teams show the usage maturity required for advanced workflow adoption.",
    sections: [
      { label: "Signals", items: ["Field Operations: 92% core adoption", "Service Desk EMEA: 88% core adoption", "Advanced feature trials up 3x"] },
      { label: "Suggested path", items: ["Executive alignment session", "Two-week enablement pilot", "Milestone added to the Q4 success plan"] },
    ],
    confirm: "Add to Q4 plan",
  },
  "Executive sponsor alignment": {
    title: "Executive sponsor alignment",
    meta: "Strategic impact: High · Next quarter",
    summary: "A new executive stakeholder was identified with influence over the Q4 investment decision.",
    sections: [
      { label: "Context", items: ["New VP of Service Operations appointed", "Owns two Q4 success plan goals", "No relationship above director level today"] },
      { label: "Suggested path", items: ["Value summary shared ahead of introduction", "30-minute alignment session", "Joint Q4 outcome definition"] },
    ],
    confirm: "Schedule alignment",
  },
  "Automation expansion": {
    title: "Automation expansion",
    meta: "Estimated value $650K · Next quarter",
    summary: "Three high-volume workflows show significant automation potential based on current usage patterns.",
    sections: [
      { label: "Candidates", items: ["Access request approvals — 4,200/quarter", "Asset onboarding — 2,600/quarter", "Incident triage routing — 9,100/quarter"] },
      { label: "Suggested path", items: ["Automation assessment with the BPC", "Business case with baseline metrics", "Pilot on access request approvals"] },
    ],
    confirm: "Request assessment",
  },
};

export const ACME_TAB_DATA: Record<string, DetailSection[]> = {
  Overview: [
    { label: "Account", items: ["Strategic Enterprise · 12,400 employees", "Customer since 2021", "Renewal: Feb 2027 · $4.2M ACV"] },
    { label: "Team", items: ["Alex Rivera · CSM", "Maya Chen · TSM", "Daniel Brooks · AE"] },
  ],
  "Success Plan": [
    { label: "Q3 goals", items: ["Global rollout wave 2 — at risk", "Reduce case handling time 15% — on track", "Executive value review — scheduled"] },
    { label: "Completed", items: ["Wave 1 rollout", "Knowledge migration", "Reporting foundation", "Admin enablement"] },
  ],
  Adoption: [
    { label: "By group", items: ["Wave 1: 94%", "Wave 2: 68% (declining)", "Wave 3: not started"] },
    { label: "Drivers", items: ["Assignment rule misconfiguration", "Reduced training completion in wave 2", "Mobile usage flat"] },
  ],
  Value: [
    { label: "Realized", items: ["$2.4M estimated business value", "Case deflection +18%", "MTTR down 26%"] },
    { label: "Pending", items: ["Automation expansion business case", "Wave 3 rollout value model"] },
  ],
  Risks: [
    { label: "Open", items: ["Adoption decline in wave 2 — mitigation in progress"] },
    { label: "Resolved this quarter", items: ["Integration latency (Jun)", "Reporting access gap (Jul)"] },
  ],
  Activity: [
    { label: "Today", items: ["9:01 AM — Adoption decline detected", "9:04 AM — Investigation recommended", "11:42 AM — Root cause confirmed"] },
    { label: "This week", items: ["Tuesday 10:00 AM — Customer meeting", "Thursday — Executive check-in prep"] },
  ],
};

export const SEARCH_RESULTS: DetailSection[] = [
  { label: "Accounts", items: ["Acme Corporation", "Globex Industries", "Contoso Group"] },
  { label: "Recent", items: ["Acme adoption trajectory", "Q3 value realized", "Wave 2 rollout milestone"] },
  { label: "Ask Otto", items: ["What needs my attention this week?", "Which accounts are at risk?"] },
];
