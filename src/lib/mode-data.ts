/* ═════════ Three Ways to Work — interaction modes ═════════
 * These describe HOW a person interacts with CSP on AINPX.
 * They are not products, personas or profiles — the same Otto,
 * the same agents and the same customer intelligence sit underneath.
 */

export type ModeId = "conversational" | "ui" | "hybrid";

export const WORK_MODES: { id: ModeId; label: string; blurb: string }[] = [
  {
    id: "conversational",
    label: "Conversational",
    blurb: "Ask for an outcome in natural language. Otto interprets, activates agents and prepares the work.",
  },
  {
    id: "ui",
    label: "UI-Driven",
    blurb: "Work directly through the structured interface. AI keeps monitoring, prioritising and recommending underneath.",
  },
  {
    id: "hybrid",
    label: "Hybrid",
    blurb: "Move fluidly between conversation and generated interface: ask, see, explore, question, refine, act.",
  },
];

export const MODE_BEHAVIOUR: Record<ModeId, string> = {
  conversational: "Otto is the primary control surface. Structured content is generated inside the conversation.",
  ui: "Otto is quieter. Intelligence appears as recommendations, indicators and next-best actions.",
  hybrid: "Otto and the interface share control. Either can expose evidence, refine the view or initiate action.",
};

/* ═════════ Per-moment mode scripts ═════════
 * Keyed `${pathId}-${momentId}`. Each moment can be demonstrated in all
 * three modes without changing the underlying story or data.
 */

export type GeneratedView = {
  title: string;
  note: string;
  metrics: { value: string; label: string }[];
  connection: string;
  actions: string[];
};

export type ModeScript = {
  ask: string;
  answer: string[];
  prompts: string[];
  uiHint: string;
  hybrid: string[];
  generated: GeneratedView;
};

const acmeContext = "Acme Corporation · Q3 · Strategic adoption";

export const MODE_CONTEXT_LINE: Record<string, string> = {
  "quarter-1": "Alex Rivera · CSM · 24 strategic accounts · Q3 week 6",
  "quarter-2": acmeContext,
  "quarter-3": "Acme Corporation · Coordinated response in progress",
  "quarter-4": "Acme Corporation · Tuesday executive check-in",
  "quarter-5": "Acme Corporation · Q3 value realised",
  "quarter-6": "Operating model · Leadership view",
  "quarter-7": "Today vs. future · Leadership view",
  "qbr-1": "Acme Corporation · Q3 Business Review · 11 days out",
  "qbr-2": "Acme Corporation · Value story",
  "qbr-3": "Acme Corporation · QBR readiness 78%",
  "qbr-4": "Acme Corporation · QBR coordination",
  "qbr-5": "Acme Corporation · Executive briefing",
  "qbr-6": "Acme Q3 Business Review · Meeting mode",
  "qbr-7": "Acme Corporation · QBR outcomes",
  "qbr-8": "Acme Corporation · Q4 success plan",
};

