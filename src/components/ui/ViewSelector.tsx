
export type EventsView = "table" | "timeline";

interface ViewSelectorProps {
  activeView: EventsView;
  onViewChange: (view: EventsView) => void;
}

export function ViewSelector({ activeView, onViewChange }: ViewSelectorProps) {
  const options: { value: EventsView; label: string }[] = [
    { value: "table", label: "Data Grid" },
    { value: "timeline", label: "Timeline" },
  ];

  return (
    <div
      className="inline-flex w-full rounded-xl border border-border bg-surface-muted p-1.5 sm:w-auto"
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
            className={`flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 sm:min-w-36 ${
              isActive
                ? "bg-ink text-white shadow-md"
                : "text-text-secondary hover:bg-surface hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
