import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSession, fetchSession, SessionQueryParams, updateSession } from "@/services/session";

import { toast } from "../use-toast";

export const sessionKeys = {
  key: ["sessions"] as const,
  list: (params: SessionQueryParams) => [...sessionKeys.key, JSON.stringify(params)] as const,
};

export const useGetSessions = (params: SessionQueryParams) => {
  return useQuery({
    queryKey: sessionKeys.list(params),
    queryFn: () => fetchSession(params),
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSession,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sessionKeys.key,
      });
    },

    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create session",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSession = (onSuccess?: (data: any, variables: any) => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSession,

    onSuccess:
      onSuccess ||
      (() => {
        toast({
          title: "Success",
          description: "Session updated successfully",
        });
        queryClient.invalidateQueries({
          queryKey: sessionKeys.key,
        });
      }),

    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update session",
        variant: "destructive",
      });
    },
  });
};
