import { useEffect, useState } from "react";

import { getEvents } from "../services/eventService";
import type { CalendarEvent } from "../types/event";

interface UseEventsResult {
  events: CalendarEvent[];
  loading: boolean;
  error: string | null;
}

export function useEvents(): UseEventsResult {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch {
        setError("Unable to load events. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return { events, loading, error };
}
