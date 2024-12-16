import { EnumTaskColor, EnumTaskPriority, EnumTaskStatus } from "../enums";

export type Task = {
  id: string;
  name: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  status: EnumTaskStatus;
  subject: string;
  userId: string;
  priority: EnumTaskPriority;
  color: EnumTaskColor;
};
