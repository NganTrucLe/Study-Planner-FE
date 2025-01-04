import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import { BaseTable } from "../base-table";
import { useGetSessions } from "@/hooks/react-query/useSessions";
import { columns } from "./column";

// Only 2 type of table, if more, refactor this component, right now we just do WET
export function TotalSessionsTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isRefetching } = useGetSessions({});

  const table = useReactTable({
    data: data?.slice(0, 10) ?? [],
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    enableSorting: false,
  });

  return (
    <BaseTable
      table={table}
      columns={columns}
      pagination={pagination}
      setPagination={setPagination}
      loading={isLoading || isRefetching}
    />
  );
}
