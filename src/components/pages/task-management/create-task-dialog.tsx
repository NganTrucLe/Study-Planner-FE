import TaskForm from "@/components/organisms/task-management/task-form";
import { useCreateTask } from "@/hooks/react-query/useTasks";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function CreateTaskDialog() {
  const { mutate: createTask } = useCreateTask();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          <Plus size={16} /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogDescription>
          <TaskForm
            onTaskMutate={(value) => {
              createTask(value, {
                onSettled: () => {
                  setOpen(false);
                },
              });
            }}
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
