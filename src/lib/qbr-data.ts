import type { AgentKey, Detail, DetailSection, Stage } from "./story-data";

/* ═════════ Path model (leadership demo paths) ═════════ */

export type PathId = "quarter" | "qbr" | "modes";

export const PATHS = [
  {
    id: "quarter" as PathId,
    label: "Quarter in Motion",
    subtitle: "Continuous Customer Value Orchestration",
    description:
      "Follow a CSM through a quarter and see how Otto, specialized agents, continuous awareness, and cross-functional orchestration move customer success from reactive work to proactive value creation.",
    cta: "Explore Quarter in Motion",
    steps: [
      "01 Start My Quarter",
      "02 Something Changed",
      "03 Coordinate Response",
      "04 Prepare for Customer",
      "05 Show the Value",
    ],
    question:
      "What does customer success look like when AI continuously orchestrates work throughout the quarter?",
    proves: [
      "continuous awareness",
      "proactive intervention",
      "cross-functional orchestration",
      "role-aware personalization",
      "ongoing customer value creation",
    ],
  },
  {
    id: "qbr" as PathId,
    label: "AI-Native QBR",
    subtitle: "From Continuous Intelligence to Customer Value Conversation",
    description:
      "See how CSP continuously prepares the customer story, coordinates the account team, identifies gaps, supports the QBR conversation, and transforms decisions into the next quarter's success plan.",
    cta: "Explore AI-Native QBR",
    steps: [
      "01 QBR Approaching",
      "02 Build the Story",
      "03 Close the Gaps",
      "04 Coordinate the Team",
      "05 Prepare Me",
      "06 Lead the QBR",
      "07 Capture Outcomes",
      "08 Activate Next Quarter",
    ],
    question:
      "What does a critical customer value moment look like when the system has understood the customer all quarter?",
    proves: [
      "AI synthesis",
      "QBR readiness",
      "evidence validation",
      "team coordination",
      "executive preparation",
      "conversational intelligence",
      "outcome capture",
      "next-quarter activation",
    ],
  },
];

/* ═════════ QBR moments ═════════ */

export const QBR_MOMENTS = [
  { id: 1, label: "QBR Approaching" },
  { id: 2, label: "Build the Story" },
  { id: 3, label: "Close the Gaps" },
  { id: 4, label: "Coordinate the Team" },
  { id: 5, label: "Prepare Me" },
  { id: 6, label: "Lead the QBR" },
  { id: 7, label: "Capture Outcomes" },
  { id: 8, label: "Activate Next Quarter" },
];

export const QBR_MOMENT_STAGES: Record<number, Stage[]> = {
  1: ["Awareness"],
  2: ["Understanding"],
  3: ["Understanding", "Awareness"],
  4: ["Orchestration"],
  5: ["Action", "Understanding"],
  6: ["Action"],
  7: ["Continuity"],
  8: ["Value"],
};

/** Which awareness each moment is labelled with in presentation mode. */
export const QBR_AWARENESS_LABEL: Record<number, string> = {
  1: "Workflow Awareness",
  2: "System Awareness",
  3: "System Awareness",
  4: "Role Awareness",
  5: "Workflow Awareness",
  6: "Human Judgment · AI Support",
  7: "Workflow Awareness",
  8: "Role Awareness",
};

export const QBR_BREADCRUMBS: Record<number, string[]> = {
  1: ["Accounts", "Acme Corporation", "Business Review"],
  2: ["Accounts", "Acme Corporation", "Value Story"],
  3: ["Accounts", "Acme Corporation", "QBR Readiness"],
  4: ["Accounts", "Acme Corporation", "QBR Coordination"],
  5: ["Accounts", "Acme Corporation", "Executive Briefing"],
  6: ["Meetings", "Acme Q3 Business Review"],
  7: ["Customer Activity", "Acme Corporation", "QBR Outcomes"],
  8: ["Accounts", "Acme Corporation", "Q4 Success Plan"],
};

export const QBR_NAV_ACTIVE: Record<number, string> = {
  1: "Accounts",
  2: "Value",
  3: "Accounts",
  4: "Success Plans",
  5: "Customer Activity",
  6: "Customer Activity",
  7: "Customer Activity",
  8: "Success Plans",
};

