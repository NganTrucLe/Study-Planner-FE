import { format } from "date-fns";
import { Task } from "@/lib/types/task.type";
import { CELL_HEIGHT } from "../organisms/calendar/constants";
import { cva, VariantProps } from "class-variance-authority";
import { useDrag } from "react-dnd";
import { cn } from "@/lib/utils";
import { EnumDraggableItemType } from "@/lib/enums";
import { MAPPED_COLORS } from "@/lib/constants";

export const taskCardVariants = cva(
  "absolute right-1 md:right-2 overflow-hidden bg-slate-200 border-slate-400 rounded-sm bg-opacity-70 border px-0.5 md:px-2 flex flex-col items-start",
  {
    variants: {
      color: {
        blue: "text-blue-900",
        red: "text-red-900",
        green: "text-green-900",
        yellow: "text-yellow-900",
        orange: "text-orange-900",
        purple: "text-purple-900",
        pink: "text-pink-900",
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
    isOver?: boolean;
    onClick?: () => void;
  };
export default function TaskCard({ offset = 0, isOver = false, onClick, ...props }: TaskCardProps) {
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
  const colorStyle = color ? MAPPED_COLORS[color] : {};
  return (
    <button
      className={cn(
        taskCardVariants({ color }),
        isDragging && "border-dashed bg-opacity-40 opacity-70",
        isOver && "opacity-50"
      )}
      style={{
        top: startDate.getHours() * CELL_HEIGHT + startDate.getMinutes() * (CELL_HEIGHT / 60),
        zIndex: 10,
        height:
          (endDate.getHours() - startDate.getHours()) * CELL_HEIGHT +
          (endDate.getMinutes() - startDate.getMinutes()) * (CELL_HEIGHT / 60),
        left: offset * 4,
        ...colorStyle,
      }}
      onClick={onClick}
      ref={dragRef}
    >
      {isOver && <div className="stripe absolute left-0 top-0 -z-10 size-full opacity-20"></div>}
      <h6 className="text-left text-sm font-semibold leading-none">{name}</h6>
      <p className="text-xs">
        {format(startDate, "hh:mmaaa")} - {format(endDate, "hh:mmaaa")}
      </p>
    </button>
  );
}
