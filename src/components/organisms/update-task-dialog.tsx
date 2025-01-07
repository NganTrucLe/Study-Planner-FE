import _ from "lodash";
import { useCallback } from "react";

import { useUpdateTask } from "@/hooks/react-query/useTasks";
import { EnumTaskStatus } from "@/lib/enums";
import { TaskFormValue, TaskFormValueWithId } from "@/lib/types/task.type";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import CreateSessionDialog from "./learning-session/create-session-dialog";
import TaskForm from "./task-management/task-form";

type UpdateTaskDialogProps = {
  task: TaskFormValueWithId | null;
  openDialog: boolean;
  onOpenDialogChange: (open: boolean) => void;
};

export const removeTaskId = <T extends { _id: string }>(task: T): Omit<T, "_id"> => {
  const { _id, ...rest } = task;
  return rest;
};

export default function UpdateTaskDialog({
  task,
  openDialog,
  onOpenDialogChange,
}: UpdateTaskDialogProps) {
  const { mutate: updateTask } = useUpdateTask();

  const handleUpdateTask = useCallback(
    (data: TaskFormValue) => {
      if (!task) return;
      const omitted = _.omit(data, ["_id", "userId", "createdAt", "updatedAt"]) as TaskFormValue;
      updateTask({
        id: task._id as string,
        data: omitted,
      });
      onOpenDialogChange(false);
    },
    [updateTask, onOpenDialogChange]
  );

  return (
    <Dialog open={openDialog} onOpenChange={onOpenDialogChange}>
      <DialogContent>
        <DialogTitle>Task Details</DialogTitle>
        <DialogDescription>
          {task && (
            <TaskForm
              onTaskMutate={handleUpdateTask}
              initialData={removeTaskId(task)}
              type="update"
            />
          )}
        </DialogDescription>
        <CreateSessionDialog
          selectedTaskId={task?._id}
          disabled={task?.status === EnumTaskStatus.DONE || task?.status === EnumTaskStatus.OVERDUE}
          variant="outline"
        />
        <p className="-mt-2 text-sm text-neutral-500">
          {task?.status === EnumTaskStatus.OVERDUE
            ? "Task is overdue, cannot create focus session"
            : task?.status === EnumTaskStatus.TODO && "This will convert the task to In Progress"}
        </p>
      </DialogContent>
    </Dialog>
  );
}
