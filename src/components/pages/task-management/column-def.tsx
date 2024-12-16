import { taskPriorities, taskStatuses } from "@/lib/constants";
import { formatStatus } from "@/components/organisms/task-management/utils";
import { Badge, Button } from "@/components/ui";
import { Task } from "@/lib/types/task.type";
import { cn } from "@/lib/utils";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { Trash } from "lucide-react";

const columnHelper = createColumnHelper<Task>();

export const columns: (
  handleDeleteClick: (task: Task, event: React.MouseEvent) => void
) => ColumnDef<Task>[] = (handleDeleteClick) => [
  { header: "Name", accessorKey: "name", size: 350 },
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
        className={cn(
          "rounded-full px-2 py-1 text-white",
          taskStatuses.find((status) => status.value === row.getValue("status"))?.color
        )}
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
