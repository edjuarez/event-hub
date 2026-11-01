import type { CalendarEvent, EventStatus } from "../types/event";

const TITLES = [
  "Product Launch",
  "Team Meeting",
  "Annual Conference",
  "Marketing Workshop",
  "Project Review",
  "Design Sprint",
  "Client Presentation",
  "Technical Workshop",
  "Strategy Meeting",
  "Quarterly Review",
];

const CATEGORIES = [
  "Business",
  "Marketing",
  "Technology",
  "Design",
  "Training",
];

const STATUSES: EventStatus[] = [
  "scheduled",
  "in-progress",
  "completed",
  "cancelled",
];

function createRandom(seed: number) {
  let state = seed;

  return function () {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function generateEvents(count: number, seed = 42): CalendarEvent[] {
  const random = createRandom(seed);
  const events: CalendarEvent[] = [];

  const startDate = new Date("2025-01-01T00:00:00Z").getTime();
  const endDate = new Date("2028-01-01T00:00:00Z").getTime();
  const dateRange = endDate - startDate;

  for (let i = 0; i < count; i++) {
    const titleIndex = Math.floor(random() * TITLES.length);
    const categoryIndex = Math.floor(random() * CATEGORIES.length);
    const statusIndex = Math.floor(random() * STATUSES.length);

    const timestamp = startDate + Math.floor(random() * dateRange);

    events.push({
      id: `evt-${String(i + 1).padStart(6, "0")}`,
      title: `${TITLES[titleIndex]} #${i + 1}`,
      description: `Description for event ${i + 1}`,
      date: new Date(timestamp).toISOString(),
      category: CATEGORIES[categoryIndex],
      status: STATUSES[statusIndex],
    });
  }

  return events;
}
