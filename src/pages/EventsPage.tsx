
import { useCallback, useMemo, useState } from "react";

import { useEvents } from "../hooks/useEvents";
import { Button } from "../components/ui/Button";
import { ViewSelector, type EventsView } from "../components/ui/ViewSelector";
import { DataGrid } from "../components/DataGrid/DataGrid";
import { getGridColumns } from "../config/gridColumns";
import { Timeline } from "../components/Timeline/Timeline";
import { EventFormModal } from "../components/EventForm/EventFormModal";
import type { CalendarEvent } from "../types/event";

export function EventsPage() {
  const { events, loading, error, addEvent, updateEvent } = useEvents();

  const [activeView, setActiveView] = useState<EventsView>("table");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = useState("");

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setSuccessMessage("");
    setIsFormOpen(true);
  };

  const handleEditEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event);
    setSuccessMessage("");
    setIsFormOpen(true);
  }, []);

  const columns = useMemo(
    () => getGridColumns(handleEditEvent),
    [handleEditEvent],
  );

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedEvent(null);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, "id">) => {
    if (selectedEvent) {
      updateEvent({
        ...eventData,
        id: selectedEvent.id,
      });

      setSuccessMessage("Event updated successfully.");
    } else {
      addEvent({
        ...eventData,
        id: crypto.randomUUID(),
      });

      setSuccessMessage("Event created successfully.");
    }

    handleCloseForm();
  };

  const eventCounts = useMemo(
    () =>
      events.reduce(
        (counts, event) => {
          if (event.status === "scheduled") counts.scheduled += 1;
          if (event.status === "completed") counts.completed += 1;
          return counts;
        },
        { scheduled: 0, completed: 0 },
      ),
    [events],
  );

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

        <Button type="button" onClick={handleNewEvent}>
          <span aria-hidden="true">+</span>
          New Event
        </Button>
      </section>

      {successMessage && (
        <p
          role="status"
          aria-live="polite"
          className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
        >
          {successMessage}
        </p>
      )}

      <section className="mt-10">
        <div className="mb-5 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold text-ink">All Events</h2>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex min-w-28 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-ink" />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
                    Total
                  </p>
                  <p className="text-sm font-bold tabular-nums text-ink">
                    {events.length.toLocaleString("en-US")}
                  </p>
                </div>
              </div>

              <div className="flex min-w-28 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#8FAE9B]" />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
                    Scheduled
                  </p>
                  <p className="text-sm font-bold tabular-nums text-ink">
                    {eventCounts.scheduled.toLocaleString("en-US")}
                  </p>
                </div>
              </div>

              <div className="flex min-w-28 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#172B3A]" />
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-text-muted">
                    Completed
                  </p>
                  <p className="text-sm font-bold tabular-nums text-ink">
                    {eventCounts.completed.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ViewSelector
            activeView={activeView}
            onViewChange={setActiveView}
          />
        </div>

        <p className="mb-4 text-sm text-text-muted">
          Browse and manage your events.
        </p>

        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          {activeView === "table" ? (
            <DataGrid
              data={events}
              columns={columns}
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

      <EventFormModal
        isOpen={isFormOpen}
        event={selectedEvent}
        onClose={handleCloseForm}
        onSave={handleSaveEvent}
      />
    </main>
  );
}
