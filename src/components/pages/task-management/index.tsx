import TaskForm from "@/components/organisms/task-management/task-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { EnumTaskPriority, EnumTaskStatus, TaskPriorityLevel, TaskStatus } from "@/lib/enums";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import SubjectForm from "@/components/organisms/task-management/subject-form";
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from "@/hooks/react-query/useTasks";
import { Task, TaskDto } from "@/lib/types/task.type";
import ReactTable from "@/components/organisms/react-table";
import { TaskQueryParams } from "@/services/task";
import { columns } from "./column-def";
import { useCreateSubject } from "@/hooks/react-query/useSubjects";
import _ from "lodash";
import TabBar from "@/components/mocules/tab-bar";

const filterOptions = {
  status: [EnumTaskStatus.TODO, EnumTaskStatus.IN_PROGRESS, EnumTaskStatus.DONE],
  priorityLevel: [EnumTaskPriority.LOW, EnumTaskPriority.MEDIUM, EnumTaskPriority.HIGH],
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

const TaskManager = () => {
  const [selectedTask, setSelectedTask] = useState<TaskDto | null>(null);

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
      const taskDto: TaskDto = {
        ...task,
        startDate: new Date(task.startDate),
        endDate: new Date(task.endDate),
        subjectId: task?.subjectId?._id,
      };
      setSelectedTask(taskDto);
      setUpdateDialog(true);
    },
    [setSelectedTask, setUpdateDialog]
  );

  const handleUpdateTask = useCallback(
    (data: Partial<TaskDto>) => {
      updateTask({
        id: selectedTask?._id as string,
        data: _.omit(data, ["_id", "userId", "createdAt", "updatedAt"]),
      });
      setSelectedTask(null);
      setUpdateDialog(false);
    },
    [selectedTask, updateTask, setSelectedTask]
  );

  const handleDeleteClick = useCallback(
    (task: Task, event: React.MouseEvent) => {
      event.stopPropagation();
      setSelectedTask(task as unknown as TaskDto);
      setDeleteDialog(true);
    },
    [setSelectedTask, setDeleteDialog]
  );

  const handleConfirmDelete = () => {
    if (selectedTask) {
      deleteTask(selectedTask._id);
      setSelectedTask(null);
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
  }, [JSON.stringify(state)]);

  return (
    <div className="h-full w-full">
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

      <div className="flex h-full w-full flex-wrap gap-2 p-8">
        <ReactTable table={table} filterOptions={filterOptions} />
      </div>

      <Dialog open={openUpdateDialog} onOpenChange={setUpdateDialog}>
        <DialogContent>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>
            {selectedTask && (
              <TaskForm onTaskMutate={handleUpdateTask} initialData={selectedTask} />
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
