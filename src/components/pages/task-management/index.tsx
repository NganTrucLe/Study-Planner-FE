import TaskForm from "@/components/organisms/task-management/task-form";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { EnumTaskPriority, EnumTaskStatus, TaskPriorityLevel, TaskStatus } from "@/lib/enums";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import SubjectForm from "@/components/organisms/task-management/subject-form";
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from "@/hooks/react-query/useTasks";
import { Task } from "@/lib/types/task.type";
import ReactTable from "@/components/organisms/react-table";
import { TaskQueryParams } from "@/services/task";
import { columns } from "./column-def";

const filterOptions = {
  status: [EnumTaskStatus.TODO, EnumTaskStatus.IN_PROGRESS, EnumTaskStatus.DONE],
  priorityLevel: [EnumTaskPriority.LOW, EnumTaskPriority.MEDIUM, EnumTaskPriority.HIGH],
};

const TaskManager = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [queryParams, setQueryParams] = useState<TaskQueryParams>({});

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data } = useTasks(queryParams);

  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  // const handleRowClick = (task: Task) => {
  //   setSelectedTask(task);
  //   setIsUpdateDialogOpen(true);
  // };

  const handleUpdateTask = () => {
    if (selectedTask) {
      updateTask({ id: selectedTask._id, data: selectedTask });
      setSelectedTask(null);
      setIsUpdateDialogOpen(false);
    }
  };

  const handleDeleteClick = (task: Task, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedTask(task);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTask) {
      deleteTask(selectedTask._id);
      setSelectedTask(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const table = useReactTable({
    data: data?.tasks || [],
    columns: columns(handleDeleteClick),
    columnResizeMode: "onChange",
    manualPagination: true,
    manualSorting: true,
    pageCount: data?.totalPages || 0,
    rowCount: data?.totalCount || 0,
    getRowId: (row) => row._id,
    getCoreRowModel: getCoreRowModel(),
  });

  const state = {
    pagination: table.getState().pagination,
    sorting: table.getState().sorting,
    columnFilters: table.getState().columnFilters,
  };

  useEffect(() => {
    const { pageIndex, pageSize } = state.pagination;
    const filters = state.columnFilters;

    const queryParams: TaskQueryParams = {
      page: pageIndex,
      limit: pageSize,
    };

    if (state.sorting && state.sorting.length > 0) {
      queryParams.sortBy = state.sorting[0].id;
      queryParams.sortOrder = state.sorting[0].desc ? "desc" : "asc";
    }

    if (filters.find((filter) => filter.id === "name")) {
      queryParams.name = filters.find((filter) => filter.id === "name")?.value as string;
    }

    if (filters.find((filter) => filter.id === "status")) {
      queryParams.status = filters.find((filter) => filter.id === "status")?.value as TaskStatus[];
    }

    if (filters.find((filter) => filter.id === "priorityLevel")) {
      queryParams.priorityLevel = filters.find((filter) => filter.id === "priorityLevel")
        ?.value as TaskPriorityLevel[];
    }

    // TODO: get selected row

    setQueryParams(queryParams);
  }, [JSON.stringify(state)]);

  return (
    <div className="flex h-full w-full flex-col gap-4 p-8">
      <div>
        <h1 className="mb-6 flex-wrap text-2xl font-semibold">Task List</h1>

        <div className="m-4 flex justify-end">
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex gap-2">
                  <Plus size={16} /> Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>
                  <TaskForm onTaskMutate={createTask} />
                </DialogDescription>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Plus size={16} /> Add Subject
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Create New Subject</DialogTitle>
                <DialogDescription>
                  <SubjectForm onCreate={(data) => console.log(data)} />
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mt-4 flex h-full w-full flex-wrap gap-2 border">
          <ReactTable table={table} filterOptions={filterOptions} />
        </div>

        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>
              {selectedTask && (
                <TaskForm onTaskMutate={handleUpdateTask} initialData={selectedTask} />
              )}
            </DialogDescription>
          </DialogContent>
        </Dialog>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>Are you sure you want to delete this task?</DialogDescription>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default TaskManager;