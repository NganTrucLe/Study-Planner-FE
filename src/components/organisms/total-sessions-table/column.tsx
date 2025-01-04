/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Session } from "@/lib/types/session.type";

export const columns: ColumnDef<Session>[] = [
  {
    accessorKey: "createdAt",
    header: "Start Time",
    cell: ({ row }) => format(row.original.createdAt, "dd/MM HH:mm"),
  },
  {
    accessorKey: "duration",
    header: "Session duration",
    cell: ({ row }) => `${row.original.duration / 60} minutes`,
  },
  {
    accessorKey: "duration",
    header: "True duration",
    cell: ({ row }) => `${Math.ceil(row.original.trueDuration / 60)} minutes`,
  },
];
