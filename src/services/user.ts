import { FetchingData, UserProfile } from "@/lib/types";

import api from "./kyInstance";

export const getUserProfile = async () => {
  return (await api.get("user/profile").json<FetchingData<UserProfile>>()).data;
};

export const updateUserProfile = async (payload: Partial<UserProfile>) => {
  return (
    await api.put("user/profile", { json: { body: payload } }).json<FetchingData<UserProfile>>()
  ).data;
};
