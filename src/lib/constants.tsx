import { EnumTaskColor, EnumTaskPriority, EnumTaskStatus } from "@/lib/enums";
import { Option } from "@/components/mocules/form-inputs/form-select";
import { ChevronsDown, ChevronsUp, Equal } from "lucide-react";

export const taskStatuses = [
  { value: EnumTaskStatus.TODO, label: "To Do", variant: "secondary" as const },
  { value: EnumTaskStatus.IN_PROGRESS, label: "In Progress", variant: "blue" as const },
  { value: EnumTaskStatus.DONE, label: "Done", variant: "green" as const },
];

export const taskPriorities = [
  { value: EnumTaskPriority.LOW, label: "Low", icon: <ChevronsDown color="#24ae26" size={16} /> },
  { value: EnumTaskPriority.MEDIUM, label: "Medium", icon: <Equal color="#ffe24b" size={16} /> },
  { value: EnumTaskPriority.HIGH, label: "High", icon: <ChevronsUp color="#ea2121" size={16} /> },
];

export const priorityMapping = {
  [EnumTaskPriority.LOW]: 1,
  [EnumTaskPriority.MEDIUM]: 2,
  [EnumTaskPriority.HIGH]: 3,
};

export interface SubjectOption extends Option {
  color: string;
}

export const subjectColors: SubjectOption[] = [
  { value: EnumTaskColor.RED, label: "Red", color: "#ff7d8a" },
  { value: EnumTaskColor.BLUE, label: "Blue", color: "#9cd2ff" },
  { value: EnumTaskColor.GREEN, label: "Green", color: "#a8deaa" },
  { value: EnumTaskColor.YELLOW, label: "Yellow", color: "#fff490" },
  { value: EnumTaskColor.PURPLE, label: "Purple", color: "#d1adff" },
  { value: EnumTaskColor.ORANGE, label: "Orange", color: "#fdb58d" },
  { value: EnumTaskColor.PINK, label: "Pink", color: "#ffd4f0" },
];
