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
    cell(props) {
      return (
        <button
          className="flex flex-col items-start underline-offset-2 [&_div]:hover:underline"
          onClick={(event) => handleSelectClick(props.row.original, event)}
        >
          <div className="text-sm">{props.row.original.name}</div>
          <span className="text-xs text-gray-500">{props.row.original.subjectId?.name}</span>
        </button>
      );
    },
  },
  {
    header: "Due Date",
    accessorKey: "endDate",
    size: 150,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const { startDate, endDate } = row.original;
      return (
        <div className="my-1 text-sm">
          <p>{format(startDate, "dd/MM")}</p>
          <p className="text-gray-500">
            {startDate && endDate
              ? `${format(startDate, "hh:mmaaa")} - ${format(endDate, "hh:mmaaa")}`
              : "--"}
          </p>
        </div>
      );
    },
  },
  {
    header: "Priority",
    accessorKey: "priorityLevel",
    size: 80,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm">
        {taskPriorities.find((priority) => priority.value === row.getValue("priorityLevel"))?.icon}
        {taskPriorities.find((priority) => priority.value === row.getValue("priorityLevel"))?.label}
      </div>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 100,
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge
          className={cn("rounded-full px-2 py-1")}
          variant={
            taskStatuses.find((taskStatus) => taskStatus.value === status)?.variant ?? "secondary"
          }
        >
          {formatStatus(row.getValue("status"))}
        </Badge>
      );
    },
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
