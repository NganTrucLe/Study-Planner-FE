import { EnumTaskColor, EnumTaskPriority, EnumTaskStatus } from "../enums";

export type Task = {
  _id: string;
  name: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  status: EnumTaskStatus;
  subject: string;
  userId: string;
  priorityLevel: EnumTaskPriority;
  color: EnumTaskColor;
};
