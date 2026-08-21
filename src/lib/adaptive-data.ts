/**
 * Adaptive canvas story — Northwind Robotics.
 *
 * The right side of the LUX experience is never a dashboard. It renders only
 * what the CSM needs to know or do at this moment, organised around what the
 * customer is trying to achieve. This file holds that moment sequence.
 */

export type AdaptiveMomentId =
  | "signal"
  | "evidence"
  | "decision"
  | "coordinate"
  | "review"
  | "thread";

export const ADAPTIVE_MOMENTS: {
  id: AdaptiveMomentId;
  label: string;
  /** What the canvas is for at this moment. */
  intent: string;
  breadcrumb: string[];
}[] = [
  {
    id: "signal",
    label: "Focused signal",
    intent: "Otto surfaces the one thing worth knowing first.",
    breadcrumb: ["Home", "My morning"],
  },
  {
    id: "evidence",
    label: "Relevant evidence",
    intent: "The CSM asks why. Only the evidence that answers it appears.",
    breadcrumb: ["Home", "Northwind Robotics", "Why adoption changed"],
  },
  {
    id: "decision",
    label: "Human judgment",
    intent: "The consequential choice stays with the CSM.",
    breadcrumb: ["Home", "Northwind Robotics", "Recommended intervention"],
  },
  {
    id: "coordinate",
    label: "Coordination",
    intent: "The CSM does the work: brief the right three people.",
    breadcrumb: ["Home", "Northwind Robotics", "Coordinate account team"],
  },
  {
    id: "review",
    label: "Review & approve",
    intent: "Otto drafted the lower-judgment artifact. The CSM edits it.",
    breadcrumb: ["Home", "Northwind Robotics", "QIR narrative"],
  },
  {
    id: "thread",
    label: "Customer thread",
    intent: "One continuous thread, updated with what was decided.",
    breadcrumb: ["Home", "Northwind Robotics", "Customer thread"],
  },
];

export const CUSTOMER = {
  name: "Northwind Robotics",
  segment: "Strategic Enterprise · Manufacturing",
  quarter: "Q3 2026",
  priority:
    "Reduce fulfillment operating costs by 15% through greater workflow automation.",
  progress: 62,
  commitment: "Committed at the Q2 QIR · owner: Dana Whitfield, VP Operations",
  nextMoment: "Q3 QIR in 9 days",
};

export const SIGNALS = [
  { label: "Workflow adoption", value: "↓ 17%", note: "Two automation workflows" },
  { label: "Critical support", value: "3 P1", note: "Same two workflows" },
  { label: "Executive engagement", value: "↓", note: "No exec touch in 6 weeks" },
];

export const ADOPTION_SERIES = [
  { week: "Wk 1", value: 68 },
  { week: "Wk 3", value: 66 },
  { week: "Wk 5", value: 61 },
  { week: "Wk 7", value: 55 },
  { week: "Wk 9", value: 51 },
];

export const AFFECTED_WORKFLOWS = [
  {
    name: "Inbound exception handling",
    change: "72% → 48%",
    note: "Automation rules paused after a release change on 14 Jul.",
  },
  {
    name: "Returns reconciliation",
    change: "64% → 54%",
    note: "Two teams reverted to manual queue triage.",
  },
];

export const SUPPORT_EVIDENCE = [
  {
    id: "P1-4471",
    title: "Exception rules not firing after release",
    age: "Open 12 days",
    workflow: "Inbound exception handling",
  },
  {
    id: "P1-4488",
    title: "Reconciliation job timeout under peak volume",
    age: "Open 8 days",
    workflow: "Returns reconciliation",
  },
  {
    id: "P1-4502",
    title: "Duplicate credit records created on retry",
    age: "Resolved, 3 days to fix",
    workflow: "Returns reconciliation",
  },
];

export const INTERVENTION = {
  recommendation: "Align the account team before reaching out to Northwind.",
  because: [
    "Adoption declined in the two workflows carrying the Q3 target",
    "Three P1 cases overlap the same period and workflows",
    "The Q3 QIR is 9 days away",
    "The 15% cost commitment is customer-stated, not internal",
  ],
  choices: [
    { label: "Coordinate account team", tone: "primary" as const },
    { label: "Contact customer", tone: "secondary" as const },
    { label: "Keep monitoring", tone: "tertiary" as const },
    { label: "Add context", tone: "tertiary" as const },
  ],
};

