import { ScrollArea } from "@/components/ui/scroll-area";
import UnscheduledTaskCard from "./unscheduled-task-card";
import { Task } from "@/lib/types/task.type";
import { EnumTaskColor, EnumTaskPriority, EnumTaskStatus } from "@/lib/enums";
import { useGetUnscheduledTasks } from "@/hooks/react-query/useTasks";
import { Loader2 } from "lucide-react";

export default function UnscheduledTaskList() {
  const { data, isLoading } = useGetUnscheduledTasks();
  return (
    <div className="col-span-2 flex min-h-96 flex-col overflow-hidden rounded-2xl border">
      <div className="grid h-14 place-items-center border-b bg-gray-100 text-center">
        <h2 className="text-lg font-semibold">Unscheduled tasks</h2>
      </div>
      <ScrollArea className="h-full flex-1 px-4">
        <div className="h-4" />
        <div className="flex flex-col gap-2">
          {isLoading && (
            <div className="grid h-32 place-items-center">
              <Loader2 size={32} className="animate-spin text-muted-foreground" />
            </div>
          )}
          {data && data.tasks.map((task) => <UnscheduledTaskCard key={task._id} {...task} />)}
        </div>
        <div className="h-4" />
      </ScrollArea>
    </div>
  );
}
