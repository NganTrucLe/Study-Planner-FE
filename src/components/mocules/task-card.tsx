import { format } from "date-fns";
import { Task } from "../organisms/calendar/type";
import { CELL_HEIGHT } from "../organisms/calendar/constants";
import { cva, VariantProps } from "class-variance-authority";

export const taskCardVariants = cva(
  "p-y-1 absolute z-10 mr-1 overflow-hidden rounded-sm border px-2 flex flex-col",
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
type TaskCardProps = VariantProps<typeof taskCardVariants> & Task;
export default function TaskCard({ name, startDate, endDate, color }: TaskCardProps) {
  return (
    <button
      className={taskCardVariants({ color })}
      style={{
        top: startDate.getHours() * CELL_HEIGHT + startDate.getMinutes() * (CELL_HEIGHT / 60),
        zIndex: 10,
        height:
          (endDate.getHours() - startDate.getHours()) * CELL_HEIGHT +
          (endDate.getMinutes() - startDate.getMinutes()) * (CELL_HEIGHT / 60),
      }}
    >
      <h6 className="line-clamp-1 text-ellipsis text-left text-sm font-semibold">{name}</h6>
      <p className="text-xs">
        {format(startDate, "hh:mmaaa")} - {format(endDate, "hh:mmaaa")}
      </p>
    </button>
  );
}