export const MODE_SCRIPTS: Record<string, ModeScript> = {
  "quarter-1": {
    ask: "What should I focus on today?",
    answer: [
      "Acme Corporation needs you first. Strategic adoption has declined 18% over three weeks and the Q3 milestone depends on it.",
      "Two other accounts need a decision this week, but neither is time-critical before Thursday.",
    ],
    prompts: [
      "What needs my attention?",
      "Prepare me for Acme",
      "Show accounts at risk",
      "Plan my week",
      "Get Acme's QBR ready",
    ],
    uiHint: "Review Where your attention matters, quarter progress and your open decisions directly.",
    hybrid: [
      "Otto identifies Acme as the account that needs you first.",
      "The environment then opens the Acme intelligence view so you can investigate without searching for it.",
    ],
    generated: {
      title: "Where your attention matters",
      note: "Assembled from 24 accounts, ranked by decision urgency",
      metrics: [
        { value: "1", label: "Account needs you today" },
        { value: "3", label: "Decisions this week" },
        { value: "18%", label: "Acme adoption decline" },
      ],
      connection:
        "Acme is first because adoption decline threatens a milestone you committed to with the executive sponsor.",
      actions: ["Open Acme intelligence", "Explore evidence", "Ask follow-up"],
    },
  },
  "quarter-2": {
    ask: "What changed with Acme?",
    answer: [
      "Strategic adoption fell from 84% to 68% in three weeks, concentrated in the workflows tied to the Q3 milestone.",
      "The decline started two days after a configuration change in the incident routing workflow, followed by a rise in support activity from the same team.",
    ],
    prompts: [
      "Why did this happen?",
      "Is this likely to affect the Q3 milestone?",
      "Who is affected?",
      "What should we do?",
    ],
    uiHint: "Select the adoption intelligence event and open the evidence behind it.",
    hybrid: [
      "Otto surfaces the signal, you open the evidence, then ask why it matters.",
      "The interface exposes the predicted milestone impact next to Otto's explanation.",
    ],
    generated: {
      title: "Adoption change and milestone impact",
      note: "Generated from adoption, configuration, support and milestone signals",
      metrics: [
        { value: "84% → 68%", label: "Strategic adoption" },
        { value: "3 weeks", label: "Decline window" },
        { value: "Sep 30", label: "Q3 milestone at risk" },
      ],
      connection:
        "A configuration change reduced workflow completion, support volume rose, and the milestone slipped from on-track to at-risk.",
      actions: ["Explore evidence", "Coordinate response", "Ask follow-up"],
    },
  },
  "quarter-3": {
    ask: "Coordinate the right team around this issue.",
    answer: [
      "Maya Chen (TSM) should validate the configuration change, Daniel Brooks (AE) should hold the expansion conversation until adoption recovers, and you keep the sponsor relationship.",
      "Each person receives the same customer context, so nobody has to be briefed manually.",
    ],
    prompts: [
      "Why should the AE be involved?",
      "What does the TSM need?",
      "What happens if we wait a week?",
      "Approve coordination",
    ],
    uiHint: "Select Coordinate response and review the recommended workstreams.",
    hybrid: [
      "Review Otto's recommendation in the interface, ask why each person is needed, then approve coordination.",
      "Approval creates the workstreams — it does not happen without your decision.",
    ],
    generated: {
      title: "Recommended coordination",
      note: "Role-aware: each contributor sees only what their role needs",
      metrics: [
        { value: "3", label: "Contributors" },
        { value: "0", label: "Manual handoffs" },
        { value: "48h", label: "Target to validate" },
      ],
      connection:
        "Technical validation, commercial timing and sponsor communication are the three moves that protect the milestone.",
      actions: ["Approve coordination", "Adjust contributors", "Ask why"],
    },
  },
  "quarter-4": {
    ask: "Prepare me for Tuesday's Acme meeting.",
    answer: [
      "Three decisions need the sponsor on Tuesday: the recovery plan, the timing of the expansion conversation, and confirmation of the Q3 milestone date.",
      "The briefing is built from the quarter's activity, so you are not reconstructing history the night before.",
    ],
    prompts: [
      "What will the sponsor push back on?",
      "What evidence supports recovery?",
      "Adjust the conversation plan",
      "What should I not raise?",
    ],
    uiHint: "Open the Customer Briefing and work through the recommended conversation flow.",
    hybrid: [
      "Otto generates the briefing, you expand evidence, ask questions, and adjust the conversation plan in place.",
      "Outcomes captured in the meeting flow back into the plan.",
    ],
    generated: {
      title: "Tuesday briefing",
      note: "Decision-first: what needs the sponsor, and why",
      metrics: [
        { value: "3", label: "Decisions needed" },
        { value: "5", label: "Evidence items" },
        { value: "12 min", label: "Recommended agenda" },
      ],
      connection:
        "The recovery plan is credible because adoption is already improving in the two teams that adopted the corrected configuration.",
      actions: ["Explore evidence", "Adjust plan", "Ask follow-up"],
    },
  },
  "quarter-5": {
    ask: "What value did we create for Acme this quarter?",
    answer: [
      "$2.4M in realised business value, adoption recovered from 68% to 91%, and the Q3 milestone was protected.",
      "Two expansion opportunities became credible because the recovery demonstrated operational trust.",
    ],
    prompts: [
      "Where should we focus next quarter?",
      "Compare adoption recovery with value realised",
      "What evidence is still unvalidated?",
      "Add this to the QBR",
    ],
    uiHint: "Open Customer Value and review the quarter's value progression and opportunities.",
    hybrid: [
      "Review the value metrics, then ask Otto where to focus next quarter.",
      "Otto highlights next-quarter opportunities directly inside the value view.",
    ],
    generated: {
      title: "Adoption recovery vs. value realised",
      note: "Assembled around your question",
      metrics: [
        { value: "68% → 91%", label: "Adoption recovery" },
        { value: "$2.4M", label: "Value realised" },
        { value: "2", label: "Expansion opportunities" },
      ],
      connection:
        "Recovery protected the Q3 milestone and enabled two additional expansion opportunities.",
      actions: ["Explore evidence", "Add to QBR", "Ask follow-up"],
    },
  },
  "quarter-6": {
    ask: "How does this environment actually work?",
    answer: [
      "People choose how they interact. Otto interprets intent, specialized agents do the continuous work, and the environment maintains awareness of system, workflow and role.",
    ],
    prompts: ["Show the operating model", "What do the agents do?", "What stays human?"],
    uiHint: "Review the operating model layers directly.",
    hybrid: ["Otto explains the model while the interface exposes each layer."],
    generated: {
      title: "Operating model",
      note: "Flexible interaction above, continuous intelligence underneath",
      metrics: [
        { value: "3", label: "Ways to work" },
        { value: "3", label: "Awarenesses" },
        { value: "10", label: "Specialized agents" },
      ],
      connection: "The modes describe how the person works. The awarenesses describe what the environment understands.",
      actions: ["Explore evidence", "Ask follow-up"],
    },
  },
  "quarter-7": {
    ask: "What changes for the CSM?",
    answer: [
      "The work moves from reconstructing context to exercising judgment. The environment prepares; the person decides.",
    ],
    prompts: ["What stays human?", "What does the CSM stop doing?"],
    uiHint: "Compare today with the future state directly.",
    hybrid: ["Otto narrates the shift while the comparison stays on screen."],
    generated: {
      title: "Today vs. future",
      note: "Same role, different work",
      metrics: [
        { value: "−60%", label: "Time reconstructing context" },
        { value: "3×", label: "Proactive interventions" },
        { value: "100%", label: "Decisions still human" },
      ],
      connection: "AI detects, analyses, recommends, prepares and coordinates. People decide.",
      actions: ["Ask follow-up"],
    },
  },
  "qbr-1": {
    ask: "Is Acme ready for its QBR?",
    answer: [
      "78% ready. Three outcomes are demonstrated and the value story holds, but $420K of value evidence is unvalidated and the executive priority is unconfirmed.",
    ],
    prompts: [
      "What is missing?",
      "Show QBR readiness",
      "What story should I tell?",
      "Get the team ready",
    ],
    uiHint: "Open QBR Readiness and review the indicators directly.",
    hybrid: [
      "Otto says readiness is 78%, then generates the readiness view so you can work the gaps.",
    ],
    generated: {
      title: "QBR readiness",
      note: "Continuously maintained, not assembled the week before",
      metrics: [
        { value: "78%", label: "Ready" },
        { value: "3", label: "Outcomes demonstrated" },
        { value: "11", label: "Days to review" },
      ],
      connection: "Readiness is low because value evidence is unvalidated, not because the story is weak.",
      actions: ["Close the gaps", "Explore evidence", "Ask follow-up"],
    },
  },
  "qbr-2": {
    ask: "What story should I tell?",
    answer: [
      "Three themes: operational recovery, protected milestone, and expansion readiness — each supported by evidence from the quarter.",
    ],
    prompts: ["Propose three themes", "Show the value story", "What evidence supports this?"],
    uiHint: "Open the Value Story and review the arc.",
    hybrid: ["Otto proposes three themes and generates an editable narrative structure."],
    generated: {
      title: "Proposed value story",
      note: "Editable narrative structure",
      metrics: [
        { value: "3", label: "Themes" },
        { value: "9", label: "Supporting evidence items" },
        { value: "$2.4M", label: "Value claimed" },
      ],
      connection: "Recovery earned the credibility that makes the expansion theme believable.",
      actions: ["Edit narrative", "Explore evidence", "Ask follow-up"],
    },
  },
  "qbr-3": {
    ask: "What is missing before this QBR is ready?",
    answer: [
      "$420K of value evidence is unvalidated because the finance-side baseline was never confirmed, the executive priority for Q4 is unconfirmed, and one commitment from last quarter is still open.",
    ],
    prompts: ["Why is the $420K unvalidated?", "Show readiness gaps", "Close the gaps"],
    uiHint: "Review the readiness gaps and open the evidence behind each one.",
    hybrid: [
      "Otto identifies the missing $420K validation; you open the evidence and ask why it is unvalidated.",
    ],
    generated: {
      title: "Readiness gaps",
      note: "Three gaps, each with an owner and a next step",
      metrics: [
        { value: "$420K", label: "Unvalidated value" },
        { value: "1", label: "Open commitment" },
        { value: "78% → 96%", label: "If gaps close" },
      ],
      connection: "Closing the validation gap is the single largest movement in readiness.",
      actions: ["Explore evidence", "Coordinate closure", "Ask why"],
    },
  },
  "qbr-4": {
    ask: "Get the team ready for the QBR.",
    answer: [
      "Maya validates the technical outcomes, Daniel confirms commercial context, and you own the narrative and the sponsor relationship.",
    ],
    prompts: ["Why is each person needed?", "Coordinate QBR preparation", "What do they receive?"],
    uiHint: "Select Coordinate QBR Preparation and review recommended contributors.",
    hybrid: [
      "Review recommended contributors, ask Otto why each person is needed, then approve.",
    ],
    generated: {
      title: "QBR contributors",
      note: "Role-aware requests, one shared customer context",
      metrics: [
        { value: "3", label: "Contributors" },
        { value: "4", label: "Requested inputs" },
        { value: "6 days", label: "Before the review" },
      ],
      connection: "Each contributor closes a specific readiness gap rather than attending a status meeting.",
      actions: ["Approve coordination", "Adjust contributors", "Ask why"],
    },
  },
  "qbr-5": {
    ask: "Prepare me for the Acme QBR.",
    answer: [
      "The briefing leads with the three decisions the sponsor needs to make, followed by the value evidence and the two likely challenges.",
    ],
    prompts: [
      "What will the sponsor challenge?",
      "Open executive briefing",
      "Show supporting evidence",
    ],
    uiHint: "Open the Executive Briefing and work through the conversation coach.",
    hybrid: ["Otto generates the briefing; you explore evidence and ask follow-up questions."],
    generated: {
      title: "Executive briefing",
      note: "Decision-first, evidence-backed",
      metrics: [
        { value: "3", label: "Decisions needed" },
        { value: "2", label: "Likely challenges" },
        { value: "$2.4M", label: "Value to present" },
      ],
      connection: "The sponsor's Q4 priority is unconfirmed, so the briefing opens with that question.",
      actions: ["Explore evidence", "Adjust briefing", "Ask follow-up"],
    },
  },
  "qbr-6": {
    ask: "What is the impact if we start the expansion in Q4?",
    answer: [
      "Two teams are already at 91% adoption, so a Q4 start is credible. Otto stays available for evidence and scenario questions without taking over the room.",
    ],
    prompts: ["Show the scenario", "What evidence supports this?", "Capture that as a decision"],
    uiHint: "Use the customer-facing Meeting Mode as the primary surface.",
    hybrid: [
      "Meeting Mode stays primary while Otto answers evidence and scenario questions contextually.",
    ],
    generated: {
      title: "Q4 expansion scenario",
      note: "Answered live, without leaving the review",
      metrics: [
        { value: "91%", label: "Adoption in pilot teams" },
        { value: "2", label: "Teams ready" },
        { value: "Q4", label: "Credible start" },
      ],
      connection: "Recovery evidence makes an earlier expansion start defensible to the sponsor.",
      actions: ["Capture decision", "Explore evidence"],
    },
  },
  "qbr-7": {
    ask: "What did we agree to?",
    answer: [
      "Four outcomes were captured: the Q4 priority, the expansion timing, the validation follow-up, and the sponsor's success criteria.",
    ],
    prompts: ["Summarise the outcomes", "What changed in the plan?", "Confirm outcomes"],
    uiHint: "Review the captured outcomes and confirm or adjust each one.",
    hybrid: [
      "Otto summarises, you edit and confirm through the interface, then ask what changed in the plan.",
    ],
    generated: {
      title: "Captured outcomes",
      note: "Interpreted from the conversation, confirmed by you",
      metrics: [
        { value: "4", label: "Outcomes captured" },
        { value: "3", label: "Plan changes" },
        { value: "0", label: "Manual notes required" },
      ],
      connection: "Every captured outcome maps to a Q4 plan item you can adjust before it becomes real.",
      actions: ["Confirm outcomes", "Adjust", "Ask what changed"],
    },
  },
  "qbr-8": {
    ask: "Build the starting point for Q4.",
    answer: [
      "The Q4 plan starts from the QBR decisions: expansion readiness, validation follow-through, and the sponsor's stated priority.",
    ],
    prompts: ["Review proposed Q4 plan", "Recalculate recommendations", "Adjust priorities"],
    uiHint: "Review the proposed Q4 Success Plan directly.",
    hybrid: [
      "Otto proposes the plan, you adjust priorities in the interface, then ask Otto to recalculate recommendations.",
    ],
    generated: {
      title: "Proposed Q4 success plan",
      note: "Continuity: the quarter starts where the review ended",
      metrics: [
        { value: "3", label: "Priorities" },
        { value: "4", label: "Carried commitments" },
        { value: "Day 1", label: "Plan ready" },
      ],
      connection: "Nothing is reconstructed — the plan inherits the quarter's evidence and the review's decisions.",
      actions: ["Adjust priorities", "Recalculate", "Ask follow-up"],
    },
  },
};