export const TEAM = [
  {
    name: "Alex Moreno",
    initials: "AM",
    role: "Account Executive",
    why: "Owns the renewal conversation and the expansion case.",
    status: "online" as const,
  },
  {
    name: "Jordan Reyes",
    initials: "JR",
    role: "Support Lead",
    why: "Owns the two open P1 cases on the affected workflows.",
    status: "busy" as const,
  },
  {
    name: "Priya Nair",
    initials: "PN",
    role: "Solution Consultant",
    why: "Built the original automation design in Q1.",
    status: "away" as const,
  },
];

export const TEAM_BRIEF = {
  situation:
    "Workflow adoption at Northwind fell 17% this quarter, concentrated in the two workflows that carry their committed 15% fulfillment cost reduction.",
  talkingPoints: [
    "Confirm whether the paused exception rules were intentional or a release side effect.",
    "Agree a fix date for P1-4488 that lands before the QIR.",
    "Decide whether we re-run the automation enablement session with the ops team.",
  ],
  owner: "Jordan Reyes — technical resolution path",
  next: "15-minute alignment before the QIR draft is shared with Dana.",
};

export const ARTIFACT = {
  title: "Q3 QIR narrative — Northwind Robotics",
  sections: [
    {
      heading: "Where the outcome stands",
      body: "Northwind has realised an estimated 9.3% reduction in fulfillment operating cost against a 15% Q3 commitment. Progress is real but has slowed since week 5.",
      source: "Value Realization Agent · finance-validated usage model",
    },
    {
      heading: "What changed and why",
      body: "Adoption in inbound exception handling and returns reconciliation declined after a 14 Jul release change, compounded by three P1 incidents on the same workflows.",
      source: "Adoption Signal Agent + Support Intelligence Agent",
    },
    {
      heading: "What we are doing about it",
      body: "Support has an agreed fix date for the reconciliation timeout, and the automation enablement session will be re-run with the ops team before quarter end.",
      source: "Drafted from your team brief on 21 Aug",
    },
  ],
};

export const THREAD = [
  {
    when: "Today · 08:12",
    who: "Otto",
    what: "Connected adoption decline, three P1 cases and executive engagement to the Q3 automation outcome.",
    kind: "ai" as const,
  },
  {
    when: "Today · 08:26",
    who: "You",
    what: "Decided to align the account team before contacting the customer.",
    kind: "human" as const,
  },
  {
    when: "Today · 08:31",
    who: "You + Otto",
    what: "Team brief sent to Alex, Jordan and Priya. Jordan owns the technical path.",
    kind: "human" as const,
  },
  {
    when: "Today · 08:33",
    who: "Otto + agents",
    what: "QIR narrative updated with the approved language and evidence links.",
    kind: "ai" as const,
  },
  {
    when: "Scheduled",
    who: "Otto",
    what: "Will re-check adoption in the two workflows daily until the QIR and flag any further decline.",
    kind: "ai" as const,
  },
];

/** Otto's guidance for each moment: what he says, and what he can be asked. */
export const OTTO_SCRIPT: Record<
  AdaptiveMomentId,
  { say: string[]; steps: string[]; sources: string[]; prompts: string[] }
