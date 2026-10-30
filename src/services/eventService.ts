import type { CalendarEvent } from "../types/event";

export async function getEvents(): Promise<CalendarEvent[]> {
  const response = await fetch("/data/events.json");

  if (!response.ok) {
    throw new Error("Failed to load events");
  }

  return response.json();
}