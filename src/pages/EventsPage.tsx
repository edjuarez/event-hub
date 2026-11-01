import { lazy, Suspense, useCallback, useMemo, useState } from "react";
import { useEvents } from "../hooks/useEvents";
import { Button } from "../components/ui/Button";
import { ViewSelector, type EventsView } from "../components/ui/ViewSelector";
import { DataGrid } from "../components/DataGrid/DataGrid";
import { getGridColumns } from "../config/gridColumns";
import { EventFormModal } from "../components/EventForm/EventFormModal";
import type { CalendarEvent } from "../types/event";
const Timeline = lazy(() =>
  import("../components/Timeline/Timeline").then((module) => ({
    default: module.Timeline,
  })),
);
const TIMELINE_BATCH_SIZE = 10_000;

export function EventsPage() {
  const { events, loading, error, addEvent, updateEvent } = useEvents();

  const [activeView, setActiveView] = useState<EventsView>("table");
  const [timelineLimit, setTimelineLimit] = useState(TIMELINE_BATCH_SIZE);
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

  const timelineEvents = useMemo(
    () => (activeView === "timeline" ? events.slice(0, timelineLimit) : []),
    [activeView, events, timelineLimit],
  );

  const handleLoadMoreTimeline = useCallback(() => {
    setTimelineLimit((currentLimit) =>
      Math.min(currentLimit + TIMELINE_BATCH_SIZE, events.length),
    );
  }, [events.length]);

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
      <main className="flex min-h-[60vh] items-center justify-center px-6 py-12">
        <div className="flex flex-col items-center gap-5 text-center">
          <div
            className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary"
            aria-hidden="true"
          />

          <div>
            <p className="text-xl font-bold text-ink sm:text-2xl">
              Loading events...
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Preparing your event dashboard
            </p>
          </div>
        </div>
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
      <section className="relative mb-8 flex w-full flex-col gap-6 overflow-hidden rounded-2xl border border-ink bg-ink px-6 py-8 shadow-lg sm:flex-row sm:items-center sm:justify-between sm:px-9 sm:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border-[32px] border-white/5"
        />

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-inverse sm:text-4xl">
            EventHub
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/80 sm:text-base">
            Manage and organize your scheduled events.
          </p>
        </div>

        <div className="relative z-10 shrink-0">
          <Button
            type="button"
            onClick={handleNewEvent}
            className="min-h-12 w-full px-6 py-3 shadow-md hover:-translate-y-0.5 hover:shadow-lg sm:w-auto"
          >
            <span aria-hidden="true">+</span>
            New Event
          </Button>
        </div>
      </section>

      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="mb-5 flex items-center justify-between gap-4 rounded-lg border border-success/30 bg-success px-4 py-3 text-base text-white"
        >
          <p>{successMessage}</p>

          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            aria-label="Dismiss success message"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-success-strong transition-colors hover:bg-success/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <span
              aria-hidden="true"
              className="text-xl text-white leading-none"
            >
              ×
            </span>
          </button>
        </div>
      )}

      <section className="mt-10">
        <div className="mb-0 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap mb-5 items-center gap-3">
              <div className="min-w-32 rounded-xl border border-border bg-surface px-5 py-3 shadow-sm transition-shadow hover:shadow-md">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Total Events
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums text-ink">
                  {events.length.toLocaleString("en-US")}
                </p>
              </div>

              <div className="min-w-32 rounded-xl border border-border bg-surface px-5 py-3 shadow-sm transition-shadow hover:shadow-md">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Scheduled
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums text-ink">
                  {eventCounts.scheduled.toLocaleString("en-US")}
                </p>
              </div>

              <div className="min-w-32 rounded-xl border border-border bg-surface px-5 py-3 shadow-sm transition-shadow hover:shadow-md">
                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Completed
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums text-ink">
                  {eventCounts.completed.toLocaleString("en-US")}
                </p>
              </div>
            </div>
          </div>

          <ViewSelector activeView={activeView} onViewChange={setActiveView} />
        </div>

        <div className="overflow-hidden rounded-b-xl rounded-tl-xl rounded-tr-none border border-border bg-surface">
          {activeView === "table" ? (
            <DataGrid data={events} columns={columns} />
          ) : (
            <Suspense
              fallback={
                <div
                  role="status"
                  className="flex min-h-[300px] items-center justify-center text-sm text-text-muted"
                >
                  Loading timeline...
                </div>
              }
            >
              <Timeline
                events={timelineEvents}
                totalCount={events.length}
                onLoadMore={handleLoadMoreTimeline}
              />
            </Suspense>
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
