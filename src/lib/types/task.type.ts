import { EnumTaskPriority, EnumTaskStatus } from "../enums";
import { Subject } from "./subject.type";

export type Task = {
  _id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: EnumTaskStatus;
  subjectId?: Subject;
  userId: string;
  priorityLevel: EnumTaskPriority;
};

export type UnscheduledTask = Omit<Task, "startDate" | "endDate"> & {
  startDate?: Date | string;
  endDate?: Date | string;
};

export type TaskFormValueWithId = Omit<Task, "userId" | "startDate" | "endDate" | "subjectId"> & {
  startDate?: Date;
  endDate?: Date;
  subjectId?: string;
};

export type TaskFormValue = Omit<Task, "_id" | "userId" | "startDate" | "endDate" | "subjectId"> & {
  startDate?: Date;
  endDate?: Date;
  subjectId?: string;
};
