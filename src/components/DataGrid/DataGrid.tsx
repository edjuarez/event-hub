import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";

import { GridToolbar } from "./GridToolbar";
import { Pagination } from "./Pagination";

interface DataGridProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}

export function DataGrid<TData>({
  data,
  columns,
  loading = false,
  error = null,
  emptyMessage = "No events found.",
}: DataGridProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center text-text-muted">
        Loading events...
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-border bg-surface p-8 text-center text-danger"
      >
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <GridToolbar table={table} />

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-muted text-text-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    className="whitespace-nowrap px-5 py-4 font-semibold"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        disabled={!header.column.getCanSort()}
                        onClick={header.column.getToggleSortingHandler()}
                        className="inline-flex items-center gap-2"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}

                        {{
                          asc: "↑",
                          desc: "↓",
                        }[header.column.getIsSorted() as string] ?? ""}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-border">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-surface-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-4 text-text">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="px-5 py-12 text-center text-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination table={table} />
    </div>
  );
}
