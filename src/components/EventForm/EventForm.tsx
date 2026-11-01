
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/Button";

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
  { value: "cancelled", label: "Cancelled"},
];

const fieldStyles =
  "mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

const errorStyles = "mt-1 text-xs text-danger";

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    defaultValues: {
      title: "",
      description: "",
      date: "",
      category: "",
      status: "scheduled",
    },
    shouldFocusError: true,
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

  const handleInvalidSubmit = () => {
    const firstInvalidField = (
      ["title", "date", "category", "status"] as const
    ).find((field) => errors[field]);

    if (firstInvalidField) {
      setFocus(firstInvalidField);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm, handleInvalidSubmit)}
      noValidate
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="event-title"
          className="block text-sm font-medium text-text-primary"
        >
          Event title <span className="text-danger">*</span>
        </label>

        <Controller
          name="title"
          control={control}
          rules={{
            required: "Title is required.",
            minLength: {
              value: 3,
              message: "Title must contain at least 3 characters.",
            },
            validate: (value) =>
              value.trim().length > 0 || "Title is required.",
          }}
          render={({ field, fieldState }) => (
            <>
              <input
                {...field}
                id="event-title"
                type="text"
                placeholder="e.g. Product launch"
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.error ? "event-title-error" : undefined
                }
                className={fieldStyles}
              />

              {fieldState.error && (
                <p
                  id="event-title-error"
                  className={errorStyles}
                  role="alert"
                >
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      <div>
        <label
          htmlFor="event-description"
          className="block text-sm font-medium text-text-primary"
        >
          Description
        </label>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              id="event-description"
              rows={3}
              placeholder="Add some details about this event..."
              value={field.value ?? ""}
              className={fieldStyles}
            />
          )}
        />
      </div>

      <div>
        <label
          htmlFor="event-date"
          className="block text-sm font-medium text-text-primary"
        >
          Date and time <span className="text-danger">*</span>
        </label>

        <Controller
          name="date"
          control={control}
          rules={{
            required: "Date and time are required.",
            validate: (value) =>
              (value.trim().length > 0 &&
                !Number.isNaN(new Date(value).getTime())) ||
              "Please enter a valid date and time.",
          }}
          render={({ field, fieldState }) => (
            <>
              <input
                {...field}
                id="event-date"
                type="datetime-local"
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.error ? "event-date-error" : undefined
                }
                className={fieldStyles}
              />

              {fieldState.error && (
                <p
                  id="event-date-error"
                  className={errorStyles}
                  role="alert"
                >
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      <div>
        <label
          htmlFor="event-category"
          className="block text-sm font-medium text-text-primary"
        >
          Category <span className="text-danger">*</span>
        </label>

        <Controller
          name="category"
          control={control}
          rules={{
            required: "Category is required.",
            validate: (value) =>
              value.trim().length > 0 || "Category is required.",
          }}
          render={({ field, fieldState }) => (
            <>
              <input
                {...field}
                id="event-category"
                type="text"
                placeholder="e.g. Conference"
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.error ? "event-category-error" : undefined
                }
                className={fieldStyles}
              />

              {fieldState.error && (
                <p
                  id="event-category-error"
                  className={errorStyles}
                  role="alert"
                >
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
      </div>

      <div>
        <label
          htmlFor="event-status"
          className="block text-sm font-medium text-text-primary"
        >
          Status
        </label>

        <Controller
          name="status"
          control={control}
          rules={{
            required: "Status is required.",
          }}
          render={({ field }) => (
            <select
              {...field}
              id="event-status"
              value={field.value ?? "scheduled"}
              className={fieldStyles}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-5">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="hover:-translate-y-0.5 hover:shadow-md"
        >
          {isSubmitting ? "Saving..." : event ? "Save changes" : "Create event"}
        </Button>
      </div>
    </form>
  );
}
