import type { Table } from "@tanstack/react-table";

interface GridToolbarProps<TData> {
  table: Table<TData>;
}

const categories = [
  "Business",
  "Marketing",
  "Technology",
  "Design",
  "Training",
];

const statuses = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function GridToolbar<TData>({ table }: GridToolbarProps<TData>) {
  const titleColumn = table.getColumn("title");
  const categoryColumn = table.getColumn("category");
  const statusColumn = table.getColumn("status");

  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide());

  const hasFilters =
    table.getState().globalFilter || table.getState().columnFilters.length > 0;

  function clearFilters() {
    table.resetGlobalFilter();
    table.resetColumnFilters();
  }

  return (
    <div className="flex flex-col gap-4 border-b border-border p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-title"
            className="text-xs font-medium text-text-muted"
          >
            Event title
          </label>

          <input
            id="filter-title"
            type="search"
            placeholder="Filter by title..."
            value={(titleColumn?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              titleColumn?.setFilterValue(event.target.value || undefined)
            }
            className="h-[38px] rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-coral"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-category"
            className="text-xs font-medium text-text-muted"
          >
            Category
          </label>

          <select
            id="filter-category"
            value={(categoryColumn?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              categoryColumn?.setFilterValue(event.target.value || undefined)
            }
            className="h-[38px] rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-coral cursor-pointer"
          >
            <option value="">All categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label
            htmlFor="filter-status"
            className="text-xs font-medium text-text-muted"
          >
            Status
          </label>

          <select
            id="filter-status"
            value={(statusColumn?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              statusColumn?.setFilterValue(event.target.value || undefined)
            }
            className="h-[38px] rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-coral cursor-pointer"
          >
            <option value="">All statuses</option>

            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <span
            className="text-xs font-medium text-text-muted"
            aria-hidden="true"
          >
            &nbsp;
          </span>

          <details className="relative">
            <summary className="flex h-[38px] cursor-pointer list-none items-center justify-center rounded-lg border border-border px-4 text-sm font-medium hover:bg-surface-muted">
              Columns
            </summary>

            <div className="absolute right-0 top-full z-20 mt-2 min-w-48 rounded-lg border border-border bg-surface p-3 shadow-lg">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-muted">
                Toggle columns
              </p>

              <div className="flex flex-col gap-3">
                {columns.map((column) => (
                  <label
                    key={column.id}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                      className="accent-coral"
                    />

                    {typeof column.columnDef.header === "string"
                      ? column.columnDef.header
                      : column.id}
                  </label>
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-text-muted" aria-live="polite">
          {table.getFilteredRowModel().rows.length === 0
            ? "No events found"
            : `Showing ${table.getRowModel().rows.length} of ${table
                .getFilteredRowModel()
                .rows.length.toLocaleString()} events`}
        </p>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-coral hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
