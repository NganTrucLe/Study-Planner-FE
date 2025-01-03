import { EnumSessionStatus } from "@/lib/enums";
import { FetchingData } from "@/lib/types";
import { CreateSessionDto, Session, UpdateSessionDto } from "@/lib/types/session.type";
import { generateSearchParams } from "@/lib/utils";

import api from "./kyInstance";

export const createSession = async (session: CreateSessionDto) => {
  return (await api.post("sessions", { json: session }).json<FetchingData<Session>>()).data;
};

export type SessionQueryParams = {
  from?: string;
  to?: string;
  status?: EnumSessionStatus[];
};

export const fetchSession = async (params: SessionQueryParams = {}) => {
  const urlSearchParams = generateSearchParams(params);

  return (await api.get(`sessions?${urlSearchParams.toString()}`).json<FetchingData<Session[]>>())
    .data;
};

export const updateSession = async ({
  _id,
  session,
}: {
  _id: string;
  session: UpdateSessionDto;
}) => {
  return (await api.put(`sessions/${_id}`, { json: session }).json<FetchingData<Session>>()).data;
};
