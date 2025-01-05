import { TaskPriorityLevel, TaskStatus } from "@/lib/enums";
import { FetchingData } from "@/lib/types";
import { Task, TaskFormValue, UnscheduledTask } from "@/lib/types/task.type";
import { generateSearchParams } from "@/lib/utils";

import api from "./kyInstance";

export type TaskQueryParams = Partial<{
  name: string;
  status: TaskStatus[];
  priorityLevel: TaskPriorityLevel[];
  subjectId: string[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
  from: string | Date;
  to: string | Date;
  nodate: boolean;
}>;

export type GetTasksResponse = FetchingData<{
  tasks: (Task | UnscheduledTask)[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}>;

export const getTasks = async (params: TaskQueryParams = {}) => {
  const searchParams = generateSearchParams(params);

  return (
    await api
      .get("tasks", {
        searchParams,
      })
      .json<GetTasksResponse>()
  ).data;
};

export const getTask = async (id: string) => {
  return (await api.get(`tasks/${id}`).json<FetchingData<Task | UnscheduledTask>>()).data;
};

export const createTask = async (payload: TaskFormValue) => {
  return (await api.post("tasks", { json: payload }).json<FetchingData<Task | UnscheduledTask>>())
    .data;
};

export const updateTask = async (id: string, payload: Partial<TaskFormValue>) => {
  return (
    await api.put(`tasks/${id}`, { json: payload }).json<FetchingData<Task | UnscheduledTask>>()
  ).data;
};

export const deleteTask = async (id: string) => {
  return (await api.delete(`tasks/${id}`).json<FetchingData<Task | UnscheduledTask>>()).data;
};
