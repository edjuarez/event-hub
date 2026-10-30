
import { useState } from "react";
import { useEvents } from "../hooks/useEvents";
import { Button } from "../components/ui/Button";
import { SummaryCards } from "../components/events/SummaryCards";
import {
  ViewSelector,
  type EventsView,
} from "../components/events/ViewSelector";

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
      {/* Page heading */}
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

      {/* Summary */}
      <SummaryCards
        total={events.length}
        scheduled={scheduledCount}
        completed={completedCount}
      />

      {/* View selector */}
      <section className="mt-10">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              All Events
            </h2>

            <p className="mt-1 text-sm text-text-muted">
              Browse and manage your events.
            </p>
          </div>

          <ViewSelector
            activeView={activeView}
            onViewChange={setActiveView}
          />
        </div>

        {/* View content */}
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {activeView === "table" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface-muted">
                  <tr>
                    <th className="px-5 py-4 font-semibold text-text-muted">
                      Event
                    </th>
                    <th className="px-5 py-4 font-semibold text-text-muted">
                      Category
                    </th>
                    <th className="px-5 py-4 font-semibold text-text-muted">
                      Date
                    </th>
                    <th className="px-5 py-4 font-semibold text-text-muted">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {events.slice(0, 10).map((event) => (
                    <tr key={event.id} className="hover:bg-surface-muted/50">
                      <td className="px-5 py-4 font-medium text-ink">
                        {event.title}
                      </td>
                      <td className="px-5 py-4 text-text-muted">
                        {event.category}
                      </td>
                      <td className="px-5 py-4 text-text-muted">
                        {new Date(event.date).toLocaleDateString("en-GB")}
                      </td>
                      <td className="px-5 py-4 capitalize text-text-muted">
                        {event.status.replace("-", " ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-border px-5 py-3 text-xs text-text-muted">
                Showing 10 of {events.length.toLocaleString("en-US")} events
              </div>
            </div>
          ) : (
            <div className="flex min-h-64 items-center justify-center p-8">
              <p className="text-sm text-text-muted">
                Timeline view.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
