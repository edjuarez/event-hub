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
  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
  });

  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="sticky top-0 z-20 flex flex-col gap-2 rounded-xl border border-ink bg-ink px-5 py-4 shadow-md sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            {weekday}
          </p>

          <h2
            id={headingId}
            className="text-base font-bold text-inverse sm:text-lg"
          >
            {formattedDate}
          </h2>
        </div>
      </div>

      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-3 py-1.5 text-xs font-bold text-inverse">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />
        {eventCount} {eventCount === 1 ? "event" : "events"}
      </span>
    </div>
  );
}
