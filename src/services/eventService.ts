import { generateEvents } from "../data/generateEvents";
import type { CalendarEvent } from "../types/event";

const TOTAL_EVENTS = 100_000;

let eventsCache: CalendarEvent[] | null = null;

export async function getEvents(): Promise<CalendarEvent[]> {
  if (!eventsCache) {
    eventsCache = generateEvents(TOTAL_EVENTS);
  }

  return eventsCache;
}