/* ═════════ 01 · QBR Approaching ═════════ */

export const QBR_READINESS_INDICATORS = [
  { value: "3", label: "Outcomes demonstrated" },
  { value: "1", label: "Value metric needs validation" },
  { value: "2", label: "Open commitments" },
  { value: "1", label: "Strategic risk" },
  { value: "3", label: "Next-quarter opportunities" },
];

export const QBR_READINESS_DETAIL: Detail = {
  title: "Acme QBR readiness",
  meta: "78% ready · 12 days out",
  summary:
    "Acme's Q3 story is already assembled from the quarter's accumulated intelligence. Two evidence gaps and two open commitments remain before the review is fully ready.",
  sections: [
    {
      label: "What is complete",
      items: [
        "Three customer outcomes demonstrated with evidence",
        "4 of 4 Q3 success milestones completed",
        "Adoption recovery validated through week 8 usage",
        "Q3 value narrative drafted from actual quarter activity",
      ],
    },
    {
      label: "What is missing",
      items: [
        "$420K efficiency outcome relies on modeled rather than customer-confirmed data",
        "New executive sponsor has not confirmed Q4 priorities",
        "Expansion readiness assessment in progress with Maya Chen (TSM)",
      ],
    },
    {
      label: "What Otto recommends",
      items: [
        "Request value validation from the customer value owner",
        "Prepare sponsor priority questions for the pre-QBR check-in",
        "Coordinate the three team contributions in one orchestration",
      ],
    },
  ],
  confirm: "Accept readiness plan",
};

/* ═════════ 02 · Build the Story ═════════ */

export const QBR_OUTCOMES = [
  {
    title: "Adoption recovered and expanded",
    metric: "68% → 91%",
    note: "Following the mid-quarter intervention",
    agents: ["adoption", "health"] as AgentKey[],
  },
  {
    title: "Customer goals achieved",
    metric: "4 / 4",
    note: "Q3 success milestones completed",
    agents: ["planning", "context"] as AgentKey[],
  },
  {
    title: "Value realized",
    metric: "$2.4M",
    note: "Estimated business value generated",
    agents: ["value", "opportunity"] as AgentKey[],
  },
];

export const QBR_STORY_ARC = [
  {
    label: "Challenge",
    body: "Strategic adoption declined during the quarter.",
    link: "Moment 02 · Something Changed",
  },
  {
    label: "Response",
    body: "The CSM, TSM, and broader account team coordinated recovery.",
    link: "Moment 03 · Coordinate Response",
  },
  {
    label: "Outcome",
    body: "Adoption recovered and the customer reached its success milestone.",
    link: "Moment 04 · Prepare for Customer",
  },
  {
    label: "Opportunity",
    body: "Two additional business units are now ready for expansion.",
    link: "Moment 05 · Show the Value",
  },
];

export const QBR_OUTCOME_DETAILS: Record<string, Detail> = {
  "Adoption recovered and expanded": {
    title: "Adoption recovered and expanded",
    meta: "Adoption Agent · Customer Health Agent",
    summary:
      "Strategic adoption fell to 68% in week 4 after a deployment configuration change, then recovered to 91% by week 8.",
    sections: [
      {
        label: "Evidence",
        items: [
          "Weekly strategic workflow usage across the primary deployment group",
          "Configuration remediation completed in week 5",
          "Four consecutive weeks of recovery above target",
        ],
      },
      {
        label: "How to present it",
        items: [
          "Lead with the recovery, not the decline",
          "Credit the joint technical response",
          "Connect adoption to the completed success milestone",
        ],
      },
    ],
    confirm: "Include in QBR narrative",
  },
  "Customer goals achieved": {
    title: "Customer goals achieved",
    meta: "Success Planning Agent",
    summary: "All four Q3 success milestones in Acme's success plan were completed.",
    sections: [
      {
        label: "Milestones",
        items: [
          "Global rollout wave 2 completed",
          "Strategic workflow enablement for 1,400 users",
          "Automation baseline established",
          "Executive value reporting operational",
        ],
      },
    ],
    confirm: "Include in QBR narrative",
  },
  "Value realized": {
    title: "Value realized",
    meta: "Value Realization Agent",
    summary:
      "$2.4M estimated business value across deflection, cycle-time reduction, and automation efficiency.",
    sections: [
      {
        label: "Composition",
        items: [
          "$1.3M support deflection",
          "$680K request cycle-time reduction",
          "$420K automation efficiency — awaiting customer confirmation",
        ],
      },
      {
        label: "Confidence",
        items: [
          "Two of three components are customer-confirmed",
          "Otto flagged the third for validation before the QBR",
        ],
      },
    ],
    confirm: "Include in QBR narrative",
  },
};

