import { ChevronsDown, ChevronsUp, Equal } from "lucide-react";

import { Option } from "@/components/mocules/form-inputs/form-select";
import { EnumTaskColor, EnumTaskPriority, EnumTaskStatus } from "@/lib/enums";

export const taskStatuses = [
  { value: EnumTaskStatus.TODO, label: "To Do", variant: "secondary" as const },
  { value: EnumTaskStatus.IN_PROGRESS, label: "In Progress", variant: "blue" as const },
  { value: EnumTaskStatus.DONE, label: "Done", variant: "green" as const },
  { value: EnumTaskStatus.OVERDUE, label: "Overdue", variant: "red" as const },
];

export const taskPriorities = [
  { value: EnumTaskPriority.LOW, label: "Low", icon: <ChevronsDown color="#41a0ff" size={16} /> },
  { value: EnumTaskPriority.MEDIUM, label: "Medium", icon: <Equal color="#f6ad55" size={16} /> },
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

export const MAPPED_COLORS = {
  [EnumTaskColor.RED]: {
    backgroundColor: "#ff7d8a",
    borderColor: "#cc3d4a",
  },
  [EnumTaskColor.BLUE]: {
    backgroundColor: "#9cd2ff",
    borderColor: "#5a92cc",
  },
  [EnumTaskColor.GREEN]: {
    backgroundColor: "#a8deaa",
    borderColor: "#629a6a",
  },
  [EnumTaskColor.YELLOW]: {
    backgroundColor: "#fff490",
    borderColor: "#cc9c30",
  },
  [EnumTaskColor.PURPLE]: {
    backgroundColor: "#d1adff",
    borderColor: "#9170cc",
  },
  [EnumTaskColor.ORANGE]: {
    backgroundColor: "#fdb58d",
    borderColor: "#cc704d",
  },
  [EnumTaskColor.PINK]: {
    backgroundColor: "#ffd4f0",
    borderColor: "#cc3d4a",
  },
};

export const LEARNING_DURATIONS = [
  { value: (25 * 60).toString(), label: "25 minutes" },
  { value: (30 * 60).toString(), label: "30 minutes" },
  { value: (45 * 60).toString(), label: "45 minutes" },
  { value: (60 * 60).toString(), label: "1 hour" },
  { value: (1 * 60).toString(), label: "1 minute" },
];

export const BREAK_TIMES = [
  { value: (0 * 60).toString(), label: "No break" },
  { value: (15).toString(), label: "15 seconds" },
  { value: (5 * 60).toString(), label: "5 minutes" },
  { value: (10 * 60).toString(), label: "10 minutes" },
  { value: (15 * 60).toString(), label: "15 minutes" },
  { value: (20 * 60).toString(), label: "20 minutes" },
];
