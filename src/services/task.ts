import { FetchingData } from "@/lib/types";

import api from "./kyInstance";
import { Task } from "@/lib/types/task.type";
import { TaskPriorityLevel, TaskStatus } from "@/lib/enums";

export interface TaskQueryParams {
  name?: string;
  status?: TaskStatus[];
  priorityLevel?: TaskPriorityLevel[];
  subjectId?: string[];
  weekly?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

const buildTaskSearchParams = (params: TaskQueryParams = {}): URLSearchParams => {
  const searchParams = new URLSearchParams();

  if (params.name) {
    searchParams.append("name", params.name);
  }

  if (params.status) {
    searchParams.append("status", params.status.join(","));
  }
  if (params.priorityLevel) {
    searchParams.append("priorityLevel", params.priorityLevel.join(","));
  }

  if (params.subjectId) {
    searchParams.append("subjectId", params.subjectId.join(","));
  }

  if (params.weekly) {
    searchParams.append("weekly", params.weekly);
  }

  if (params.sortBy) {
    searchParams.append("sortBy", params.sortBy);
  }

  if (params.sortOrder) {
    searchParams.append("sortOrder", params.sortOrder);
  }

  if (params.page) {
    searchParams.append("page", String(params.page));
  }

  if (params.limit) {
    searchParams.append("limit", String(params.limit));
  }

  return searchParams;
};

export type GetTasksResponse = FetchingData<{
  tasks: Task[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}>;

export const getTasks = async (params: TaskQueryParams = {}) => {
  const searchParams = buildTaskSearchParams(params);
  const url = `tasks?${searchParams.toString()}`;

  return (await api.get(url).json<GetTasksResponse>()).data;
};

export const getTask = async (id: string) => {
  return (await api.get(`tasks/${id}`).json<FetchingData<Task>>()).data;
};

export const createTask = async (payload: Partial<Task>) => {
  return (await api.post("tasks", { json: payload }).json<FetchingData<Task>>()).data;
};

export const updateTask = async (id: string, payload: Partial<Task>) => {
  return (await api.put(`tasks/${id}`, { json: payload }).json<FetchingData<Task>>()).data;
};

export const deleteTask = async (id: string) => {
  return (await api.delete(`task/${id}`).json<FetchingData<Task>>()).data;
};
