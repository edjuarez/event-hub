import type { ColumnDef } from "@tanstack/react-table";
import type { CalendarEvent } from "../types/event";

export function getGridColumns(
  onEdit: (event: CalendarEvent) => void,
): ColumnDef<CalendarEvent, unknown>[] {
  return [
    {
      accessorKey: "title",
      header: "Event",
      enableHiding: false,
      enableColumnFilter: true,
    },
    {
      accessorKey: "date",
      header: "Date & Time",
      cell: ({ getValue }) => {
        const date = new Date(getValue<string>());

        if (Number.isNaN(date.getTime())) {
          return "Invalid date";
        }

        return (
          <div className="flex flex-col">
            <span className="font-medium text-text-primary">
              {date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="text-xs text-text-muted">
              {date.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
          </div>
        );
      },
      enableColumnFilter: false,
    },
    {
      accessorKey: "category",
      header: "Category",
      enableColumnFilter: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      enableColumnFilter: true,
      cell: ({ getValue }) => {
        const status = getValue<string>();

        const styles: Record<string, string> = {
          scheduled: "bg-blue-50 text-blue-700",
          "in-progress": "bg-amber-50 text-amber-700",
          completed: "bg-green-50 text-green-700",
          cancelled: "bg-red-50 text-red-700",
        };

        const labels: Record<string, string> = {
          scheduled: "Scheduled",
          "in-progress": "In Progress",
          completed: "Completed",
          cancelled: "Cancelled",
        };

        return (
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              styles[status] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {labels[status] ?? status}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableColumnFilter: false,
      enableHiding: false,
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onEdit(row.original)}
          aria-label={`Edit ${row.original.title}`}
          className="cursor-pointer rounded-md px-3 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Edit
        </button>
      ),
    },
  ];
}
