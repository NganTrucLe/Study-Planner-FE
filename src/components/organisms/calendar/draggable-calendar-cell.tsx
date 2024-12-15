import { useDrop } from "react-dnd";
import { CELL_HEIGHT } from "./constants";
import { cn } from "@/lib/utils";
import { addMilliseconds } from "date-fns";
import useTaskStore from "./use-task-store";
import { Task } from "./type";
import { EnumDraggableItemType } from "@/lib/enums";

type DraggableCalendarCellProps = {
  startDate: Date | string;
};

function SubCell({ startDate }: DraggableCalendarCellProps) {
  const { scheduleTask } = useTaskStore();

  const onDrop = (item: Task) => {
    if (item) {
      // console.log(item);
      const duration = item.endDate.getTime() - item.startDate.getTime();
      scheduleTask(item, {
        ...item,
        startDate: new Date(startDate),
        endDate: addMilliseconds(new Date(startDate), duration),
      });
    }
  };

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: EnumDraggableItemType.TASK,
      drop: (item: Task) => {
        // TODO: bug when dragging item, the data is not updated
        // console.log("item", item);
        onDrop(item);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [startDate]
  );
  return (
    <div
      className={cn(
        "h-full flex-1 cursor-pointer hover:bg-gray-50 [&_p]:first:hidden",
        isOver && "bg-gray-200/80"
      )}
      style={{
        height: CELL_HEIGHT / 4,
      }}
      ref={drop}
    />
  );
}
export default function DraggableCalendarCell({ startDate }: DraggableCalendarCellProps) {
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
