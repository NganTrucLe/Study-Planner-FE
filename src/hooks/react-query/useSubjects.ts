import { createSubject, getSubjects } from "@/services/subject";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "../use-toast";
import { EnumTaskColor } from "@/lib/enums";

export const useGetSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: Infinity,
    placeholderData: [
      { _id: "1", name: "Math", color: EnumTaskColor.RED },
      { _id: "2", name: "Science", color: EnumTaskColor.BLUE },
      { _id: "3", name: "History", color: EnumTaskColor.GREEN },
      { _id: "4", name: "English", color: EnumTaskColor.YELLOW },
    ],
  });
};

export const useCreateSubject = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Subject created successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create subject",
        variant: "destructive",
      });
    },
  });
};
