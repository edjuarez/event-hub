import type { CalendarEvent } from "../types/event";

const TOTAL_EVENTS = 100_000;

let eventsPromise: Promise<CalendarEvent[]> | null = null;

export function getEvents(): Promise<CalendarEvent[]> {
  if (!eventsPromise) {
    eventsPromise = new Promise<CalendarEvent[]>((resolve, reject) => {
      const worker = new Worker(
        new URL("../workers/events.worker.ts", import.meta.url),
        { type: "module" },
      );

      worker.onmessage = (event: MessageEvent<CalendarEvent[]>) => {
        worker.terminate();
        resolve(event.data);
      };

      worker.onerror = (event) => {
        worker.terminate();
        reject(new Error(event.message || "Unable to generate events."));
      };

      worker.postMessage({
        count: TOTAL_EVENTS,
        seed: 42,
      });
    }).catch((error: unknown) => {
      eventsPromise = null;
      throw error;
    });
  }

  return eventsPromise!;
}