export const MODE_FALLBACK_ANSWER = [
  "Otto has the current account, role, quarter and workflow context, so it answers without you restating anything.",
  "In the leadership prototype, follow-up answers are illustrative — the interaction model is the point.",
];

/* Prompt-specific answers so every suggested question returns its own
 * substance rather than repeating the moment's headline answer. */
export const MODE_PROMPT_ANSWERS: Record<string, string[]> = {
  "How does this environment actually work?": [
    "Three layers. People choose how they interact, Otto interprets intent and orchestrates, and ten specialized agents do the continuous work underneath.",
    "Above all of it sits awareness: system, workflow and role — maintained continuously, not reconstructed per session.",
  ],
  "Show the operating model": [
    "Interaction layer: Conversational, UI-Driven and Hybrid — the person's choice, changeable mid-task.",
    "Orchestration layer: Otto interprets intent, selects agents, synthesizes findings into one recommendation.",
    "Intelligence layer: ten specialized agents monitoring adoption, deployment, support, value, relationship and risk signals continuously.",
  ],
  "What do the agents do?": [
    "Each agent owns a narrow domain and runs continuously — Adoption watches workflow-level usage, Deployment watches configuration and release history, Support reads ticket themes, Value links outcomes to committed objectives.",
    "They never present themselves to the user. They hand findings to Otto, which decides what is worth surfacing.",
    "For Acme this quarter, that is how an 18% adoption decline was traced to one configuration change in under a minute.",
  ],
  "What stays human?": [
    "Every decision that touches the customer. AI detects, analyses, recommends, prepares and coordinates — it does not commit.",
    "Nothing reaches Acme without explicit confirmation, and every recommendation can be traced back to the signal that produced it.",
    "Judgment, relationship and commercial framing remain the CSM's work — the environment just removes the reconstruction.",
  ],
  "What does the CSM stop doing?": [
    "Reconstructing context: pulling adoption exports, chasing the TSM for deployment history, rebuilding the quarter before every review.",
    "Roughly 60% of the time previously spent assembling the picture is returned to the customer conversation.",
  ],
};


