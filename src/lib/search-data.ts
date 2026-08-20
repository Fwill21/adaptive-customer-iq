/* Search is a real surface in this experience: every suggestion and every
 * custom query resolves to a destination AND to a distinct result payload that
 * the page renders, so selecting different criteria visibly changes content. */

export type SearchDest = { path: "quarter" | "qbr" | "modes"; step: number };

export type SearchResultData = {
  query: string;
  target: string;
  title: string;
  summary: string;
  facts: { label: string; value: string }[];
  sources: string[];
};

export type SearchEntry = {
  label: string;
  group: string;
  hint: string;
  target: string;
  dest: SearchDest;
  result: Omit<SearchResultData, "query">;
};

export const SEARCH_INDEX: SearchEntry[] = [
  {
    label: "Acme Corporation",
    group: "Accounts",
    hint: "Strategic Enterprise · Q3 in motion",
    target: "Acme Corporation",
    dest: { path: "quarter", step: 1 },
    result: {
      target: "Acme Corporation",
      title: "Acme Corporation — account workspace",
      summary:
        "Strategic Enterprise account, $2.4M ACV, renewal in 148 days. Adoption trajectory is the live risk; value delivery is ahead of plan.",
      facts: [
        { label: "Health", value: "At risk · 62" },
        { label: "ACV", value: "$2.4M" },
        { label: "Open situations", value: "3" },
        { label: "Owner", value: "Alex Rivera · CSM" },
      ],
      sources: ["Adoption agent", "Deployment agent", "Renewal agent"],
    },
  },
  {
    label: "Globex Industries",
    group: "Accounts",
    hint: "Enterprise · healthy adoption",
    target: "Portfolio",
    dest: { path: "quarter", step: 0 },
    result: {
      target: "Portfolio",
      title: "Globex Industries — healthy, no action needed",
      summary:
        "Adoption is above benchmark across all three deployed workflows. Otto keeps this account out of your queue this week.",
      facts: [
        { label: "Health", value: "Healthy · 88" },
        { label: "ACV", value: "$1.1M" },
        { label: "Open situations", value: "0" },
        { label: "Next touch", value: "Quarterly check-in · 6 weeks" },
      ],
      sources: ["Adoption agent", "Sentiment agent"],
    },
  },
  {
    label: "Contoso Group",
    group: "Accounts",
    hint: "Enterprise · renewal in 90 days",
    target: "Portfolio",
    dest: { path: "quarter", step: 0 },
    result: {
      target: "Portfolio",
      title: "Contoso Group — renewal window open",
      summary:
        "Renewal is 90 days out with two objectives unproven. Otto recommends starting the value narrative now, not at day 30.",
      facts: [
        { label: "Health", value: "Watch · 74" },
        { label: "ACV", value: "$860K" },
        { label: "Renewal", value: "90 days" },
        { label: "Unproven objectives", value: "2 of 5" },
      ],
      sources: ["Renewal agent", "Value agent", "Success plan agent"],
    },
  },
  {
    label: "Acme adoption trajectory",
    group: "Signals",
    hint: "Adoption declined 18% since week 6",
    target: "Customer Activity",
    dest: { path: "quarter", step: 1 },
    result: {
      target: "Customer Activity",
      title: "Adoption trajectory — 18% decline since week 6",
      summary:
        "Weekly active usage in Wave 2 workflows fell after a configuration change on day 41. The decline is concentrated in two teams, not account-wide.",
      facts: [
        { label: "Change", value: "−18% since week 6" },
        { label: "Onset", value: "Day 41 · config change" },
        { label: "Scope", value: "2 of 7 teams" },
        { label: "Confidence", value: "High" },
      ],
      sources: ["Adoption agent", "Deployment agent", "Telemetry"],
    },
  },
  {
    label: "Wave 2 rollout milestone",
    group: "Signals",
    hint: "Deployment history and configuration change",
    target: "Success Plan",
    dest: { path: "quarter", step: 2 },
    result: {
      target: "Success Plan",
      title: "Wave 2 rollout — milestone at risk",
      summary:
        "Wave 2 go-live is 11 days out with one blocking configuration issue. TSM owns remediation; CSM owns the customer conversation.",
      facts: [
        { label: "Milestone", value: "Wave 2 go-live" },
        { label: "Due", value: "In 11 days" },
        { label: "Blocker", value: "Approval rule misconfig" },
        { label: "Owner", value: "Maya Chen · TSM" },
      ],
      sources: ["Deployment agent", "Enablement agent"],
    },
  },
  {
    label: "Q3 value realized",
    group: "Value",
    hint: "Outcomes linked to committed objectives",
    target: "Value",
    dest: { path: "quarter", step: 4 },
    result: {
      target: "Value",
      title: "Q3 value realized — $4.1M against committed objectives",
      summary:
        "Four of five committed objectives are proven with linked evidence. One remains unproven and shapes the renewal conversation.",
      facts: [
        { label: "Value realized", value: "$4.1M" },
        { label: "Objectives proven", value: "4 of 5" },
        { label: "Cycle time", value: "−31%" },
        { label: "Evidence links", value: "18" },
      ],
      sources: ["Value agent", "Outcome agent", "Success plan agent"],
    },
  },
  {
    label: "Success plan — Acme",
    group: "Success Plans",
    hint: "Objectives, owners and next actions",
    target: "Success Plan",
    dest: { path: "quarter", step: 2 },
    result: {
      target: "Success Plan",
      title: "Acme success plan — 5 objectives, 3 owners",
      summary:
        "Plan is current as of today. Two objectives need a cross-role move this week; Otto has drafted both coordination requests.",
      facts: [
        { label: "Objectives", value: "5" },
        { label: "On track", value: "3" },
        { label: "Needs action", value: "2" },
        { label: "Roles engaged", value: "CSM · TSM · AE" },
      ],
      sources: ["Success plan agent", "Coordination agent"],
    },
  },
  {
    label: "Executive briefing",
    group: "Meetings",
    hint: "Decision-first prep for the next review",
    target: "Meetings",
    dest: { path: "quarter", step: 3 },
    result: {
      target: "Meetings",
      title: "Executive briefing — ready for Thursday",
      summary:
        "Otto assembled a decision-first briefing: three decisions to land, the evidence behind each, and the two risks the customer will raise.",
      facts: [
        { label: "Meeting", value: "Thursday · 45 min" },
        { label: "Decisions to land", value: "3" },
        { label: "Anticipated objections", value: "2" },
        { label: "Prep time saved", value: "~4 hours" },
      ],
      sources: ["Briefing agent", "Value agent", "Sentiment agent"],
    },
  },
  {
    label: "QBR readiness",
    group: "Meetings",
    hint: "AI-Native QBR readiness score and gaps",
    target: "QBR readiness",
    dest: { path: "qbr", step: 0 },
    result: {
      target: "QBR readiness",
      title: "QBR readiness — 78, two gaps to close",
      summary:
        "The quarterly review is 14 days out. Story spine is assembled; two evidence gaps remain before the narrative is customer-ready.",
      facts: [
        { label: "Readiness", value: "78 / 100" },
        { label: "Review date", value: "In 14 days" },
        { label: "Evidence gaps", value: "2" },
        { label: "Story arcs ready", value: "3 of 4" },
      ],
      sources: ["QBR agent", "Value agent", "Outcome agent"],
    },
  },
  {
    label: "What needs my attention this week?",
    group: "Ask Otto",
    hint: "Prioritized situations across the portfolio",
    target: "Home",
    dest: { path: "quarter", step: 0 },
    result: {
      target: "Home",
      title: "Three situations need you this week",
      summary:
        "Otto ranked the portfolio by revenue exposure and time sensitivity. Everything else is handled or on track.",
      facts: [
        { label: "Situations", value: "3 of 14 accounts" },
        { label: "Revenue exposed", value: "$3.4M" },
        { label: "Time-critical", value: "1 · Acme" },
        { label: "Handled by agents", value: "9 items" },
      ],
      sources: ["Otto orchestrator", "Adoption agent", "Renewal agent"],
    },
  },
  {
    label: "Which accounts are at risk?",
    group: "Ask Otto",
    hint: "Risk signals ranked by revenue exposure",
    target: "Home",
    dest: { path: "quarter", step: 0 },
    result: {
      target: "Home",
      title: "Two accounts at risk, ranked by exposure",
      summary:
        "Acme leads on adoption decline; Contoso follows on unproven objectives inside an open renewal window.",
      facts: [
        { label: "At risk", value: "Acme · Contoso" },
        { label: "Exposure", value: "$3.26M ACV" },
        { label: "Primary driver", value: "Adoption decline" },
        { label: "Recommended moves", value: "4" },
      ],
      sources: ["Risk agent", "Adoption agent", "Renewal agent"],
    },
  },
  {
    label: "How does this environment actually work?",
    group: "Ask Otto",
    hint: "The operating model and the three awarenesses",
    target: "Insights",
    dest: { path: "quarter", step: 5 },
    result: {
      target: "Insights",
      title: "The operating model behind every answer",
      summary:
        "Otto orchestrates ten specialized agents over system, workflow and role awareness. People keep judgment, relationship and commitment.",
      facts: [
        { label: "Orchestrator", value: "Otto" },
        { label: "Specialized agents", value: "10" },
        { label: "Awarenesses", value: "System · Workflow · Role" },
        { label: "Human-owned", value: "Judgment · commitments" },
      ],
      sources: ["Operating model", "Agent registry"],
    },
  },
  {
    label: "Three ways to work",
    group: "Ask Otto",
    hint: "Conversational, UI-driven and hybrid modes",
    target: "Insights",
    dest: { path: "modes", step: 0 },
    result: {
      target: "Insights",
      title: "Same intelligence, three ways to work",
      summary:
        "Conversational, UI-driven and hybrid modes all read the same account context and the same agent outputs — only the surface changes.",
      facts: [
        { label: "Modes", value: "3" },
        { label: "Shared context", value: "Acme · Q3" },
        { label: "Shared agents", value: "10" },
        { label: "Switch cost", value: "None — context persists" },
      ],
      sources: ["Operating model", "Otto orchestrator"],
    },
  },
];

