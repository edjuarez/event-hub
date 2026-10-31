import { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import { Button } from "../components/ui/Button";
import { SummaryCards } from "../components/ui/SummaryCards";
import { ViewSelector, type EventsView } from "../components/ui/ViewSelector";
import { DataGrid } from "../components/DataGrid/DataGrid";
import { gridColumns } from "../config/gridColumns";
import { Timeline } from "../components/Timeline/Timeline";

export function EventsPage() {
  const { events, loading, error } = useEvents();
  const [activeView, setActiveView] = useState<EventsView>("table");

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-text-muted">Loading events...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-12">
        <p role="alert" className="text-danger">
          {error}
        </p>
      </main>
    );
  }

  const scheduledCount = events.filter(
    (event) => event.status === "scheduled",
  ).length;

  const completedCount = events.filter(
    (event) => event.status === "completed",
  ).length;

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10">
      <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            EventHub
          </h1>

          <p className="mt-2 text-sm text-text-muted">
            Manage and organize your scheduled events.
          </p>
        </div>

        <Button type="button">
          <span aria-hidden="true">+</span>
          New Event
        </Button>
      </section>

      <SummaryCards
        total={events.length}
        scheduled={scheduledCount}
        completed={completedCount}
      />

      <section className="mt-10">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">All Events</h2>

            <p className="mt-1 text-sm text-text-muted">
              Browse and manage your events.
            </p>
          </div>

          <ViewSelector activeView={activeView} onViewChange={setActiveView} />
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {activeView === "table" ? (
            <DataGrid
              data={events}
              columns={gridColumns}
              loading={loading}
              error={error}
            />
          ) : (
            <Timeline
              events={events.slice(0, 10_000)}
              totalCount={events.length}
            />
          )}
        </div>
      </section>
    </main>
  );
}