/* ═════════ Leadership presentation content ═════════ */

export const MODES_MOMENTS = [
  { id: 1, label: "Three Ways to Work" },
  { id: 2, label: "Live Mode Sequence" },
  { id: 3, label: "Same Intelligence" },
  { id: 4, label: "Operating Model" },
];

export const MODES_X_AWARENESS = {
  modes: [
    { label: "Conversational", note: "Ask for an outcome" },
    { label: "UI-Driven", note: "Navigate and complete work" },
    { label: "Hybrid", note: "Move between both" },
  ],
  awarenesses: [
    { label: "System Awareness", question: "What is happening?" },
    { label: "Workflow Awareness", question: "Where are we in the work?" },
    { label: "Role Awareness", question: "Who needs what?" },
  ],
  note: "The modes describe how the person interacts. The awarenesses describe what the environment understands. They are different concepts and should never be conflated.",
};

export const SAME_INTELLIGENCE = {
  question: "Why is Acme at risk?",
  paths: [
    { mode: "Conversational", action: "Alex asks Otto." },
    { mode: "UI-Driven", action: "Alex opens the Acme risk." },
    { mode: "Hybrid", action: "Otto surfaces the risk and Alex investigates it directly." },
  ],
  shared: [
    "Customer context",
    "Adoption intelligence",
    "Risk analysis",
    "Workflow state",
    "Role context",
  ],
  takeaway: "Same intelligence. Different interaction.",
};