/* ═════════ 03 · Close the Gaps ═════════ */

export const QBR_GAPS = [
  {
    key: "value",
    title: "Value evidence needs validation",
    headline: "$420K efficiency outcome",
    why: "Current value estimate relies on modeled rather than customer-confirmed data.",
    who: "Priya Raman · Customer Value Owner",
    evidence: "Customer-confirmed automation run volumes and hours saved.",
    recommendation: "Ask the customer value owner to validate the outcome.",
    cta: "Request validation",
    doneLabel: "Validation requested",
    detail: {
      title: "Validate the $420K efficiency outcome",
      meta: "Value Realization Agent · Gap 1 of 2",
      summary:
        "Two of three value components are customer-confirmed. This one is modeled from platform telemetry and should be validated before it is presented to the executive sponsor.",
      sections: [
        {
          label: "Why it matters",
          items: [
            "The executive sponsor asked for a clearer link between adoption and business outcomes",
            "Unvalidated value weakens the strongest part of the Q3 story",
          ],
        },
        {
          label: "What evidence is needed",
          items: [
            "Confirmed automation run volume for Q3",
            "Customer-agreed hours-saved assumption",
            "Sign-off from the customer value owner",
          ],
        },
        {
          label: "What Otto will do",
          items: [
            "Send a pre-filled validation request with the current model",
            "Monitor for response and update the QBR narrative automatically",
          ],
        },
      ],
      confirm: "Request validation",
    } as Detail,
  },
  {
    key: "priorities",
    title: "Executive priorities need confirmation",
    headline: "New executive sponsor",
    why: "A new executive sponsor was identified during the quarter. Q4 priorities have not been confirmed.",
    who: "Alex Rivera · CSM",
    evidence: "Confirmed Q4 business priorities and success measures.",
    recommendation: "Validate priorities during the sponsor check-in.",
    cta: "Prepare questions",
    doneLabel: "Questions prepared",
    detail: {
      title: "Confirm executive priorities",
      meta: "Customer Context Agent · Gap 2 of 2",
      summary:
        "The sponsor change was captured in week 6. Otto has prepared priority-confirmation questions for the pre-QBR check-in.",
      sections: [
        {
          label: "Why it matters",
          items: [
            "Q4 success measures cannot be set without confirmed priorities",
            "The QBR should close with agreed next-quarter direction",
          ],
        },
        {
          label: "Prepared questions",
          items: [
            "Which business outcomes matter most to you in Q4?",
            "How do you want value reported to your leadership?",
            "Is automation efficiency now a higher priority than reporting modernization?",
          ],
        },
      ],
      confirm: "Prepare questions",
    } as Detail,
  },
];

export const QBR_OPEN_COMMITMENT = {
  title: "Expansion readiness assessment",
  owner: "Maya Chen · TSM",
  due: "Thursday",
  status: "In progress",
};

/* ═════════ AI activity for the QBR path ═════════ */

export const QBR_AGENT_CHAIN = [
  { agent: "Customer Context Intelligence", action: "Assembled quarter activity and customer history." },
  { agent: "Success Planning Intelligence", action: "Evaluated goals and milestone completion." },
  { agent: "Value Intelligence", action: "Identified unvalidated value evidence." },
  { agent: "Risk Intelligence", action: "Identified remaining strategic exposure." },
  { agent: "Meeting Intelligence", action: "Reviewed previous stakeholder conversations." },
  { agent: "Opportunity Intelligence", action: "Identified potential next-quarter opportunities." },
  { agent: "Otto", action: "Synthesized the findings and determined QBR readiness." },
];

