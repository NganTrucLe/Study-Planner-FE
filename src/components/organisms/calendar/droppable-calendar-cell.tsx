import { useDrop } from "react-dnd";
import { CELL_HEIGHT } from "./constants";
import { cn } from "@/lib/utils";
import { addMilliseconds } from "date-fns";
import { Task } from "@/lib/types/task.type";
import { EnumDraggableItemType, EnumTaskStatus } from "@/lib/enums";
import { useUpdateTask } from "@/hooks/react-query/useTasks";
import { useCallback } from "react";
import { useCreateTaskDialog } from "../create-task-dialog";

type DraggableCalendarCellProps = {
  startDate: Date | string;
};

const getNewStatus = (
  status: EnumTaskStatus,
  newStartDate: string | Date,
  newEndDate: string | Date
) => {
  if (status == EnumTaskStatus.DONE) return status;
  const currentTime = new Date();
  if (status == EnumTaskStatus.OVERDUE && newEndDate > currentTime) {
    if (newStartDate > currentTime) return EnumTaskStatus.TODO;
    return EnumTaskStatus.IN_PROGRESS;
  }
  if (newEndDate < currentTime) return EnumTaskStatus.OVERDUE;
  return EnumTaskStatus.IN_PROGRESS;
};

function SubCell({ startDate }: DraggableCalendarCellProps) {
  const updateTask = useUpdateTask();
  const { setStartDate, onOpenDialogChange } = useCreateTaskDialog();

  const onDrop = useCallback(
    (item: Task) => {
      if (item) {
        const duration = item.endDate
          ? new Date(item.endDate).getTime() - new Date(item.startDate).getTime()
          : 30 * 60 * 1000;
        const newEndDate = addMilliseconds(new Date(startDate), duration);
        const newStatus = getNewStatus(item.status, startDate, newEndDate);

        updateTask.mutate({
          id: item._id,
          data: {
            name: item.name,
            startDate: new Date(startDate),
            endDate: newEndDate,
            status: newStatus,
          },
        });
      }
    },
    [startDate, updateTask]
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: [EnumDraggableItemType.TASK, EnumDraggableItemType.UNSCHEDULED_TASK],
      drop: (item: Task, monitor) => {
        const itemType = monitor.getItemType();
        if (itemType == EnumDraggableItemType.TASK) {
          onDrop(item);
        } else {
          onDrop(item);
        }
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [startDate]
  );
  return (
    <button
      className={cn(
        "h-full flex-1 cursor-pointer hover:bg-gray-100 [&_p]:first:hidden",
        isOver && "bg-gray-200/80"
      )}
      style={{
        height: CELL_HEIGHT / 4,
      }}
      ref={drop}
      type="button"
      onClick={() => {
        setStartDate(startDate);
        onOpenDialogChange(true);
      }}
    />
  );
}
export default function DroppableCalendarCell({ startDate }: DraggableCalendarCellProps) {
  return (
    <div
      className={"flex cursor-pointer flex-col border-b [&_p]:first:hidden"}
      style={{
        height: CELL_HEIGHT,
      }}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <SubCell key={i} startDate={addMilliseconds(new Date(startDate), i * 15 * 60 * 1000)} />
      ))}
    </div>
  );
}
