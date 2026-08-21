/* What Otto puts on the page when someone picks a suggestion chip — or types
 * their own question — in the Good morning workspace. Each focus rewrites the
 * attention queue, the priority framing and the supporting metrics, so every
 * chip visibly changes the content below it. */

export type FocusItem = {
  account: string;
  kind: string;
  tone: "quiet" | "risk" | "attention" | "positive";
  detail: string;
  impact: string;
  action: string;
};

export type OttoFocus = {
  id: string;
  eyebrow: string;
  headline: string;
  listMeta: string;
  listTitle: string;
  lead: string;
  items: FocusItem[];
  metrics: { label: string; value: string; note: string }[];
  metricsMeta: string;
  metricsTitle: string;
};

const PORTFOLIO: OttoFocus = {
  id: "portfolio",
  eyebrow: "Portfolio triage",
  headline: "Three accounts need you this week",
  listMeta: "Otto · ranked by impact",
  listTitle: "This week's attention queue",
  lead: "I ranked the portfolio by revenue at risk against time to the next customer moment. Acme leads because an adoption decline lands four days before an executive check-in.",
  items: [
    {
      account: "Acme Corporation",
      kind: "Highest priority",
      tone: "risk",
      detail: "Strategic workflow adoption down 18% since release 24.3 deployed.",
      impact: "$1.2M renewal evidence and the Q3 adoption milestone",
      action: "Review the situation",
    },
    {
      account: "Globex International",
      kind: "Needs outreach",
      tone: "attention",
      detail: "Executive sponsor has not engaged in 46 days; renewal cycle opens Friday.",
      impact: "Sponsor coverage for a $890K renewal",
      action: "Draft sponsor outreach",
    },
    {
      account: "Contoso Ltd",
      kind: "Ahead of plan",
      tone: "positive",
      detail: "Adoption milestone reached two weeks early across all three regions.",
      impact: "Reference story and $640K expansion opening",
      action: "Capture the win",
    },
  ],
  metricsMeta: "Otto · portfolio",
  metricsTitle: "What sits behind the ranking",
  metrics: [
    { label: "Accounts scanned", value: "24", note: "Every account you own, refreshed 06:15" },
    { label: "Needing action", value: "3", note: "Above the impact threshold this week" },
    { label: "Revenue in play", value: "$2.7M", note: "Combined renewal and expansion value" },
  ],
};

const WHY_DECLINE: OttoFocus = {
  id: "diagnosis",
  eyebrow: "Root cause",
  headline: "The decline traces to one configuration change",
  listMeta: "Otto · evidence chain",
  listTitle: "Why adoption diverged",
  lead: "Adoption separated from target in week 4, one day after the release 24.3 deployment. Four agents corroborated the same window independently.",
  items: [
    {
      account: "Deployment agent",
      kind: "Trigger",
      tone: "risk",
      detail: "Assignment rule scoped to the wrong group in the release 24.3 change.",
      impact: "Wave-2 users lost their routing path",
      action: "Open the configuration diff",
    },
    {
      account: "Adoption agent",
      kind: "Signal",
      tone: "attention",
      detail: "Wave-2 weekly active use fell 31% while wave 1 stayed flat.",
      impact: "Explains the account-level 18% drop",
      action: "See the cohort split",
    },
    {
      account: "Support agent",
      kind: "Corroboration",
      tone: "quiet",
      detail: "Three cases opened in the same 48 hours, all describing missing assignments.",
      impact: "Confirms timing and user population",
      action: "Read the cases",
    },
  ],
  metricsMeta: "Otto · confidence",
  metricsTitle: "How sure I am",
  metrics: [
    { label: "Confidence", value: "High", note: "Four independent agent signals agree" },
    { label: "Onset", value: "Week 4", note: "One day after the 24.3 deployment" },
    { label: "Prior occurrences", value: "2", note: "Q4 2024 and Q2 2025, both config-driven" },
  ],
};

const PREPARE: OttoFocus = {
  id: "prepare",
  eyebrow: "Meeting readiness",
  headline: "Your Tuesday briefing is assembled",
  listMeta: "Otto · briefing",
  listTitle: "What to walk in with",
  lead: "Root cause is confirmed and remediation is validated. Here is the narrative, the likely questions and the one decision the customer needs from you.",
  items: [
    {
      account: "Open with the resolution",
      kind: "Narrative",
      tone: "positive",
      detail: "Cause identified, fix applied and validated, adoption recovering since week 6.",
      impact: "Sets the tone before the metric is discussed",
      action: "Review the briefing",
    },
    {
      account: "Expected questions",
      kind: "Prepared",
      tone: "attention",
      detail: "Milestone timing, whether other groups are exposed, and change-control safeguards.",
      impact: "Answers drafted with supporting evidence",
      action: "See drafted answers",
    },
    {
      account: "Decision to land",
      kind: "Ask",
      tone: "quiet",
      detail: "Move the Q3 adoption milestone two weeks and keep the Q4 expansion review in place.",
      impact: "Protects the expansion evidence base",
      action: "Confirm the ask",
    },
  ],
  metricsMeta: "Otto · readiness",
  metricsTitle: "Briefing readiness",
  metrics: [
    { label: "Briefing", value: "Ready", note: "Assembled 06:15, refreshed on new signals" },
    { label: "Attendees", value: "5", note: "Two executives, three operational owners" },
    { label: "Open risks", value: "1", note: "Milestone date needs customer agreement" },
  ],
};