export const QBR_ACTIVITY_RAIL = [
  {
    when: "Aug 9 · 9:01 AM",
    title: "QBR readiness evaluated",
    lines: ["Otto identified two evidence gaps."],
  },
  {
    when: "Aug 9 · 9:04 AM",
    title: "Value validation requested",
    lines: ["$420K efficiency outcome sent for confirmation."],
  },
  {
    when: "Aug 10 · 11:32 AM",
    title: "TSM contribution received",
    lines: ["Adoption recovery validated."],
  },
  {
    when: "Aug 11 · 2:18 PM",
    title: "QBR narrative updated",
    lines: ["Technical findings incorporated."],
  },
  {
    when: "Aug 21 · 11:04 AM",
    title: "QBR outcomes captured",
    lines: ["Four decisions and six commitments identified."],
  },
  {
    when: "Aug 21 · 11:06 AM",
    title: "Q4 planning activated",
    lines: ["Three recommended priorities generated."],
  },
];

/* ═════════ 04 · Coordinate the Team ═════════ */

export const QBR_CONTRIBUTIONS = [
  {
    title: "Technical validation",
    owner: "Maya Chen · TSM",
    detail: "Confirm adoption recovery and expansion readiness.",
    status: "Context ready",
  },
  {
    title: "Commercial context",
    owner: "Daniel Brooks · AE",
    detail: "Confirm expansion opportunity and commercial timing.",
    status: "Context ready",
  },
  {
    title: "Value validation",
    owner: "Priya Raman · Customer Value Owner",
    detail: "Validate the $420K efficiency outcome.",
    status: "Confirmation required",
  },
  {
    title: "CSM",
    owner: "Alex Rivera · CSM",
    detail: "Confirm executive priorities and approve the final QBR narrative.",
    status: "Pending",
  },
];

export const QBR_COORDINATION_CONFIRMED = [
  "TSM context shared",
  "Value validation requested",
  "AE opportunity context incorporated",
  "Executive sponsor questions prepared",
  "Outstanding contributions monitored",
];

/* ═════════ Role-aware TSM contribution ═════════ */

export const TSM_QBR_CONTEXT = [
  { value: "91%", label: "Current adoption" },
  { value: "+23 pts", label: "Since intervention" },
  { value: "3", label: "Resolved technical issues" },
  { value: "2", label: "Potential expansion groups" },
];

export const TSM_QBR_REVIEW = [
  "Validate recovery stability",
  "Review technical readiness",
  "Identify remaining dependencies",
  "Confirm expansion recommendation",
];

export const TSM_QBR_DETAIL: Detail = {
  title: "Acme QBR technical contribution",
  meta: "Maya Chen · TSM",
  summary:
    "Otto needs confirmation that adoption recovery is sustainable and that two additional business units are technically ready to expand.",
  sections: [
    {
      label: "Recovery stability",
      items: [
        "Configuration remediation held through four weeks of usage",
        "No regression in the primary deployment group",
        "Monitoring remains active on the affected workflows",
      ],
    },
    {
      label: "Expansion readiness",
      items: [
        "Group A: integration prerequisites complete",
        "Group B: readiness assessment in progress, due Thursday",
        "No open critical defects affecting either group",
      ],
    },
  ],
  confirm: "Submit contribution",
};

/* ═════════ 05 · Prepare Me ═════════ */

export const QBR_BRIEFING: [string, string][] = [
  [
    "Customer objective",
    "Scale strategic workflow adoption while demonstrating measurable operational value.",
  ],
  ["What Acme accomplished", "4 of 4 Q3 success milestones completed."],
  ["Value realized", "$2.4M estimated business value."],
  ["Adoption", "91% strategic adoption. Recovered from 68%."],
  [
    "Challenge addressed",
    "Mid-quarter configuration issue caused an 18% adoption decline.",
  ],
  [
    "Team response",
    "Technical cause identified, remediation completed, recovery monitored.",
  ],
  [
    "Current customer sentiment",
    "Positive overall. Executive sponsor expects clearer connection between adoption and business outcomes.",
  ],
  [
    "Open issue",
    "One efficiency value metric is customer-confirmed but awaiting final documentation.",
  ],
];

