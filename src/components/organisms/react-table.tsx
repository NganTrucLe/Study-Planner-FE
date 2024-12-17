import {
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  EyeOff,
  MoreVertical,
  Pin,
  PinOff,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Column, flexRender, Table } from "@tanstack/react-table";

import { Filter, SelectFilter } from "../mocules/table-inputs/table-filter";
import TablePagination from "../mocules/table-inputs/table-pagination";
import { cn } from "@/lib/utils";

type FilterOptions = { [key: string]: (string | boolean)[] };

type ReactTableProps<T> = {
  table: Table<T>;
  filterOptions?: FilterOptions;
};

function TableHeadPopover<T>({ column }: { column: Column<T> }) {
  const [_, setOpen] = React.useState(false);

  const togglePinColumn = () => {
    column.pin(column.getIsPinned() ? false : "left");
    setOpen(false);
  };

  return (
    <Popover>
      <PopoverTrigger className="absolute right-3 top-3 text-neutral-500">
        <MoreVertical size={16} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-fit p-0.5">
        <div className="flex flex-col items-start justify-center gap-1.5 font-normal">
          <Button variant="ghost" className="min-w-[140px] justify-start" onClick={togglePinColumn}>
            {column.getIsPinned() ? (
              <div className="flex items-center gap-1.5">
                <PinOff size={20} className="inline" />
                Unpin column
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Pin size={20} className="inline" />
                Pin column
              </div>
            )}
          </Button>

          <Button
            variant="ghost"
            className="min-w-[140px] justify-start"
            onClick={() => column.toggleVisibility()}
          >
            <div className="flex items-center gap-1.5">
              <EyeOff size={20} className="inline" />
              Hide column
            </div>
          </Button>

          {column.getIsSorted() ? (
            <button
              className="underline"
              onClick={() => {
                column.clearSorting();
                setOpen(false);
              }}
            >
              Remove sorting
            </button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

type TableHeadProps<T> = {
  table: Table<T>;
  filterOptions?: FilterOptions;
};

function TableHead<T>({ table, filterOptions }: TableHeadProps<T>) {
  return (
    <thead className="bg-gray-100">
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <th
                key={header.id}
                style={{ width: `calc(var(--header-${header.id}-size) * 1px)`, height: "62px" }}
                className="relative"
              >
                <div className="flex h-full flex-col justify-start gap-1.5 px-3 py-2">
                  <div
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      header.column.getCanSort() ? "cursor-pointer" : "",
                      "inline-flex flex-row items-center self-start font-semibold text-neutral-700 hover:text-neutral-900"
                    )}
                    title={
                      header.column.getCanSort()
                        ? header.column.getNextSortingOrder() === "asc"
                          ? "Sort ascending"
                          : header.column.getNextSortingOrder() === "desc"
                            ? "Sort descending"
                            : "Clear sort"
                        : undefined
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                    <span className="ml-3">
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() == "asc" ? (
                          <ArrowDownWideNarrow size={16} className="text-blue-500" />
                        ) : (
                          <ArrowUpWideNarrow size={16} className="text-blue-500" />
                        )
                      ) : (
                        header.column.getCanSort() && <ArrowDownUp size={16} />
                      )}
                    </span>
                  </div>
                  {header.column.getCanFilter() &&
                    (filterOptions?.[header.id] ? (
                      <SelectFilter column={header.column} options={filterOptions[header.id]} />
                    ) : (
                      <Filter column={header.column} />
                    ))}

                  <TableHeadPopover column={header.column} />

                  {/* <div
                    onDoubleClick={() => header.column.resetSize()}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className={`resizer${header.column.getIsResizing() ? "isResizing" : ""}`}
                  /> */}
                </div>
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
}

function TableBody<T>({ table }: { table: Table<T> }) {
  return (
    <tbody>
      {table.getRowModel().rows.map((row) => (
        <tr key={row.id} className="border-b px-3 first:border-t">
          {row.getVisibleCells().map((cell) => (
            <td
              key={cell.id}
              className="px-3 py-1"
              style={{
                width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export default function ReactTable<T extends object>({ table, filterOptions }: ReactTableProps<T>) {
  const pageSize = table.getState().pagination.pageSize;
  const pageOffset = table.getState().pagination.pageIndex;

  const columnSizingInfo = table.getState().columnSizingInfo;
  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};

    for (let i = 0; i < headers.length; i++) {
      if (!headers[i]) continue;

      const header = headers[i];
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnSizingInfo, table]); // columnSizingInfo cần thiết nên không thể bỏ

  return (
    <div className="flex w-full flex-col items-start overflow-x-auto">
      {table.getIsAllColumnsVisible() ? null : (
        <Button
          className="mb-4"
          variant="secondary"
          onClick={() => table.toggleAllColumnsVisible()}
        >
          Show all columns
        </Button>
      )}
      <div className="w-full rounded-md border">
        <table style={columnSizeVars} className="react-table w-full rounded-lg">
          <TableHead table={table} filterOptions={filterOptions} />
          <TableBody table={table} />
        </table>
      </div>
      <TablePagination
        pageCount={table.getPageCount()}
        pageOffset={pageOffset}
        pageSize={pageSize}
        setPageSize={table.setPageSize}
        setPageIndex={table.setPageIndex}
        canPreviousPage={table.getCanPreviousPage()}
        canNextPage={table.getCanNextPage()}
      />
    </div>
  );
}