const VALUE: OttoFocus = {
  id: "value",
  eyebrow: "Value realized",
  headline: "$2.4M of realized value this quarter",
  listMeta: "Otto · value evidence",
  listTitle: "Where the value came from",
  lead: "Every figure traces to a measured outcome rather than a projection. Four of four success milestones are complete.",
  items: [
    {
      account: "Case resolution time",
      kind: "Measured",
      tone: "positive",
      detail: "Down 34% year over year across 18,400 cases.",
      impact: "$1.1M in avoided handling cost",
      action: "Trace the calculation",
    },
    {
      account: "Deflection through self-service",
      kind: "Measured",
      tone: "positive",
      detail: "22% of volume resolved before reaching an agent.",
      impact: "$820K in capacity returned",
      action: "See the evidence",
    },
    {
      account: "Automation coverage",
      kind: "Measured",
      tone: "quiet",
      detail: "Six workflows automated end to end since April.",
      impact: "$480K in recovered analyst hours",
      action: "Open the breakdown",
    },
  ],
  metricsMeta: "Otto · Q3",
  metricsTitle: "Quarter summary",
  metrics: [
    { label: "Realized value", value: "$2.4M", note: "Traceable to measured outcomes" },
    { label: "Milestones", value: "4 of 4", note: "All Q3 success plan commitments met" },
    { label: "Next-quarter upside", value: "$1.75M", note: "Three qualified opportunities" },
  ],
};

const RISK: OttoFocus = {
  id: "risk",
  eyebrow: "Risk view",
  headline: "Where the portfolio is exposed",
  listMeta: "Otto · risk",
  listTitle: "Exposure ranked by revenue",
  lead: "I re-ranked the portfolio by renewal exposure rather than by activity, so the largest financial risk sits at the top.",
  items: [
    {
      account: "Acme Corporation",
      kind: "Active risk",
      tone: "risk",
      detail: "Adoption evidence weakened four days before an executive check-in.",
      impact: "$1.2M renewal narrative",
      action: "Review the situation",
    },
    {
      account: "Globex International",
      kind: "Emerging risk",
      tone: "attention",
      detail: "Sponsor silent for 46 days with no succession identified.",
      impact: "$890K renewal without an executive advocate",
      action: "Draft sponsor outreach",
    },
    {
      account: "Portfolio watchlist",
      kind: "Monitored",
      tone: "quiet",
      detail: "Four accounts show early usage softening but stay inside tolerance.",
      impact: "No action required this week",
      action: "See the watchlist",
    },
  ],
  metricsMeta: "Otto · exposure",
  metricsTitle: "Exposure summary",
  metrics: [
    { label: "At-risk ARR", value: "$2.1M", note: "Across two named accounts" },
    { label: "Days to next moment", value: "4", note: "Acme executive check-in" },
    { label: "Watchlist", value: "4", note: "Monitored, no intervention needed" },
  ],
};

const EXPANSION: OttoFocus = {
  id: "expansion",
  eyebrow: "Growth view",
  headline: "Three expansion openings backed by usage",
  listMeta: "Otto · expansion",
  listTitle: "Where growth is earned",
  lead: "These openings are qualified by adoption evidence, not by calendar timing. Each one already has a proof point in production.",
  items: [
    {
      account: "Advanced workflow tier",
      kind: "$780K",
      tone: "positive",
      detail: "Two business units already exceed the entitlement ceiling.",
      impact: "Fastest path, evidence already in place",
      action: "Open the opportunity",
    },
    {
      account: "Second-region rollout",
      kind: "$610K",
      tone: "attention",
      detail: "EMEA operations asked for the same deployment pattern twice this quarter.",
      impact: "Requires a sponsor introduction",
      action: "Plan the motion",
    },
    {
      account: "Analytics add-on",
      kind: "$360K",
      tone: "quiet",
      detail: "Reporting requests moved from ad hoc to weekly cadence.",
      impact: "Best positioned at the QBR",
      action: "Stage for the QBR",
    },
  ],
  metricsMeta: "Otto · pipeline",
  metricsTitle: "Qualified upside",
  metrics: [
    { label: "Qualified upside", value: "$1.75M", note: "Three usage-backed openings" },
    { label: "Evidence strength", value: "Strong", note: "All three have production proof" },
    { label: "Best next step", value: "QBR", note: "Frame growth against realized value" },
  ],
};

const FOCUSES: OttoFocus[] = [PORTFOLIO, WHY_DECLINE, PREPARE, VALUE, RISK, EXPANSION];

const EXACT: Record<string, OttoFocus> = {
  "What needs my attention this week?": PORTFOLIO,
  "Why did Acme adoption decline?": WHY_DECLINE,
  "Prepare me for Tuesday's Acme meeting": PREPARE,
  "Show Q3 value realized for Acme": VALUE,
};

/** Route any question — chip or typed — to the focus that answers it. */
export function ottoFocus(query: string): OttoFocus {
  const exact = EXACT[query.trim()];
  if (exact) return exact;
  const q = query.toLowerCase();
  const has = (...words: string[]) => words.some((w) => q.includes(w));

  if (has("why", "decline", "drop", "root cause", "diagnos", "explain")) return WHY_DECLINE;
  if (has("prepare", "meeting", "brief", "agenda", "tuesday", "call")) return PREPARE;
  if (has("value", "roi", "realiz", "outcome", "impact")) return VALUE;
  if (has("risk", "churn", "renew", "exposure", "at risk")) return RISK;
  if (has("expand", "expansion", "growth", "upsell", "opportunit", "pipeline")) return EXPANSION;
  return PORTFOLIO;
}

export const OTTO_FOCUSES = FOCUSES;
