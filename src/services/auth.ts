import api, { apiAuth } from "@/services/kyInstance";

const delay = 500;
const localStorageTokenKey = "auth_client_token";

export type AuthInfo = {
  accessToken: string;
};

type SignInParams = {
  email: string;
  password: string;
};

type SignUpParams = {
  username: string;
  email: string;
  password: string;
};

export type AuthUser = {
  username: string;
  email: string;
};

export const getAuthValueFromStorage = () => {
  return localStorage.getItem(localStorageTokenKey)
    ? (JSON.parse(localStorage.getItem(localStorageTokenKey) ?? "") as AuthInfo)
    : null;
};

export const signIn = async (params: SignInParams) => {
  const data = {
    accessToken: "test",
  };
  // const data = await apiAuth.post("login", { json: params }).json<AuthInfo>();
  localStorage.setItem(localStorageTokenKey, JSON.stringify(data));
  return data;
};

export const signUp = async (params: SignUpParams) => {
  return {
    accessToken: "test",
  };
  const data = await apiAuth.post("register", { json: params }).json<AuthInfo>();
  localStorage.setItem(localStorageTokenKey, JSON.stringify(data));
  return data;
};

export const signOut = () => {
  return new Promise((resolve) =>
    setTimeout(() => {
      localStorage.clear();
      resolve(void 0);
    }, delay)
  );
};

export const getUser = async () => {
  return {
    username: "test",
    email: "test@example.com",
  };
  return api.get("profile").json<AuthUser>();
};
