import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSession, fetchSession, updateSession } from "@/services/session";

import { toast } from "../use-toast";

export const sessionKeys = {
  key: ["sessions"] as const,
  list: (from?: Date, to?: Date) =>
    [...sessionKeys.key, ...(from ? [from] : []), ...(to ? [to] : [])] as const,
};

// Neu Truc co lam roi thi mot refactor sau
export const useGetSessions = (from?: Date, to?: Date) => {
  return useQuery({
    queryKey: sessionKeys.list(from, to),
    queryFn: () => fetchSession(from, to),
    staleTime: Infinity,
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
