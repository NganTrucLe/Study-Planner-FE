import { FetchingData } from "@/lib/types";

import api from "./kyInstance";
import { Task } from "@/lib/types/task.type";

export const getTasks = async () => {
  return (await api.get("tasks").json<FetchingData<Task[]>>()).data;
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

export const getSubjects = async () => {
  return (await api.get("subjects").json<FetchingData<Task[]>>()).data;
};

export const createSubject = async (payload: { name: string; color: string }) => {
  return (await api.post("subjects", { json: payload }).json<FetchingData<Task>>()).data;
};