export const QBR_DECISIONS_NEEDED = [
  "Confirm Q3 value realization.",
  "Align on two expansion candidates.",
  "Confirm executive priorities for Q4.",
  "Agree on next-quarter success measures.",
];

export const QBR_COACH: { question: string; answer: string[]; evidence: DetailSection[] }[] = [
  {
    question: "How did you calculate the $2.4M value?",
    answer: [
      "The $2.4M is composed of $1.3M support deflection, $680K request cycle-time reduction, and $420K automation efficiency.",
      "The first two are customer-confirmed from Acme's own reporting. The third was modeled from platform telemetry and validated by your value owner this quarter.",
    ],
    evidence: [
      {
        label: "Value components",
        items: [
          "$1.3M support deflection — confirmed from Acme case volumes",
          "$680K cycle-time reduction — confirmed from request throughput",
          "$420K automation efficiency — validated during QBR preparation",
        ],
      },
    ],
  },
  {
    question: "Why did adoption decline during the quarter?",
    answer: [
      "A deployment configuration change in week 4 disabled a strategic workflow for part of the primary deployment group, causing an 18% decline.",
      "The Adoption Agent detected the divergence one day after the change, and remediation completed in week 5.",
    ],
    evidence: [
      {
        label: "Root cause",
        items: [
          "Configuration change in the primary deployment group",
          "Detected one day after the change",
          "Remediation completed in week 5 by the TSM",
        ],
      },
    ],
  },
  {
    question: "Are we confident the recovery will continue?",
    answer: [
      "Yes. Adoption has held above target for four consecutive weeks, and the TSM has confirmed recovery stability with monitoring still active.",
      "The only remaining dependency is the Group B readiness assessment for expansion.",
    ],
    evidence: [
      {
        label: "Stability evidence",
        items: [
          "Four consecutive weeks above target",
          "No regression in affected workflows",
          "TSM validated recovery stability on Aug 10",
        ],
      },
    ],
  },
  {
    question: "Where should we invest next?",
    answer: [
      "Two additional business units are ready for strategic workflow expansion, representing approximately $1.1M in additional annual value.",
      "Automation efficiency is now the sponsor's higher priority, so the expansion should lead with automation outcomes rather than reporting modernization.",
    ],
    evidence: [
      {
        label: "Opportunity evidence",
        items: [
          "Group A prerequisites complete",
          "Group B readiness assessment due Thursday",
          "Validated efficiency gains support the value model",
        ],
      },
    ],
  },
];

/* ═════════ 06 · Lead the QBR (meeting mode) ═════════ */

export const QBR_MEETING_METRICS = [
  { value: "91%", label: "Strategic adoption" },
  { value: "4 / 4", label: "Success milestones" },
  { value: "$2.4M", label: "Value realized" },
  { value: "0", label: "Critical risks" },
];

export const QBR_MEETING_FOCUS = ["Goals", "Outcomes", "Value", "Decisions", "Next"];

export const QBR_NARRATIVE_FLOW = [
  {
    title: "What we set out to achieve",
    body: "Scale strategic workflow adoption across the enterprise while proving measurable operational value.",
  },
  {
    title: "What changed",
    body: "A mid-quarter configuration issue slowed adoption in the primary deployment group.",
  },
  {
    title: "What we accomplished together",
    body: "Joint technical response restored adoption and completed all four Q3 success milestones.",
  },
  {
    title: "What value was realized",
    body: "$2.4M in support deflection, cycle-time reduction, and automation efficiency.",
  },
  {
    title: "What we learned",
    body: "Early detection and coordinated response protected the milestone, and automation efficiency is where value compounds fastest.",
  },
  {
    title: "Where we can go next",
    body: "Two additional business units are ready to expand, with roughly $1.1M in additional annual value.",
  },
];

export const QBR_LIVE_QUESTION =
  "What happens if we expand this to the two additional business units?";

export const QBR_LIVE_ANSWER =
  "Based on Acme's current adoption trajectory, deployment velocity, and validated efficiency gains, expanding to the two identified groups could create approximately $1.1M in additional annual value. The primary dependency is completing the Group B readiness assessment.";

