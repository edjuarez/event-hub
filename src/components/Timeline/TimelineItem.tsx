import type { KeyboardEvent } from "react";
import type { CalendarEvent } from "../../types/event";

interface TimelineItemProps {
  event: CalendarEvent;
  headingId: string;
  tabIndex: number;
  itemRef: (element: HTMLElement | null) => void;
  onFocus: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
}

const statusStyles: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700",
  "in-progress": "bg-amber-50 text-amber-700",
  completed: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

const statusLabels: Record<string, string> = {
  scheduled: "Scheduled",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

function formatTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TimelineItem({
  event,
  headingId,
  tabIndex,
  itemRef,
  onFocus,
  onKeyDown,
}: TimelineItemProps) {
  const status = String(event.status);
  const statusLabel = statusLabels[status] ?? status;

  return (
    <article
      ref={itemRef}
      tabIndex={tabIndex}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      aria-labelledby={`${headingId} timeline-event-${event.id}`}
      className="group relative rounded-xl border border-border bg-surface p-4 outline-none transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />

            <span className="text-xs font-medium text-text-muted">
              {formatTime(event.date)}
            </span>
          </div>

          <h3
            id={`timeline-event-${event.id}`}
            className="font-semibold text-text-primary transition-colors group-hover:text-accent"
          >
            {event.title}
          </h3>

          <p className="mt-1 text-sm text-text-muted">{event.category}</p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            statusStyles[status] ?? "bg-gray-100 text-gray-700"
          }`}
        >
          {statusLabel}
        </span>
      </div>
    </article>
  );
}