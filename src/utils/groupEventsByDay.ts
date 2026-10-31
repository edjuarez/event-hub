import type { CalendarEvent } from "../types/event";

export interface TimelineGroupData {
  dateKey: string;
  date: Date;
  events: CalendarEvent[];
}

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function groupEventsByDay(events: CalendarEvent[]): TimelineGroupData[] {
  const groups = new Map<string, TimelineGroupData>();

  for (const event of events) {
    const eventDate = new Date(event.date);

    if (Number.isNaN(eventDate.getTime())) {
      continue;
    }

    const dateKey = getLocalDateKey(eventDate);

    if (!groups.has(dateKey)) {
      groups.set(dateKey, {
        dateKey,
        date: new Date(
          eventDate.getFullYear(),
          eventDate.getMonth(),
          eventDate.getDate(),
        ),
        events: [],
      });
    }

    groups.get(dateKey)!.events.push(event);
  }

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      events: [...group.events].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
}