export const MODE_DEMO_SEQUENCE = [
  {
    mode: "conversational" as ModeId,
    label: "Conversational",
    line: "Alex: What should I focus on?",
    detail: "Otto identifies Acme — adoption has declined 18% and the Q3 milestone depends on it.",
  },
  {
    mode: "ui" as ModeId,
    label: "UI-Driven",
    line: "Open Acme → Adoption.",
    detail: "The structured view shows strategic adoption ↓18% with evidence available inline.",
  },
  {
    mode: "hybrid" as ModeId,
    label: "Hybrid",
    line: "Alex: Why does this matter?",
    detail:
      "Otto explains the Q3 milestone risk and dynamically exposes supporting evidence. Alex selects Coordinate response and Otto activates the right people and agents.",
  },
];

export const MODE_DEMO_CLOSE = "One environment. Three ways to work.";

export const SITUATIONAL_MODE = [
  { when: "Morning", mode: "Conversational", what: "What should I focus on?" },
  { when: "During investigation", mode: "UI-Driven", what: "Review technical evidence." },
  { when: "During preparation", mode: "Hybrid", what: "Prepare the QBR, then refine it interactively." },
];

export const OPERATING_MODEL_FULL = [
  { layer: "People", items: ["CSM", "TSM", "AE", "Support", "Services", "BPC"] },
  { layer: "Three Ways to Work", items: ["Conversational", "UI-Driven", "Hybrid"] },
  { layer: "Otto", items: ["Understanding", "Interaction", "Orchestration"] },
  {
    layer: "Specialized Agents",
    items: ["Monitoring", "Analysis", "Preparation", "Coordination", "Action"],
  },
  { layer: "Three Awarenesses", items: ["System", "Workflow", "Role"] },
  {
    layer: "Customer Success Intelligence",
    items: ["Customer", "Product", "Value", "Workflow", "Knowledge", "Communication", "History"],
  },
];

