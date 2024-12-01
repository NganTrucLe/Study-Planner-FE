import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as signOutFirebase,
} from "firebase/auth";

import { auth } from "@/firebaseConfig";
import { EnumActionOTP } from "@/lib/enums";
import { FetchingData } from "@/lib/types";
import { AccountIdentifier } from "@/lib/types/user.type";
import { generateSearchParams } from "@/lib/utils";
import api, { apiAuth, apiCustomToken } from "@/services/kyInstance";

export const localStorageTokenKey = "auth_client_token";

export type AuthInfo = {
  accessToken: string;
  refreshToken: string;
};

type SignInPayload = {
  email: string;
  password: string;
};

export const getAuthValueFromStorage = () => {
  return localStorage.getItem(localStorageTokenKey)
    ? (JSON.parse(localStorage.getItem(localStorageTokenKey) ?? "") as AuthInfo)
    : null;
};

export const signIn = async (payload: SignInPayload) => {
  const data = (await apiAuth.post("auth/signin", { json: payload }).json<FetchingData<AuthInfo>>())
    .data;
  localStorage.setItem(localStorageTokenKey, JSON.stringify(data));
  return data;
};

type SignUpPayload = {
  email: string;
  password: string;
};

export const signUp = async (payload: SignUpPayload) => {
  const data = (await apiAuth.post("auth/signup", { json: payload }).json<FetchingData<AuthInfo>>())
    .data;
  localStorage.setItem(localStorageTokenKey, JSON.stringify(data));
  return data;
};

export const signOut = async () => {
  const auth = getAuth();
  await signOutFirebase(auth);
  localStorage.clear();
  return;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
  action: EnumActionOTP;
};

export const verifyOtp = async (payload: VerifyOtpPayload) => {
  const data = (await api.post("auth/otp", { json: payload }).json<FetchingData<AuthInfo>>()).data;
  if (payload.action == EnumActionOTP.verifyEmail) {
    await apiCustomToken(data.accessToken).post("auth/profile");
  }
  return data;
};

type ForgotPasswordPayload = Pick<VerifyOtpPayload, "email" | "action">;
export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const searchParams = generateSearchParams(payload);
  return (await api.get("auth/otp", { searchParams }).json<FetchingData<AuthInfo>>()).data;
};

type ResetPasswordPayload = {
  newPassword: string;
};
export const resetPassword = async (payload: ResetPasswordPayload) => {
  return (await api.post("auth/password-update", { json: payload }).json<FetchingData<AuthInfo>>())
    .data;
};

export const refreshToken = async () => {
  const authInfo = getAuthValueFromStorage();
  if (authInfo?.refreshToken) {
    const data = (
      await apiAuth
        .post("auth/refresh", {
          json: { refreshToken: authInfo.refreshToken },
        })
        .json<FetchingData<AuthInfo>>()
    ).data;
    localStorage.setItem(localStorageTokenKey, JSON.stringify(data));
    return data;
  }
  throw new Error("No refresh token founded.");
};

export const getAccountIdentifier = async () => {
  return (await api.get("users/account").json<FetchingData<AccountIdentifier>>()).data;
};

export type OTPPayload = {
  email: string;
  action: EnumActionOTP;
};

export const getOtp = async (payload: OTPPayload) => {
  const searchParams = generateSearchParams(payload);
  await api.get("auth/otp", { searchParams }).json();
};

// FIREBASE
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(userCredential);
  if (!credential) return;

  const data = (
    await apiAuth
      .post("auth/provider", {
        json: {
          credential: credential.idToken,
          provider: provider.providerId,
        },
      })
      .json<FetchingData<AuthInfo>>()
  ).data;

  localStorage.setItem(localStorageTokenKey, JSON.stringify(data));
  return data;
};

export const signUpWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);

  const credential = GoogleAuthProvider.credentialFromResult(userCredential);
  if (!credential) return;

  const data = (
    await apiAuth
      .post("auth/provider", {
        json: {
          credential: credential.idToken,
          provider: provider.providerId,
        },
      })
      .json<FetchingData<AuthInfo>>()
  ).data;

  localStorage.setItem(localStorageTokenKey, JSON.stringify(data));
  return { user: userCredential.user, data };
};
