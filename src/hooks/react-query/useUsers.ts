import { useMutation, useQuery } from "@tanstack/react-query";

import { getUserProfile, updateUserPassword, updateUserProfile } from "@/services/user";
import { useToast } from "../use-toast";
import { Image } from "@/lib/types";

export const userKeys = {
  key: ["account"] as const,
  identifier: () => [...userKeys.key, "identifier"] as const,
  profile: () => [...userKeys.key, "profile"] as const,
};

export const useAccountIdentifier = () => {
  return useQuery({
    queryKey: userKeys.identifier(),
    queryFn: getUserProfile,
    staleTime: Infinity,
    retry: false,
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: getUserProfile,
    staleTime: Infinity,
  });
};

export const useUpdateUserProfile = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (_) => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
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

export const useUserAvatar = () => {
  const { data, isLoading } = useUserProfile();
  return {
    avatar: data?.avatar ? (data.avatar as Image) : null,
    isLoading,
  };
};

export const useUpdateUserPassword = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: updateUserPassword,
    onSuccess: (_) => {
      toast({
        title: "Success",
        description: "Profile updated successfully",
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