/* A custom query still has to land somewhere real and still has to change the
 * page — keyword routing maps free text to a destination and a result. */
type CustomRoute = {
  keys: string[];
  target: string;
  hint: string;
  dest: SearchDest;
  title: string;
  summary: string;
  facts: { label: string; value: string }[];
  sources: string[];
};

const CUSTOM_ROUTES: CustomRoute[] = [
  {
    keys: ["value", "roi", "outcome", "impact", "worth"],
    target: "Value",
    hint: "Strategic value and realized outcomes",
    dest: { path: "quarter", step: 4 },
    title: "Value view assembled for your query",
    summary:
      "Otto interpreted this as a value question and assembled realized outcomes linked to committed objectives.",
    facts: [
      { label: "Value realized", value: "$4.1M" },
      { label: "Objectives proven", value: "4 of 5" },
      { label: "Evidence links", value: "18" },
      { label: "Confidence", value: "High" },
    ],
    sources: ["Value agent", "Outcome agent"],
  },
  {
    keys: ["risk", "churn", "adoption", "signal", "decline", "usage", "attention"],
    target: "Customer Activity",
    hint: "Signals and adoption trajectory",
    dest: { path: "quarter", step: 1 },
    title: "Signal view assembled for your query",
    summary:
      "Otto interpreted this as a risk question and surfaced the adoption signals driving exposure right now.",
    facts: [
      { label: "Accounts flagged", value: "2" },
      { label: "Exposure", value: "$3.26M" },
      { label: "Lead signal", value: "−18% adoption · Acme" },
      { label: "Onset", value: "Day 41 · config change" },
    ],
    sources: ["Risk agent", "Adoption agent"],
  },
  {
    keys: ["plan", "objective", "milestone", "owner", "task"],
    target: "Success Plan",
    hint: "Success plan objectives and owners",
    dest: { path: "quarter", step: 2 },
    title: "Success plan view assembled for your query",
    summary:
      "Otto interpreted this as a planning question and pulled objectives, owners and the next cross-role moves.",
    facts: [
      { label: "Objectives", value: "5" },
      { label: "Needs action", value: "2" },
      { label: "Roles engaged", value: "CSM · TSM · AE" },
      { label: "Drafted requests", value: "2" },
    ],
    sources: ["Success plan agent", "Coordination agent"],
  },
  {
    keys: ["meeting", "qbr", "brief", "review", "exec", "prep"],
    target: "Meetings",
    hint: "Executive briefing and meeting prep",
    dest: { path: "quarter", step: 3 },
    title: "Meeting prep assembled for your query",
    summary:
      "Otto interpreted this as a meeting question and assembled a decision-first briefing with supporting evidence.",
    facts: [
      { label: "Decisions to land", value: "3" },
      { label: "Objections anticipated", value: "2" },
      { label: "Prep time saved", value: "~4 hours" },
      { label: "Owner", value: "Alex Rivera · CSM" },
    ],
    sources: ["Briefing agent", "Value agent"],
  },
  {
    keys: ["account", "acme", "globex", "contoso", "customer", "portfolio"],
    target: "Acme Corporation",
    hint: "Account workspace",
    dest: { path: "quarter", step: 1 },
    title: "Account view assembled for your query",
    summary:
      "Otto interpreted this as an account question and opened the workspace with live situations and history.",
    facts: [
      { label: "Account", value: "Acme Corporation" },
      { label: "Health", value: "At risk · 62" },
      { label: "ACV", value: "$2.4M" },
      { label: "Open situations", value: "3" },
    ],
    sources: ["Adoption agent", "Deployment agent"],
  },
  {
    keys: ["agent", "otto", "architecture", "model", "awareness", "insight", "mode"],
    target: "Insights",
    hint: "Operating model and agent intelligence",
    dest: { path: "quarter", step: 5 },
    title: "Operating model assembled for your query",
    summary:
      "Otto interpreted this as an architecture question and surfaced the orchestration model behind every answer.",
    facts: [
      { label: "Orchestrator", value: "Otto" },
      { label: "Specialized agents", value: "10" },
      { label: "Awarenesses", value: "System · Workflow · Role" },
      { label: "Human-owned", value: "Judgment · commitments" },
    ],
    sources: ["Operating model", "Agent registry"],
  },
];

