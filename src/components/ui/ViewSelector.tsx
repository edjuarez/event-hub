export type EventsView = "table" | "timeline";

interface ViewSelectorProps {
  activeView: EventsView;
  onViewChange: (view: EventsView) => void;
}

export function ViewSelector({ activeView, onViewChange }: ViewSelectorProps) {
  const options: { value: EventsView; label: string }[] = [
    { value: "table", label: "Table View" },
    { value: "timeline", label: "Timeline View" },
  ];

  return (
    <div
      className="inline-flex rounded-lg border border-border bg-surface-muted p-1"
      role="group"
      aria-label="Select events view"
    >
      {options.map((option) => {
        const isActive = activeView === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onViewChange(option.value)}
            aria-pressed={isActive}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              isActive
                ? "bg-surface text-ink shadow-sm"
                : "text-text-muted hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
