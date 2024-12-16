import TaskForm from "@/components/organisms/task-management/task-form";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge, Button } from "@/components/ui";
import { Circle, Plus, Trash } from "lucide-react";
import { DataTable } from "../../organisms/task-management/data-table";
import { EnumTaskColor, EnumTaskPriority, EnumTaskStatus } from "@/lib/enums";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
  subjectColors,
  taskPriorities,
  taskStatuses,
} from "@/components/organisms/task-management/constants";
import FilterSortBar from "../../organisms/task-management/filter-sort-bar";
import SubjectForm from "@/components/organisms/task-management/subject-form";
import SearchBar from "@/components/organisms/task-management/search-bar";
import { useCreateTask, useDeleteTask, useUpdateTask } from "@/hooks/react-query/useTasks";
import { formatStatus } from "@/components/organisms/task-management/utils";
import { Task } from "@/lib/types/task.type";

const taskList: Task[] = [
  {
    id: "123456",
    name: "Task 1",
    description: "Description 1",
    startDate: new Date("2024-12-15"),
    endDate: new Date("2024-12-15"),
    status: EnumTaskStatus.TODO,
    subject: "Subject 1",
    userId: "1",
    priority: EnumTaskPriority.LOW,
    color: EnumTaskColor.RED,
  },
  {
    id: "654321",
    name: "Task 2",
    description: "Description 2",
    startDate: new Date("2024-12-16"),
    endDate: new Date("2024-12-16"),
    status: EnumTaskStatus.DONE,
    subject: "Subject 2",
    userId: "2",
    priority: EnumTaskPriority.MEDIUM,
    color: EnumTaskColor.BLUE,
  },
  {
    id: "098765",

    name: "Task 3",
    description: "Description 3",
    startDate: new Date("2024-12-17"),
    endDate: new Date("2024-12-17"),
    status: EnumTaskStatus.IN_PROGRESS,
    subject: "Subject 3",
    userId: "3",
    priority: EnumTaskPriority.HIGH,
    color: EnumTaskColor.GREEN,
  },
];

const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>(taskList);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [prioritySort, setPrioritySort] = useState("default");
  const [dueDateSort, setDueDateSort] = useState("default");
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // const { data, isLoading } = useWeeklyTasks();

  // const { data, isLoading, error } = useQuery({
  //   queryKey: ["tasks", searchTerm],
  //   queryFn: getTasks,
  //   enabled: searchTerm.length > 0,
  //   refetchOnWindowFocus: false,
  // });

  // const { data, isLoading, error } = useTasks(
  //   { status: filter },
  //   `${prioritySort},${dueDateSort}`,
  //   page,
  //   limit
  // );

  //TODO: Set tasks data

  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();

  const handlePrioritySortChange = (value: string) => {
    setPrioritySort(value);
  };

  const handleDueDateSortChange = (value: string) => {
    setDueDateSort(value);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
  };

  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateTask = () => {
    if (selectedTask) {
      updateTask({ id: selectedTask.id, data: selectedTask });
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
      deleteTask(selectedTask.id);
      setSelectedTask(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const columns: ColumnDef<Task>[] = [
    {
      header: "",
      accessorKey: "color",
      size: 10,
      cell: ({ row }) => (
        <Circle
          size={16}
          color={subjectColors.find((color) => color.value === row.getValue("color"))?.color}
          fill={subjectColors.find((color) => color.value === row.getValue("color"))?.color}
        />
      ),
    },
    { header: "Name", accessorKey: "name", size: 400 },
    {
      header: "Due Date",
      accessorKey: "endDate",
      size: 100,
      cell: ({ row }) =>
        row.getValue("endDate") ? format(new Date(row.getValue("endDate")), "dd/MM/yyyy") : "--",
    },
    {
      header: "Priority",
      accessorKey: "priority",
      size: 40,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {taskPriorities.find((priority) => priority.value === row.getValue("priority"))?.icon}
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      size: 40,
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
    {
      header: "",
      accessorKey: "id",
      size: 40,

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
    },
  ];

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // console.log(data);

  return (
    <div className="flex h-full w-full flex-col gap-4 p-8">
      <div>
        <h1 className="mb-6 flex-wrap text-2xl font-semibold">Task List</h1>
        <div className="flex justify-between">
          <SearchBar onSearch={handleSearch} />
          <FilterSortBar
            filter={filter}
            setFilter={setFilter}
            prioritySort={prioritySort}
            dueDateSort={dueDateSort}
            handlePrioritySortChange={handlePrioritySortChange}
            handleDueDateSortChange={handleDueDateSortChange}
          />
        </div>

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
          <DataTable columns={columns} data={tasks || []} onRowClick={handleRowClick} />
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
