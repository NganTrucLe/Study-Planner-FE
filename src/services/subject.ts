import { FetchingData } from "@/lib/types";
import { Subject } from "@/lib/types/subject.type";
import api from "./kyInstance";

export const getSubjects = async () => {
  return (await api.get("subjects").json<FetchingData<Subject[]>>()).data;
};

export const createSubject = async (payload: { name: string; color: string }) => {
  return (await api.post("subjects", { json: payload }).json<FetchingData<Subject>>()).data;
};
