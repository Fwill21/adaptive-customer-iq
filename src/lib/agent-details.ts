import type { Detail } from "./story-data";

/**
 * Leadership-facing explanation for any agent shown in the AI activity overlay.
 * Otto is described as the orchestrator; every other entry is a specialized agent.
 */
const AGENT_DOMAINS: Record<string, string[]> = {
  Otto: [
    "Orchestrates specialized agents — the user never selects one",
    "Holds customer, workflow and role context across moments",
    "Decides what is worth surfacing and what stays in the background",
  ],
  "Adoption Signal Agent": [
    "Monitors workflow-level usage per deployment group",
    "Separates seasonality from real behavioural change",
    "Flags divergence from committed adoption targets",
  ],
  "Deployment Health Agent": [
    "Watches configuration and release history",
    "Correlates technical change with user behaviour",
    "Identifies the specific change that produced an impact",
  ],
  "Support Signal Agent": [
    "Reads ticket volume, themes and sentiment",
    "Links friction back to affected workflows",
    "Confirms or contradicts adoption hypotheses",
  ],
  "Value Realization Agent": [
    "Links product outcomes to committed business objectives",
    "Quantifies realized value continuously, not at quarter end",
    "Maintains the evidence chain behind every value claim",
  ],
  "Relationship Agent": [
    "Tracks sponsor engagement and stakeholder change",
    "Notices when a champion goes quiet",
    "Keeps role context current across CSM, TSM and AE",
  ],
  "Executive Narrative Agent": [
    "Assembles the customer-facing story from real events",
    "Phrases outcomes in the customer's own business language",
    "Prepares the decisions a review should produce",
  ],
};

const DEFAULT_DOMAIN = [
  "Runs continuously against Acme Corporation's live signals",
  "Contributes findings to Otto rather than to the user directly",
  "Never acts on the customer without human confirmation",
];

export function agentDetail(agent: string, action: string): Detail {
  const isOtto = agent === "Otto";
  return {
    title: agent,
    meta: isOtto ? "Orchestration layer" : "Specialized agent · Acme Corporation",
    summary: action,
    sections: [
      { label: isOtto ? "What Otto does here" : "What this agent does", items: AGENT_DOMAINS[agent] ?? DEFAULT_DOMAIN },
      {
        label: "In this moment",
        items: [
          action,
          "Findings written into the shared account context",
          isOtto
            ? "Synthesized into a single recommendation for the human to decide on"
            : "Handed to Otto for synthesis — never surfaced as a separate tool",
        ],
      },
      {
        label: "Human control",
        items: [
          "Recommendations require confirmation before anything reaches the customer",
          "Every claim can be traced back to the signal that produced it",
        ],
      },
    ],
  };
}
