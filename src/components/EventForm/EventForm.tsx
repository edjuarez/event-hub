
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { CalendarEvent, EventStatus } from "../../types/event";

type EventFormValues = Omit<CalendarEvent, "id" | "date"> & {
  date: string;
};

interface EventFormProps {
  event?: CalendarEvent | null;
  onSave: (event: Omit<CalendarEvent, "id">) => void;
  onCancel: () => void;
}

function toLocalDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const statusOptions: { value: EventStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const fieldStyles =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

const errorStyles = "mt-1 text-xs text-danger";

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      category: "",
      status: "scheduled",
    },
  });

  useEffect(() => {
    reset({
      title: event?.title ?? "",
      description: event?.description ?? "",
      date: event ? toLocalDateTime(event.date) : "",
      category: event?.category ?? "",
      status: event?.status ?? "scheduled",
    });
  }, [event, reset]);

  const submitForm = (values: EventFormValues) => {
    onSave({
      title: values.title.trim(),
      description: values.description.trim(),
      date: new Date(values.date).toISOString(),
      category: values.category.trim(),
      status: values.status,
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} noValidate className="space-y-5">
      <div>
        <label
          htmlFor="event-title"
          className="block text-sm font-medium text-text-primary"
        >
          Event title <span className="text-danger">*</span>
        </label>

        <input
          id="event-title"
          type="text"
          placeholder="e.g. Product launch"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "event-title-error" : undefined}
          className={fieldStyles}
          {...register("title", {
            required: "Title is required.",
            minLength: {
              value: 3,
              message: "Title must contain at least 3 characters.",
            },
            validate: (value) =>
              value.trim().length > 0 || "Title is required.",
          })}
        />

        {errors.title && (
          <p id="event-title-error" className={errorStyles} role="alert">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="event-description"
          className="block text-sm font-medium text-text-primary"
        >
          Description
        </label>

        <textarea
          id="event-description"
          rows={3}
          placeholder="Add some details about this event..."
          className={fieldStyles}
          {...register("description")}
        />
      </div>

      <div>
        <label
          htmlFor="event-date"
          className="block text-sm font-medium text-text-primary"
        >
          Date and time <span className="text-danger">*</span>
        </label>

        <input
          id="event-date"
          type="datetime-local"
          aria-invalid={Boolean(errors.date)}
          aria-describedby={errors.date ? "event-date-error" : undefined}
          className={fieldStyles}
          {...register("date", {
            required: "Date and time are required.",
            validate: (value) =>
              (!Number.isNaN(new Date(value).getTime()) &&
                value.trim().length > 0) ||
              "Please enter a valid date and time.",
          })}
        />

        {errors.date && (
          <p id="event-date-error" className={errorStyles} role="alert">
            {errors.date.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="event-category"
          className="block text-sm font-medium text-text-primary"
        >
          Category <span className="text-danger">*</span>
        </label>

        <input
          id="event-category"
          type="text"
          placeholder="e.g. Conference"
          aria-invalid={Boolean(errors.category)}
          aria-describedby={
            errors.category ? "event-category-error" : undefined
          }
          className={fieldStyles}
          {...register("category", {
            required: "Category is required.",
            validate: (value) =>
              value.trim().length > 0 || "Category is required.",
          })}
        />

        {errors.category && (
          <p id="event-category-error" className={errorStyles} role="alert">
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="event-status"
          className="block text-sm font-medium text-text-primary"
        >
          Status
        </label>

        <select
          id="event-status"
          className={fieldStyles}
          {...register("status", {
            required: "Status is required.",
          })}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-5">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:bg-surface-muted"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-coral text-white hover:bg-[#df6954] cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : event
              ? "Save changes"
              : "Create event"}
        </button>
      </div>
    </form>
  );
}
