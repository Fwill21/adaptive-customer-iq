import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/experience/Experience";

const title = "CSP on AINPX — Future Vision Leadership Experience";
const description =
  "An interactive leadership story for a future ServiceNow Customer Success Platform: Otto orchestrates ten specialized agents across a continuously aware AI environment.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Experience,
});
