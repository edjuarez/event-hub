
import { useEffect, useRef } from "react";

import type { CalendarEvent } from "../../types/event";
import { EventForm } from "./EventForm";

interface EventFormModalProps {
  isOpen: boolean;
  event?: CalendarEvent | null;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
}

export function EventFormModal({
  isOpen,
  event,
  onClose,
  onSave,
}: EventFormModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const title = event ? "Edit event" : "Create new event";

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="event-modal-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-border bg-surface p-0 text-text-primary shadow-2xl backdrop:bg-ink/50"
    >
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
        <div>
          <h2
            id="event-modal-title"
            className="text-xl font-semibold text-text-primary"
          >
            {title}
          </h2>

          <p className="mt-1 text-sm text-text-muted">
            {event
              ? "Update the information for this event."
              : "Fill in the details to create a new event."}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="cursor-pointer rounded-lg p-2 text-text-muted transition hover:bg-surface-muted hover:text-text-primary"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div className="p-6">
        <EventForm
          event={event}
          onSave={onSave}
          onCancel={onClose}
        />
      </div>
    </dialog>
  );
}
