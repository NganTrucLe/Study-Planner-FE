import { EnumTaskColor, EnumTaskPriority, EnumTaskStatus } from "@/lib/enums";
import { ChevronsDown, ChevronsUp, Equal } from "lucide-react";

export const taskStatuses = [
  { value: EnumTaskStatus.TODO, label: "To Do", color: "bg-gray-400" },
  { value: EnumTaskStatus.IN_PROGRESS, label: "In Progress", color: "bg-blue-400" },
  { value: EnumTaskStatus.DONE, label: "Done", color: "bg-emerald-500" },
];

export const taskPriorities = [
  { value: EnumTaskPriority.LOW, label: "Low", icon: <ChevronsDown color="#24ae26" size={20} /> },
  { value: EnumTaskPriority.MEDIUM, label: "Medium", icon: <Equal color="#ffe24b" size={20} /> },
  { value: EnumTaskPriority.HIGH, label: "High", icon: <ChevronsUp color="#ea2121" size={20} /> },
];

export const priorityMapping = {
  [EnumTaskPriority.LOW]: 1,
  [EnumTaskPriority.MEDIUM]: 2,
  [EnumTaskPriority.HIGH]: 3,
};

export const subjectColors = [
  { value: EnumTaskColor.RED, label: "Red", color: "#FFCDD2" },
  { value: EnumTaskColor.BLUE, label: "Blue", color: "#BBDEFB" },
  { value: EnumTaskColor.GREEN, label: "Green", color: "#C8E6C9" },
  { value: EnumTaskColor.YELLOW, label: "Yellow", color: "#FFF9C4" },
  { value: EnumTaskColor.PURPLE, label: "Purple", color: "#E1BEE7" },
  { value: EnumTaskColor.ORANGE, label: "Orange", color: "#FFE0B2" },
  { value: EnumTaskColor.PINK, label: "Pink", color: "#F8BBD0" },
];
