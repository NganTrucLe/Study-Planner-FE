import { ScrollArea } from "@/components/ui/scroll-area";
import UnscheduledTaskCard from "./unscheduled-task-card";
import { Task } from "@/lib/types/task.type";
import { EnumTaskColor, EnumTaskPriority, EnumTaskStatus } from "@/lib/enums";

const mockTasks: Task[] = [
  {
    _id: "1",
    name: "Task 1",
    description: "This is task 1",
    startDate: "2022-01-01",
    endDate: "2022-01-02",
    status: EnumTaskStatus.TODO,
    userId: "1",
    priorityLevel: EnumTaskPriority.HIGH,
    subjectId: {
      _id: "1",
      name: "Subject 1",
      color: EnumTaskColor.PINK,
    },
  },
  {
    _id: "2",
    name: "Task 2",
    description: "This is task 2",
    startDate: "2022-01-01",
    endDate: "2022-01-02",
    status: EnumTaskStatus.TODO,
    userId: "1",
    priorityLevel: EnumTaskPriority.HIGH,

    subjectId: {
      _id: "1",
      name: "Subject 1",
      color: EnumTaskColor.GREEN,
    },
  },
  {
    _id: "3",
    name: "Task 3",
    description: "This is task 3",
    startDate: "2022-01-01",
    endDate: "2022-01-02",
    status: EnumTaskStatus.TODO,
    userId: "1",
    priorityLevel: EnumTaskPriority.HIGH,
  },
  {
    _id: "4",
    name: "Task 4",
    description: "This is task 4",
    startDate: "2022-01-01",
    endDate: "2022-01-02",
    status: EnumTaskStatus.TODO,
    userId: "1",
    priorityLevel: EnumTaskPriority.HIGH,
  },
  {
    _id: "5",
    name: "Task 5",
    description: "This is task 5",
    startDate: "2022-01-01",
    endDate: "2022-01-02",
    status: EnumTaskStatus.TODO,
    userId: "1",
    priorityLevel: EnumTaskPriority.HIGH,
    subjectId: {
      _id: "1",
      name: "Subject 1",
      color: EnumTaskColor.YELLOW,
    },
  },
  {
    _id: "6",
    name: "Task 4",
    description: "This is task 4",
    startDate: "2022-01-01",
    endDate: "2022-01-02",
    status: EnumTaskStatus.TODO,
    userId: "1",
    priorityLevel: EnumTaskPriority.HIGH,
  },
  {
    _id: "7",
    name: "Task 5",
    description: "This is task 5",
    startDate: "2022-01-01",
    endDate: "2022-01-02",
    status: EnumTaskStatus.TODO,
    userId: "1",
    priorityLevel: EnumTaskPriority.HIGH,
  },
  {
    _id: "8",
    name: "Task 4",
    description: "This is task 4",
    startDate: "2022-01-01",
    endDate: "2022-01-02",
    status: EnumTaskStatus.TODO,
    userId: "1",
    priorityLevel: EnumTaskPriority.HIGH,
  },
  {
    _id: "9",
    name: "Task 5",
    description: "This is task 5",
    startDate: "2022-01-01",
    endDate: "2022-01-02",
    status: EnumTaskStatus.TODO,
    userId: "1",
    priorityLevel: EnumTaskPriority.HIGH,
  },
];

export default function UnscheduledTaskList() {
  return (
    <div className="col-span-3 flex min-h-96 flex-col overflow-hidden rounded-2xl border">
      <div className="grid h-14 place-items-center border-b bg-gray-100 text-center">
        <h2 className="text-lg font-semibold">Unscheduled tasks</h2>
      </div>
      <ScrollArea className="h-full flex-1 px-4">
        <div className="h-4" />
        <div className="flex flex-col gap-2">
          {mockTasks.map((task) => (
            <UnscheduledTaskCard key={task._id} {...task} />
          ))}
        </div>
        <div className="h-4" />
      </ScrollArea>
    </div>
  );
}
