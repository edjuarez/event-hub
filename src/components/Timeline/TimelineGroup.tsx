interface TimelineGroupProps {
  date: Date;
  eventCount: number;
  headingId: string;
}

export function TimelineGroup({
  date,
  eventCount,
  headingId,
}: TimelineGroupProps) {
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-center justify-between border-b border-border bg-background/95 py-3">
      <h2
        id={headingId}
        className="font-semibold text-text-primary"
      >
        {formattedDate}
      </h2>

      <span className="text-xs font-medium text-text-muted">
        {eventCount} {eventCount === 1 ? "event" : "events"}
      </span>
    </div>
  );
}