const FALLBACK: CustomRoute = {
  keys: [],
  target: "Home",
  hint: "Prioritized situations across the portfolio",
  dest: { path: "quarter", step: 0 },
  title: "Otto routed this to your prioritized queue",
  summary:
    "No exact entity matched, so Otto answered from the portfolio: what needs attention, ranked by exposure.",
  facts: [
    { label: "Situations", value: "3 of 14 accounts" },
    { label: "Revenue exposed", value: "$3.4M" },
    { label: "Time-critical", value: "1 · Acme" },
    { label: "Handled by agents", value: "9 items" },
  ],
  sources: ["Otto orchestrator"],
};

export function resolveCustom(query: string) {
  const q = query.trim().toLowerCase();
  return CUSTOM_ROUTES.find((r) => r.keys.some((k) => q.includes(k))) ?? FALLBACK;
}

/* Everything a search — suggestion or free text — produces. */
export function searchResultFor(query: string, entry: SearchEntry | null) {
  if (entry) {
    return { dest: entry.dest, result: { query, ...entry.result } };
  }
  const r = resolveCustom(query);
  return {
    dest: r.dest,
    result: {
      query,
      target: r.target,
      title: r.title,
      summary: r.summary,
      facts: r.facts,
      sources: r.sources,
    } satisfies SearchResultData,
  };
}