> = {
  signal: {
    say: [
      "Good morning, Maya. Two customers need your attention today. Northwind is the one I would look at first.",
      "I connected three signals because they all affect the automation outcome Northwind committed to last quarter.",
    ],
    steps: [
      "Scanned 34 accounts for movement against committed outcomes",
      "Ranked by outcome risk, not by activity volume",
      "Grouped signals that share a root cause",
    ],
    sources: ["Adoption telemetry", "Support queue", "Q2 QIR commitments"],
    prompts: ["Why Northwind first?", "Show second priority", "What changed this week?"],
  },
  evidence: {
    say: [
      "Adoption fell from 68% to 51%, and almost all of it sits in the two workflows behind their 15% cost target.",
      "I am starting with the workflow view rather than the account view, because that is where their commitment lives.",
    ],
    steps: [
      "Isolated decline by workflow rather than by account",
      "Correlated the 14 Jul release change with rule pauses",
      "Overlapped incident windows with usage drop",
    ],
    sources: ["Workflow usage events", "Release record 14 Jul", "P1-4471, P1-4488, P1-4502"],
    prompts: ["Is this a product or adoption issue?", "Compare last QIR", "Who is affected internally?"],
  },
  decision: {
    say: [
      "I would align internally before contacting Dana. The technical path is not resolved yet, and the QIR is in nine days.",
      "This is your call — I can prepare either route.",
    ],
    steps: [
      "Weighed customer-facing outreach against unresolved incidents",
      "Checked QIR timing and executive engagement history",
      "Prepared both coordination and outreach drafts",
    ],
    sources: ["Support resolution forecast", "QIR calendar", "Engagement history"],
    prompts: ["What is the risk of waiting?", "Draft the customer message instead", "Who should own the fix?"],
  },
  coordinate: {
    say: [
      "These three people cover the whole situation. I drafted a brief from the evidence you just reviewed.",
      "Edit anything before it goes out — the brief carries your judgment, not mine.",
    ],
    steps: [
      "Selected collaborators by ownership of the affected work",
      "Summarised the situation in the language of the customer's goal",
      "Proposed an owner for the technical path",
    ],
    sources: ["Case ownership", "Q1 automation design", "Renewal plan"],
    prompts: ["Add the renewal risk", "Why Jordan as owner?", "Shorten the brief"],
  },
  review: {
    say: [
      "I drafted the QIR narrative from what we established this morning. Every section links to its evidence.",
      "Approve the sections you agree with and rewrite anything that should sound like you.",
    ],
    steps: [
      "Reused the validated outcome model from the Q2 QIR",
      "Wrote only sections supported by evidence",
      "Flagged the cost-reduction figure as finance-validated",
    ],
    sources: ["Value model", "Adoption analysis", "Your team brief"],
    prompts: ["Make it more direct", "Add the recovery plan", "Show the value evidence"],
  },
  thread: {
    say: [
      "The Northwind thread is up to date. Your decision, the brief and the narrative are all connected to the same customer goal.",
      "I will keep watching the two workflows and tell you if the trend turns again before the QIR.",
    ],
    steps: [
      "Recorded the decision and its rationale",
      "Linked artifacts to the Q3 commitment",
      "Set continuous monitoring on the affected workflows",
    ],
    sources: ["Customer thread", "Success plan", "Monitoring rules"],
    prompts: ["What happens next?", "Show the success plan update", "Back to my morning"],
  },
};

/** Otto's reply to any prompt or typed question, routed by intent. */
export function ottoReply(question: string): string[] {
  const q = question.toLowerCase();
  if (q.includes("second")) {
    return [
      "Second priority is Halden Freight: onboarding is on track but their sponsor changed last week.",
      "It matters, but nothing is at risk in the next nine days. Northwind is.",
    ];
  }
  if (q.includes("risk of waiting") || q.includes("wait")) {
    return [
      "If nothing changes for two more weeks, the realised saving lands near 10% against a 15% commitment.",
      "That turns the QIR from a progress conversation into a credibility conversation.",
    ];
  }
  if (q.includes("product") || q.includes("adoption issue")) {
    return [
      "Both. The release change paused automation rules, and the teams then reverted to manual triage rather than re-enabling them.",
      "Fixing the defect alone will not recover adoption.",
    ];
  }
  if (q.includes("jordan") || q.includes("own")) {
    return [
      "Jordan owns the two open P1s on the affected workflows, so the fix date is his to commit.",
      "Priya stays involved for the automation design, but the critical path is technical resolution.",
    ];
  }
  if (q.includes("value") || q.includes("evidence")) {
    return [
      "Realised saving is 9.3%, derived from processed volume, handling time and Northwind's own cost-per-task figure.",
      "Finance validated the model at the Q2 QIR, so the number is theirs, not ours.",
    ];
  }
  if (q.includes("why northwind")) {
    return [
      "Northwind is the only account where a customer-stated commitment is trending away from its target before a scheduled executive moment.",
      "Everything else in your portfolio is either stable or has time to recover.",
    ];
  }
  if (q.includes("next")) {
    return [
      "Jordan confirms the fix date, the enablement session gets re-run, and the QIR narrative goes to Dana two days before the meeting.",
      "I will hold the draft until you approve the final section.",
    ];
  }
  return [
    "Here is what I can establish from the Northwind context we are working in right now.",
    "Adoption in the two committed workflows is the constraint; everything else this quarter is on plan.",
  ];
}
