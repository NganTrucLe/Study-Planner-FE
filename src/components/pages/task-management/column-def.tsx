import { taskPriorities, taskStatuses } from "@/lib/constants";
import { formatStatus } from "@/components/organisms/task-management/utils";
import { Badge, Button } from "@/components/ui";
import { Task } from "@/lib/types/task.type";
import { cn } from "@/lib/utils";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash } from "lucide-react";
import React from "react";

const columnHelper = createColumnHelper<Task>();

export const columns: (
  handleSelectClick: (task: Task, event: React.MouseEvent) => void,
  handleDeleteClick: (task: Task, event: React.MouseEvent) => void
) => ColumnDef<Task>[] = (handleSelectClick, handleDeleteClick) => [
  {
    header: "Name",
    accessorKey: "name",
    size: 350,
    cell(props) {
      return (
        <button
          className="underline-offset-2 hover:underline"
          onClick={(event) => handleSelectClick(props.row.original, event)}
        >
          {props.row.original.name}
        </button>
      );
    },
  },
  {
    header: "Due Date",
    accessorKey: "endDate",
    size: 150,
    enableColumnFilter: false,
    cell: ({ row }) =>
      row.getValue("endDate") ? format(new Date(row.getValue("endDate")), "dd/MM/yyyy") : "--",
  },
  {
    header: "Priority",
    accessorKey: "priorityLevel",
    size: 100,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {taskPriorities.find((priority) => priority.value === row.getValue("priorityLevel"))?.icon}
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 100,
    cell: ({ row }) => (
      <Badge
        className={cn("rounded-full px-2 py-1 text-white")}
        style={{
          backgroundColor: taskStatuses.find((status) => status.value === row.getValue("status"))
            ?.color,
        }}
      >
        {formatStatus(row.getValue("status"))}
      </Badge>
    ),
  },
  columnHelper.display({
    header: "",
    id: "actions",
    size: 100,
    cell: ({ row }) => (
      <div className="z-10 flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={(event) => handleDeleteClick(row.original, event)}
        >
          <Trash size={16} />
        </Button>
      </div>
    ),
  }),
];