export const QBR_LIVE_OPPORTUNITY: Detail = {
  title: "Expansion opportunity · two business units",
  meta: "Opportunity Agent · Value Realization Agent",
  summary:
    "Approximately $1.1M additional annual value from extending strategic workflows to Groups A and B.",
  sections: [
    {
      label: "Basis",
      items: [
        "Validated Q3 efficiency gains applied to comparable user volumes",
        "Deployment velocity observed during wave 2",
        "Confirmed technical readiness for Group A",
      ],
    },
    {
      label: "Dependencies",
      items: [
        "Group B readiness assessment (Maya Chen · TSM, due Thursday)",
        "Commercial timing confirmation (Daniel Brooks · AE)",
      ],
    },
  ],
  confirm: "Add to Q4 success plan",
};

/* ═════════ 07 · Capture Outcomes ═════════ */

export const QBR_OUTCOME_COUNTS = [
  { value: "4", label: "Decisions" },
  { value: "6", label: "Commitments" },
  { value: "5", label: "Owners" },
  { value: "2", label: "Changed priorities" },
  { value: "3", label: "Next-quarter opportunities" },
];

export const QBR_INTERPRETED = [
  {
    kind: "Decision",
    body: "Proceed with expansion readiness for two additional business units.",
    meta: "Agreed with the executive sponsor",
  },
  {
    kind: "Commitment",
    body: "Complete technical readiness assessment by August 28.",
    meta: "Owner: Maya Chen · TSM",
  },
  {
    kind: "Customer priority changed",
    body: "Automation efficiency is now a higher executive priority than reporting modernization.",
    meta: "Captured from the sponsor's own words",
  },
  {
    kind: "Value opportunity",
    body: "Potential additional annual value: $1.1M",
    meta: "Opportunity Agent",
  },
];

export const QBR_CAPTURE_CONFIRMED = [
  "Success plan updated",
  "Customer context updated",
  "Team synchronized",
  "Commitments assigned",
  "Outcome monitoring activated",
  "Q4 planning started",
];

/* ═════════ 08 · Activate Next Quarter ═════════ */

export const Q4_PRIORITIES = [
  {
    title: "Expand strategic adoption",
    body: "Two additional business units.",
  },
  {
    title: "Capture the next value opportunity",
    body: "Potential: $1.1M annual value",
  },
  {
    title: "Strengthen executive alignment",
    body: "New Q4 priorities captured from the executive sponsor.",
  },
];

export const Q4_PLAN_SUMMARY = [
  { value: "3", label: "Outcomes" },
  { value: "5", label: "Milestones" },
  { value: "4", label: "Cross-functional contributors" },
  { value: "2", label: "Primary value measures" },
];

export const Q4_PLAN_DETAIL: Detail = {
  title: "Proposed Q4 Success Plan",
  meta: "Generated from QBR outcomes",
  summary:
    "Otto turned four QBR decisions and six commitments into a Q4 plan with owners, milestones, and value measures.",
  sections: [
    {
      label: "Outcomes",
      items: [
        "Strategic workflow adoption in Groups A and B",
        "Automation efficiency value confirmed quarterly",
        "Executive value reporting aligned to new sponsor priorities",
      ],
    },
    {
      label: "Milestones",
      items: [
        "Group B readiness assessment complete — Aug 28",
        "Group A enablement wave — Sep 19",
        "Group B enablement wave — Oct 17",
        "Automation efficiency baseline confirmed — Nov 7",
        "Q4 value review — Dec 5",
      ],
    },
    {
      label: "Contributors",
      items: [
        "Alex Rivera · CSM",
        "Maya Chen · TSM",
        "Daniel Brooks · AE",
        "Priya Raman · Customer Value Owner",
      ],
    },
  ],
  confirm: "Approve Q4 success plan",
};

export const QBR_CLOSING_BEFORE = "The CSM reconstructs the quarter to prepare the QBR.";
export const QBR_CLOSING_FUTURE =
  "The AI environment maintains the customer story continuously and transforms it into the next strategic conversation.";
