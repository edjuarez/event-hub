
interface SummaryCardsProps {
  total: number;
  scheduled: number;
  completed: number;
}

const cardConfig = [
  {
    label: "Total Events",
    key: "total",
    description: "All events",
  },
  {
    label: "Scheduled",
    key: "scheduled",
    description: "Upcoming events",
  },
  {
    label: "Completed",
    key: "completed",
    description: "Finished events",
  },
] as const;

export function SummaryCards({
  total,
  scheduled,
  completed,
}: SummaryCardsProps) {
  const values = { total, scheduled, completed };

  return (
    <section
      aria-label="Event summary"
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {cardConfig.map((card) => (
        <article
          key={card.key}
          className="rounded-xl border border-border bg-surface p-5"
        >
          <p className="text-sm font-medium text-text-muted">
            {card.label}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-ink">
            {values[card.key].toLocaleString("en-US")}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            {card.description}
          </p>
        </article>
      ))}
    </section>
  );
}
