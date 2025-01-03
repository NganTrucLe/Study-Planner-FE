import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import _ from "lodash";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import TabBar from "@/components/mocules/tab-bar";
import { parseTask, removeTaskId } from "@/components/organisms/calendar/utils";
import ReactTable from "@/components/organisms/react-table";
import SubjectForm from "@/components/organisms/task-management/subject-form";
import TaskForm from "@/components/organisms/task-management/task-form";
import { Button } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateSubject } from "@/hooks/react-query/useSubjects";
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from "@/hooks/react-query/useTasks";
import { EnumTaskPriority, EnumTaskStatus, TaskPriorityLevel, TaskStatus } from "@/lib/enums";
import { Task, TaskFormValue, TaskFormValueWithId } from "@/lib/types/task.type";
import { TaskQueryParams } from "@/services/task";

import { columns } from "./column-def";

const filterOptions = {
  status: [EnumTaskStatus.TODO, EnumTaskStatus.IN_PROGRESS, EnumTaskStatus.DONE],
  priorityLevel: [EnumTaskPriority.LOW, EnumTaskPriority.MEDIUM, EnumTaskPriority.HIGH],
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const TaskManager = () => {
  const selectedTask = useRef<TaskFormValueWithId | null>(null);

  const [queryParams, setQueryParams] = useState<TaskQueryParams>({
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
  });

  const [openUpdateDialog, setUpdateDialog] = useState(false);
  const [openDeleteDialog, setDeleteDialog] = useState(false);

  const { data } = useTasks(queryParams);

  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const { mutate: createSubject } = useCreateSubject();

  const handleRowClick = useCallback(
    (task: Task) => {
      selectedTask.current = parseTask(task);
      setUpdateDialog(true);
    },
    [setUpdateDialog]
  );

  const handleUpdateTask = useCallback(
    (data: TaskFormValue) => {
      if (!selectedTask.current) return;
      const omitted = _.omit(data, ["_id", "userId", "createdAt", "updatedAt"]) as TaskFormValue;
      updateTask({
        id: selectedTask.current._id as string,
        data: omitted,
      });
      selectedTask.current = null;
      setUpdateDialog(false);
    },
    [updateTask, setUpdateDialog]
  );

  const handleDeleteClick = useCallback(
    (task: Task, event: React.MouseEvent) => {
      event.stopPropagation();
      selectedTask.current = parseTask(task);
      setDeleteDialog(true);
    },
    [setDeleteDialog]
  );

  const handleConfirmDelete = () => {
    if (selectedTask.current) {
      deleteTask(selectedTask.current._id);
      selectedTask.current = null;
      setDeleteDialog(false);
    }
  };

  const columnDef = useMemo<ColumnDef<Task>[]>(
    () => columns(handleRowClick, handleDeleteClick),
    [handleRowClick, handleDeleteClick]
  );

  const table = useReactTable({
    data: data?.tasks || [],
    columns: columnDef,
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
      page: pageIndex + 1,
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

    setQueryParams(queryParams);
  }, [
    JSON.stringify(state.columnFilters),
    JSON.stringify(state.pagination),
    JSON.stringify(state.sorting),
  ]);

  return (
    <div className="size-full">
      <div className="sticky top-0 z-10 h-32 bg-white">
        <div className="mb-2 flex flex-row items-center justify-between px-8 pt-8">
          <h1 className="flex-wrap text-3xl font-semibold">My Task List</h1>
          <div className="flex justify-end">
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
                    <SubjectForm onCreate={createSubject} />
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <TabBar />
      </div>

      <div className="flex size-full flex-wrap gap-2 p-8">
        <ReactTable table={table} filterOptions={filterOptions} />
      </div>

      <Dialog open={openUpdateDialog} onOpenChange={setUpdateDialog}>
        <DialogContent>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>
            {selectedTask.current && (
              <TaskForm
                onTaskMutate={handleUpdateTask}
                initialData={removeTaskId(selectedTask.current)}
              />
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <Dialog open={openDeleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>Are you sure you want to delete this task?</DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManager;
