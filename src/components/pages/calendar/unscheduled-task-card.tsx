import { UnscheduledTask } from "@/lib/types/task.type";
import { cva, VariantProps } from "class-variance-authority";
import { useDrag } from "react-dnd";
import { cn } from "@/lib/utils";
import { EnumDraggableItemType, EnumTaskStatus } from "@/lib/enums";
import { MAPPED_COLORS } from "@/lib/constants";

export const taskCardVariants = cva(
  "overflow-hidden w-full py-2 border-slate-400 rounded-sm bg-opacity-70 border px-0.5 md:px-2 flex flex-col items-start",
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
export type TaskCardProps = UnscheduledTask & {
  onClick?: () => void;
};
export default function UnscheduledTaskCard({ onClick, ...props }: TaskCardProps) {
  const { name, status, description, subjectId } = props;

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: EnumDraggableItemType.UNSCHEDULED_TASK,
    item: props,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const color: VariantProps<typeof taskCardVariants>["color"] = subjectId?.color || "blue";

  const colorStyle = color
    ? {
        borderColor: MAPPED_COLORS[color].borderColor,
        backgroundColor: `${MAPPED_COLORS[color].backgroundColor}80`,
      }
    : {};
  return (
    <button
      className={cn(
        taskCardVariants({ color }),
        isDragging && "border-dashed bg-opacity-40 opacity-70"
      )}
      style={{
        ...colorStyle,
      }}
      onClick={onClick}
      ref={dragRef}
      title={`${name} is unscheduled`}
    >
      {status == EnumTaskStatus.OVERDUE && (
        <div className="stripe absolute left-0 top-0 size-full opacity-20"></div>
      )}
      <h6 className="text-left text-base font-semibold">{name}</h6>
      {subjectId && <p className="text-sm italic">- {subjectId.name} -</p>}
      <p className="text-left text-sm">{description}</p>
    </button>
  );
}
