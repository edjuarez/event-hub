import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary: "bg-action text-inverse hover:bg-action-hover",
    secondary:
      "border border-border-strong bg-surface text-text-primary hover:bg-surface-muted",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

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
            className={`flex min-h-12 flex-1 cursor-pointer items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus sm:min-w-36 ${
              isActive
                ? "bg-ink text-inverse shadow-md"
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
