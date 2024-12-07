import { FetchingData, UserProfile } from "@/lib/types";

import api from "./kyInstance";

export const getUserProfile = async () => {
  return (await api.get("user/profile").json<FetchingData<UserProfile>>()).data;
};

export const updateUserProfile = async (payload: Partial<UserProfile>) => {
  return (await api.put("user/profile", { json: payload }).json<FetchingData<UserProfile>>()).data;
};

type UpdateUserPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export const updateUserPassword = async (payload: UpdateUserPasswordPayload) => {
  return await api.put("users/profile/password", { json: payload }).json();
};
