export type EventStatus =
  "scheduled" | "in-progress" | "completed" | "cancelled";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  status: EventStatus;
}
