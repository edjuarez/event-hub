import { generateEvents } from "../data/generateEvents";
import type { CalendarEvent } from "../types/event";

interface GenerateEventsMessage {
  count: number;
  seed: number;
}

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<GenerateEventsMessage>) => void) | null;
  postMessage: (events: CalendarEvent[]) => void;
};

workerScope.onmessage = (event) => {
  const { count, seed } = event.data;
  const events = generateEvents(count, seed);

  workerScope.postMessage(events);
};