export const HUMAN_CONTROL_STATES = ["Review", "Approve", "Confirm", "Adjust", "Dismiss", "Ask why"];

export const CLOSING_MESSAGE = {
  headline: "AI-native does not mean conversation-only.",
  support:
    "CSP on AINPX adapts to how people want to work while maintaining the same intelligence, context and orchestration underneath.",
  lines: [
    "Ask when conversation is fastest.",
    "Navigate when direct interaction is clearest.",
    "Combine both when the work requires exploration and judgment.",
  ],
  close: "One environment. Three ways to work.",
};

/* ═════════ Chip → response resolution ═════════
 * Every suggested chip must change what is on screen: its own answer lines
 * AND its own generated view. Intent is classified from the chip text so the
 * behaviour is consistent across every path, moment and mode.
 */

type PromptIntent = {
  id: string;
  match: RegExp;
  title: (base: string) => string;
  note: string;
  lead: string[];
  metric: { value: string; label: string };
  connection: string;
  actions: string[];
};

const PROMPT_INTENTS: PromptIntent[] = [
  {
    id: "evidence",
    match: /evidence|why|how (do|does|did) (you|otto)|confiden|prove|source/i,
    title: (b) => `${b} · evidence chain`,
    note: "Every claim traced back to the signal that produced it",
    lead: [
      "Here is the signal chain, not a summary: each figure below is linked to the agent and system that produced it.",
      "Four agents corroborated this independently, so the conclusion does not rest on a single source.",
    ],
    metric: { value: "4", label: "Agents corroborating" },
    connection: "Nothing here is inferred without a traceable source — you can open any figure to see it.",
    actions: ["Open source records", "Share evidence"],
  },
  {
    id: "scenario",
    match: /scenario|what if|impact|forecast|model|project/i,
    title: (b) => `${b} · scenario view`,
    note: "Modelled from current signals, not a static template",
    lead: [
      "I modelled the scenario against live adoption, deployment and support signals rather than a fixed assumption set.",
      "The downside case moves the milestone by roughly two weeks; the recommended case holds the committed date.",
    ],
    metric: { value: "2 wks", label: "Downside milestone slip" },
    connection: "The scenario stays live — if the underlying signals move, this view recalculates.",
    actions: ["Compare cases", "Capture as decision"],
  },
  {
    id: "capture",
    match: /capture|confirm|approve|commit|log|record/i,
    title: (b) => `${b} · ready to confirm`,
    note: "Prepared by Otto, committed only by you",
    lead: [
      "Prepared and staged — nothing reaches the customer or the plan until you confirm it.",
      "I have written the interpretation into the shared account context so the TSM and AE see the same record.",
    ],
    metric: { value: "0", label: "Actions taken without you" },
    connection: "Confirmation is the human boundary: AI prepares, you decide what becomes real.",
    actions: ["Confirm", "Adjust before confirming"],
  },
  {
    id: "adjust",
    match: /adjust|recalculat|refine|change|re-?prioriti|edit|update/i,
    title: (b) => `${b} · recalculated`,
    note: "Recalculated against your adjustment",
    lead: [
      "Recalculated. Your adjustment propagated to the dependent milestones, owners and recommendations.",
      "Nothing else in the quarter had to be restated — the environment kept the surrounding context.",
    ],
    metric: { value: "3", label: "Dependent items updated" },
    connection: "Adjustments are cheap here because the context is continuous rather than rebuilt per session.",
    actions: ["Apply changes", "Revert"],
  },
  {
    id: "summarise",
    match: /summari|recap|what did|overview|brief/i,
    title: (b) => `${b} · summary`,
    note: "Assembled from the full quarter of activity",
    lead: [
      "Here is the short version, assembled from the whole quarter rather than the last conversation.",
      "The detail stays one click away — the summary is a view, not a replacement for the record.",
    ],
    metric: { value: "Q3", label: "Full period covered" },
    connection: "Because the record is continuous, the summary needs no manual reconstruction.",
    actions: ["Open full detail", "Send summary"],
  },
  {
    id: "coordinate",
    match: /coordinat|notify|hand off|hand-off|assign|involve|loop in|route/i,
    title: (b) => `${b} · coordination`,
    note: "Shared context passed with the work, not re-explained",
    lead: [
      "Routed with the full context attached — the receiving role opens directly into the same evidence.",
      "No hand-off document, no re-explanation, no separate thread to reconcile later.",
    ],
    metric: { value: "3", label: "Roles on one context" },
    connection: "Cross-role work is the same record seen from different responsibilities.",
    actions: ["Notify owners", "View shared context"],
  },
  {
    id: "prepare",
    match: /prepare|prep|agenda|meeting|deck|briefing|talk track/i,
    title: (b) => `${b} · prepared материал`,
    note: "Decision-first preparation, not a slide dump",
    lead: [
      "Prepared as decisions to be made, with the supporting evidence behind each one.",
      "I also drafted answers to the questions this sponsor is most likely to raise.",
    ],
    metric: { value: "3", label: "Likely questions answered" },
    connection: "Preparation time collapses because the quarter never had to be reassembled.",
    actions: ["Open briefing", "Adjust agenda"],
  },
  {
    id: "value",
    match: /value|outcome|roi|realiz|realis|business case|expansion|opportunit/i,
    title: (b) => `${b} · value view`,
    note: "Outcomes linked to the customer's committed objectives",
    lead: [
      "Framed against the objectives the customer committed to, not against product usage for its own sake.",
      "Each outcome carries the evidence that makes it defensible in front of the sponsor.",
    ],
    metric: { value: "$2.4M", label: "Value realized to date" },
    connection: "Value is maintained continuously, so it is current on any day of the quarter.",
    actions: ["Open value story", "Share with sponsor"],
  },
  {
    id: "risk",
    match: /risk|exposure|slip|churn|blocker|gap/i,
    title: (b) => `${b} · risk view`,
    note: "Ranked by business exposure, not alert volume",
    lead: [
      "Ranked by what is genuinely exposed — business impact first, technical noise filtered out.",
      "Each item carries the mitigation that would remove it and who would own that work.",
    ],
    metric: { value: "1", label: "Material risk remaining" },
    connection: "Direction changes are surfaced while they are still recoverable.",
    actions: ["Open mitigation plan", "Escalate"],
  },
  {
    id: "show",
    match: /show|open|view|see|review|walk me/i,
    title: (b) => `${b} · detail view`,
    note: "Assembled around what you asked to see",
    lead: [
      "Assembled around that specific question — this view exists because you asked for it, not because someone built a page for it.",
      "You can keep questioning it, or act directly from here.",
    ],
    metric: { value: "Live", label: "Signals behind this view" },
    connection: "The interface follows the question instead of the question following the interface.",
    actions: ["Go deeper", "Act from here"],
  },
];

