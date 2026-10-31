import type { ColumnDef } from "@tanstack/react-table";
import type { CalendarEvent } from "../types/event";

export const gridColumns: ColumnDef<CalendarEvent, unknown>[] = [
  {
    accessorKey: "title",
    header: "Event",
    enableHiding: false,
    enableColumnFilter: true,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ getValue }) => {
      const date = new Date(getValue<string>());

      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
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
];
