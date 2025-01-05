import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HistoryState, useNavigate } from "@tanstack/react-router";

import { EnumActionOTP } from "@/lib/enums";
import {
  getOtp,
  resetPassword,
  signIn,
  signInWithGoogle,
  signOut,
  signUp,
  signUpWithGoogle,
  verifyOtp,
} from "@/services/auth";

import { useToast } from "../use-toast";
import { useAuthStore } from "../useAuthStore";
import { useOTPPayloadStore } from "../useOTPPayloadStore";

export const authKeys = {
  key: ["authUser"] as const,
  detail: () => [...authKeys.key, "detail"] as const,
};

export const useSignIn = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  const { setPayload } = useOTPPayloadStore();
  return useMutation({
    mutationFn: signIn,
    onSuccess: (data, variables) => {
      if (!data) {
        setPayload({ email: variables.email, action: EnumActionOTP.verifyEmail });
        navigate({ to: "/verify-otp" });
      } else {
        setAccessToken(data.accessToken);
        navigate({ to: "/" });
        toast({
          title: "Success",
          description: "You have successfully logged in",
          variant: "default",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSignUp = () => {
  const { setPayload } = useOTPPayloadStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signUp,
    onSuccess: (_, variables) => {
      setPayload({ email: variables.email, action: EnumActionOTP.verifyEmail });
      navigate({
        to: "/verify-otp",
        search: {
          email: variables.email,
          action: EnumActionOTP.verifyEmail,
        },
      });
      toast({
        title: "Success",
        description: "Please verify your email",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSignOut = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearAccessToken } = useAuthStore();
  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      navigate({ to: "/log-in" });
      clearAccessToken();
      queryClient.clear();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSignInWithGoogle = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  return useMutation({
    mutationFn: signInWithGoogle,
    onSuccess: (data) => {
      if (data) {
        setAccessToken(data.accessToken);
        navigate({ to: "/" });
        toast({
          title: "Success",
          description: "You have successfully logged in",
          variant: "default",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useSignUpWithGoogle = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      const res = await signUpWithGoogle();
      if (!res) throw new Error("There was an error, try again later!");
      // TODO: May update on BE side or storing data on local storage (not prefer)
      // const { user } = res;
      // const avatar = user.photoURL;
      // let avatarInfo;
      // if (avatar) {
      //   const response = await fetch(avatar);
      //   const blob = await response.blob();
      //   const file = new File([blob], "avatar.jpg", { type: blob.type });
      //   avatarInfo = await createAvatar.mutateAsync(file);
      // }
      // if (user.displayName && user.email && avatarInfo) {
      //   await updateUserProfile({
      //     username: user.email.split("@")[0],
      //     fullName: user.displayName,
      //     avatarId: avatarInfo.id,
      //   });
      // }
    },
    onSuccess: () => {
      navigate({ to: "/" });
      toast({
        title: "Success",
        description: "You have successfully signed up",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useGetOtp = () => {
  return useMutation({
    mutationFn: getOtp,
  });
};

interface VerifyOtpState extends HistoryState {
  accessToken: string;
}

export const useVerifyOtp = () => {
  const payload = useOTPPayloadStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      if (payload.action == EnumActionOTP.verifyEmail) {
        toast({
          variant: "default",
          title: "Verify email successfully!",
        });
        navigate({ to: "/log-in" });
        payload.clearPayload();
      } else {
        navigate({
          to: "/reset-password",
          state: { accessToken: data.accessToken } as VerifyOtpState,
        });
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error verifying OTP",
      });
    },
  });
};

export const useResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast({
        variant: "default",
        title: "Password reset successfully!",
      });
      navigate({ to: "/log-in" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error resetting password",
      });
    },
  });
};
