import { FetchingData } from "@/lib/types";

import api from "./kyInstance";
import { Task, TaskDto } from "@/lib/types/task.type";
import { TaskPriorityLevel, TaskStatus } from "@/lib/enums";
import { generateSearchParams } from "@/lib/utils";

export type TaskQueryParams = {
  name?: string;
  status?: TaskStatus[];
  priorityLevel?: TaskPriorityLevel[];
  subjectId?: string[];
  weekly?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type GetTasksResponse = FetchingData<{
  tasks: Task[];
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
  return (await api.get(`tasks/${id}`).json<FetchingData<Task>>()).data;
};

export const createTask = async (payload: Partial<TaskDto>) => {
  return (await api.post("tasks", { json: payload }).json<FetchingData<TaskDto>>()).data;
};

export const updateTask = async (id: string, payload: Partial<TaskDto>) => {
  return (await api.put(`tasks/${id}`, { json: payload }).json<FetchingData<Task>>()).data;
};

export const deleteTask = async (id: string) => {
  return (await api.delete(`task/${id}`).json<FetchingData<Task>>()).data;
};
