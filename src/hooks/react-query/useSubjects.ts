import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { createSubject, getSubjects } from "@/services/subject";

import { useToast } from "../use-toast";

export const useGetSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: Infinity,
  });
};

export const useCreateSubject = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });

      toast({
        title: "Success",
        description: "Subject created successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create subject",
        variant: "destructive",
      });
    },
  });
};
