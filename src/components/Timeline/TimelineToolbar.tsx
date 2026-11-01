import { ChevronsDown, ChevronsUp } from "lucide-react";

interface TimelineToolbarProps {
  displayedCount: number;
  totalCount: number;
  onGoToStart: () => void;
  onGoToEnd: () => void;
}

export function TimelineToolbar({
  displayedCount,
  totalCount,
  onGoToStart,
  onGoToEnd,
}: TimelineToolbarProps) {
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("en-US").format(value);

  const buttonStyles =
    "flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-ink bg-ink px-4 py-2 text-sm font-semibold text-inverse shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-strong hover:bg-primary-strong hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed disabled:border-border-strong disabled:bg-surface-muted disabled:text-text-muted disabled:opacity-100 disabled:hover:translate-y-0 disabled:hover:shadow-sm";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-surface px-5 pt-4">
      <p className="text-sm text-text-muted" aria-live="polite">
        Showing{" "}
        <span className="font-semibold text-text-primary">
          {formatNumber(displayedCount)}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-text-primary">
          {formatNumber(totalCount)}
        </span>{" "}
        events
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onGoToStart}
          disabled={displayedCount === 0}
          aria-label="Go to start of timeline"
          className={buttonStyles}
        >
          <ChevronsUp size={16} aria-hidden="true" />
          <span>Go to start</span>
        </button>

        <button
          type="button"
          onClick={onGoToEnd}
          disabled={displayedCount === 0}
          aria-label="Go to end of timeline"
          className={buttonStyles}
        >
          <ChevronsDown size={16} aria-hidden="true" />
          <span>Go to end</span>
        </button>
      </div>
    </div>
  );
}
