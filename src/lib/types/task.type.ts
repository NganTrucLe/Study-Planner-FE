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

export type TaskFormValueWithId = Omit<Task, "userId" | "startDate" | "endDate" | "subjectId"> & {
  startDate: Date;
  endDate: Date;
  subjectId?: string;
};

export type TaskFormValue = Omit<Task, "_id" | "userId" | "startDate" | "endDate" | "subjectId"> & {
  startDate: Date;
  endDate: Date;
  subjectId?: string;
};
