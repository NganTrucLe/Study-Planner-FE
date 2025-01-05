import { TaskFormValue } from "@/lib/types/task.type";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import TaskForm from "./task-management/task-form";

import _ from "lodash";
import { useCallback } from "react";
import { useCreateTask } from "@/hooks/react-query/useTasks";
import { create } from "zustand";
import { addMinutes } from "date-fns";
import { EnumTaskStatus, EnumTaskPriority } from "@/lib/enums";

type CreateTaskDialogProps = {
  startDate: Date | string | null;
  openDialog: boolean;
  onOpenDialogChange: (open: boolean) => void;
  setStartDate: (date: Date | string | null) => void;
};

export const useCreateTaskDialog = create<CreateTaskDialogProps>((set) => ({
  startDate: null,
  openDialog: false,
  onOpenDialogChange: (open: boolean) => set({ openDialog: open }),
  setStartDate: (date: Date | string | null) => set({ startDate: date }),
}));

export default function UpdateTaskDialog() {
  const { mutate: createTask } = useCreateTask();
  const { startDate, openDialog, onOpenDialogChange } = useCreateTaskDialog();

  const handleCreateTask = useCallback(
    (data: TaskFormValue) => {
      createTask(data, {
        onSettled: () => {
          onOpenDialogChange(false);
        },
      });
    },
    [createTask, onOpenDialogChange]
  );

  return (
    <Dialog open={openDialog} onOpenChange={onOpenDialogChange}>
      <DialogContent>
        <DialogTitle>Create new task</DialogTitle>
        <DialogDescription>
          <TaskForm
            onTaskMutate={handleCreateTask}
            initialData={{
              startDate: startDate ? new Date(startDate) : undefined,
              endDate: startDate ? addMinutes(startDate, 30) : undefined,
              status: EnumTaskStatus.TODO,
              priorityLevel: EnumTaskPriority.MEDIUM,
            }}
            type="create"
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
