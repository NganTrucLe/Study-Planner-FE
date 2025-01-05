import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { EnumTaskColor } from "@/lib/enums";
import { Subject } from "@/lib/types/subject.type";
import { createSubject, getSubjects } from "@/services/subject";

import { useToast } from "../use-toast";

const initialData: Subject[] = [
  {
    _id: "67605d368354a9762c2d546a",
    name: "Web Dev Backend",
    color: EnumTaskColor.BLUE,
  },
  {
    _id: "67605d5d117bf4228fc8ca91",
    name: "Mathematics",
    color: EnumTaskColor.PINK,
  },
  {
    _id: "67605e09117bf4228fc8ca94",
    name: "Physics",
    color: EnumTaskColor.BLUE,
  },
  {
    _id: "67605e62117bf4228fc8ca98",
    name: "Web Dev Frontend",
    color: EnumTaskColor.ORANGE,
  },
  {
    _id: "67605ee0117bf4228fc8ca9c",
    name: "Docker",
    color: EnumTaskColor.YELLOW,
  },
];

export const useGetSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: Infinity,
    initialData: initialData,
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
