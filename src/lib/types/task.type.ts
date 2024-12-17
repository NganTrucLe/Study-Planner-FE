import { EnumTaskPriority, EnumTaskStatus } from "../enums";
import { Subject } from "./subject.type";

export type Task = {
  _id: string;
  name: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  status: EnumTaskStatus;
  subjectId: Subject;
  userId: string;
  priorityLevel: EnumTaskPriority;
};

export type TaskDto = Omit<Task, "subjectId"> & {
  subjectId: string;
};
