
import { useState } from "react";

import { useEvents } from "../hooks/useEvents";
import { Button } from "../components/ui/Button";
import { SummaryCards } from "../components/ui/SummaryCards";
import { ViewSelector, type EventsView } from "../components/ui/ViewSelector";
import { DataGrid } from "../components/DataGrid/DataGrid";
import { gridColumns } from "../config/gridColumns";
import { Timeline } from "../components/Timeline/Timeline";
import { EventFormModal } from "../components/EventForm/EventFormModal";
import type { CalendarEvent } from "../types/event";

export function EventsPage() {
  const {
    events,
    loading,
    error,
    addEvent,
    updateEvent,
  } = useEvents();

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

          <ViewSelector
            activeView={activeView}
            onViewChange={setActiveView}
          />
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

      <EventFormModal
        isOpen={isFormOpen}
        event={selectedEvent}
        onClose={handleCloseForm}
        onSave={handleSaveEvent}
      />
    </main>
  );
}
