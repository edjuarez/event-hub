import type { Table } from "@tanstack/react-table";

interface PaginationProps<TData> {
  table: Table<TData>;
}

function getVisiblePages(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages === 0) return [];

  const pages = new Set<number>();

  pages.add(0);
  pages.add(totalPages - 1);

  for (
    let page = Math.max(0, currentPage - 1);
    page <= Math.min(totalPages - 1, currentPage + 1);
    page++
  ) {
    pages.add(page);
  }

  const sortedPages = [...pages].sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];

  sortedPages.forEach((page, index) => {
    if (index > 0 && page - sortedPages[index - 1] > 1) {
      result.push("ellipsis");
    }

    result.push(page);
  });

  return result;
}

export function Pagination<TData>({ table }: PaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalPages = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const visibleRows = table.getRowModel().rows.length;

  const firstRow = totalRows === 0 ? 0 : currentPage * pageSize + 1;
  const lastRow = firstRow + visibleRows - 1;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex flex-col gap-4 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <label htmlFor="page-size">Rows per page</label>

        <select
          id="page-size"
          value={pageSize}
          onChange={(event) => table.setPageSize(Number(event.target.value))}
          className="rounded-md border border-border bg-surface px-2 py-1 text-text"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-muted" aria-live="polite">
          Showing {firstRow}–{lastRow} of {totalRows}
        </p>

        <nav aria-label="Table pagination" className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Go to first page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.setPageIndex(0)}
            className="rounded-md px-2 py-1 hover:bg-surface-muted disabled:opacity-40"
          >
            «
          </button>

          <button
            type="button"
            aria-label="Go to previous page"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            className="rounded-md px-2 py-1 hover:bg-surface-muted disabled:opacity-40"
          >
            ‹
          </button>

          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className="px-1 text-text-muted">
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                aria-label={`Go to page ${page + 1}`}
                aria-current={currentPage === page ? "page" : undefined}
                onClick={() => table.setPageIndex(page)}
                className={`min-w-8 rounded-md px-2 py-1 ${
                  currentPage === page
                    ? "bg-ink text-white"
                    : "hover:bg-surface-muted"
                }`}
              >
                {page + 1}
              </button>
            ),
          )}

          <button
            type="button"
            aria-label="Go to next page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            className="rounded-md px-2 py-1 hover:bg-surface-muted disabled:opacity-40"
          >
            ›
          </button>

          <button
            type="button"
            aria-label="Go to last page"
            disabled={!table.getCanNextPage()}
            onClick={() => table.setPageIndex(totalPages - 1)}
            className="rounded-md px-2 py-1 hover:bg-surface-muted disabled:opacity-40"
          >
            »
          </button>
        </nav>
      </div>
    </div>
  );
}
