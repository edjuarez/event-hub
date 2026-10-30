
export function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <a
          href="/"
          className="flex items-center gap-3"
          aria-label="EventHub home"
        >
          <div
            className="flex size-10 items-center justify-center rounded-xl bg-ink text-lg font-bold text-white"
            aria-hidden="true"
          >
            E
          </div>

          <span className="text-xl font-bold tracking-tight text-ink">
            EventHub
          </span>
        </a>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-surface-muted px-3 py-1.5 text-xs font-medium text-text-muted sm:inline-flex">
            Enterprise workspace
          </span>

          <div
            className="flex size-10 items-center justify-center rounded-full bg-surface-muted text-sm font-semibold text-ink"
            aria-label="Workspace avatar"
            role="img"
          >
            EH
          </div>
        </div>
      </div>
    </header>
  );
}
