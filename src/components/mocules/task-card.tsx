import { format } from "date-fns";
import { Task } from "../organisms/calendar/type";
import { CELL_HEIGHT } from "../organisms/calendar/constants";
import { cva, VariantProps } from "class-variance-authority";
import { useDrag } from "react-dnd";
import { cn } from "@/lib/utils";
import { EnumDraggableItemType } from "@/lib/enums";

export const taskCardVariants = cva(
  "absolute right-1 md:right-2 overflow-hidden rounded-sm border px-0.5 md:px-2 flex flex-col items-start",
  {
    variants: {
      color: {
        blue: "text-blue-900 bg-blue-200 border-blue-400",
        red: "text-red-900 bg-red-200 border-red-400",
        green: "text-green-900 bg-green-200 border-green-400",
        yellow: "text-yellow-900 bg-yellow-200 border-yellow-400",
        orange: "text-orange-900 bg-orange-200 border-orange-400",
        purple: "text-purple-900 bg-purple-200 border-purple-400",
        pink: "text-pink-900 bg-pink-200 border-pink-400",
      },
    },
    defaultVariants: {
      color: "blue",
    },
  }
);
type TaskCardProps = VariantProps<typeof taskCardVariants> &
  Task & {
    offset?: number;
  };
export default function TaskCard({ offset = 0, ...props }: TaskCardProps) {
  const { name, startDate: startDateData, endDate: endDateData, color } = props;
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: EnumDraggableItemType.TASK,
    item: props,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const startDate = new Date(startDateData);
  const endDate = new Date(endDateData);
  return (
    <button
      className={cn(
        taskCardVariants({ color }),
        isDragging && "border-dashed bg-opacity-40 opacity-90"
      )}
      style={{
        top: startDate.getHours() * CELL_HEIGHT + startDate.getMinutes() * (CELL_HEIGHT / 60),
        zIndex: 10,
        height:
          (endDate.getHours() - startDate.getHours()) * CELL_HEIGHT +
          (endDate.getMinutes() - startDate.getMinutes()) * (CELL_HEIGHT / 60),
        left: offset * 4,
      }}
      ref={dragRef}
    >
      <h6 className="text-left text-sm font-semibold leading-none">{name}</h6>
      <p className="text-xs">
        {format(startDate, "hh:mmaaa")} - {format(endDate, "hh:mmaaa")}
      </p>
    </button>
  );
}
