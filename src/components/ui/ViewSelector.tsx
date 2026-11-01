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
      className="relative z-10 -mb-px inline-flex w-full items-end gap-1 sm:w-auto"
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
            className={`relative flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-t-xl border border-b-0 px-7 py-3 text-base font-bold tracking-wide transition-all duration-200 focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:min-w-40 ${
              isActive
                ? "border-border bg-surface text-ink"
                : "border-transparent bg-surface-muted text-text-muted hover:bg-[#e9e5dc] hover:text-text-secondary"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
