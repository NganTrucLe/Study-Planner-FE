import { createSubject, getSubjects } from "@/services/subject";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../use-toast";

export const useGetSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: Infinity,
    initialData: [
      {
        _id: "67605d368354a9762c2d546a",
        name: "Web Dev Backend",
        color: "blue",
      },
      {
        _id: "67605d5d117bf4228fc8ca91",
        name: "Chuyen canh",
        userId: "675ed469d7447d4c6f6e89d9",
        color: "pink",
      },
      {
        _id: "67605e09117bf4228fc8ca94",
        name: "DiDi",
        color: "blue",
      },
      {
        _id: "67605e62117bf4228fc8ca98",
        name: "Kitkat",
        color: "orange",
      },
      {
        _id: "67605ee0117bf4228fc8ca9c",
        name: "Lapin API",
        color: "yellow",
      },
    ],
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
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create subject",
        variant: "destructive",
      });
    },
  });
};
