import { FetchingData } from "@/lib/types";
import { CreateSessionDto, Session, UpdateSessionDto } from "@/lib/types/session.type";
import { toIsoString } from "@/lib/utils";

import api from "./kyInstance";

export const createSession = async (session: CreateSessionDto) => {
  return (await api.post("sessions", { json: session }).json<FetchingData<Session>>()).data;
};

// Duy Quan chua co lam cai nay
export const fetchActiveSession = async () => {
  return (await api.get("sessions?active=true").json<FetchingData<Session>>()).data;
};

// Neu Truc co lam roi thi mot refactor sau
export const fetchSession = async (from?: Date, to?: Date) => {
  const urlSearchParams = new URLSearchParams();

  from && urlSearchParams.append("from", toIsoString(from));
  to && urlSearchParams.append("to", toIsoString(to));

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
