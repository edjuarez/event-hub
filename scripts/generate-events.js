import { mkdir, writeFile } from "node:fs/promises";

const TOTAL_EVENTS = 100_000;

const titles = [
  "Project Kickoff",
  "Quarterly Planning",
  "Product Roadmap Review",
  "Team Retrospective",
  "Design Review",
  "Sprint Planning",
  "Technical Workshop",
];

const categories = [
  "Meeting",
  "Workshop",
  "Conference",
  "Webinar",
  "Planning",
];

const statuses = [
  "scheduled",
  "in-progress",
  "completed",
  "cancelled",
];

const events = Array.from({ length: TOTAL_EVENTS }, (_, index) => {
  const random = (items) =>
    items[Math.floor(Math.random() * items.length)];

  const timestamp =
    Date.parse("2025-01-01") +
    Math.random() * (Date.parse("2028-01-01") - Date.parse("2025-01-01"));

  return {
    id: `evt-${index + 1}`,
    title: random(titles),
    description: "Review progress and discuss next steps.",
    date: new Date(timestamp).toISOString(),
    category: random(categories),
    status: random(statuses),
  };
});

await mkdir("public/data", { recursive: true });

await writeFile(
  "public/data/events.json",
  JSON.stringify(events),
);

console.log(`Generated ${events.length} events.`);