function intentFor(question: string): PromptIntent | undefined {
  return PROMPT_INTENTS.find((i) => i.match.test(question));
}

/** Distinct answer lines + distinct generated data for any chip or typed question. */
export function promptResponse(
  script: ModeScript,
  question: string,
): { lines: string[]; generated: GeneratedView } {
  const q = question.trim();
  const specific = MODE_PROMPT_ANSWERS[q];
  if (specific) {
    return {
      lines: specific,
      generated: {
        ...script.generated,
        title: q.replace(/[?.]$/, ""),
        note: "Assembled around your question",
      },
    };
  }

  if (q.toLowerCase() === script.ask.toLowerCase()) {
    return { lines: script.answer, generated: script.generated };
  }

  const intent = intentFor(q);
  if (!intent) {
    return {
      lines: [...script.answer, ...MODE_FALLBACK_ANSWER.slice(0, 1)],
      generated: { ...script.generated, title: q.replace(/[?.]$/, "") },
    };
  }

  const base = script.generated;
  return {
    lines: [`${q.replace(/[?.]$/, "")} — ${intent.lead[0]}`, ...intent.lead.slice(1)],
    generated: {
      title: intent.title(base.title),
      note: intent.note,
      metrics: [intent.metric, ...base.metrics.slice(0, 2)],
      connection: intent.connection,
      actions: intent.actions,
    },
  };
}
