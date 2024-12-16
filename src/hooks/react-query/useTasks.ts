import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getSubjects,
  createSubject,
  TaskQueryParams,
} from "@/services/task";
import { useToast } from "../use-toast";
import { Task } from "@/lib/types/task.type";

export const useTasks = (params: TaskQueryParams) => {
  return useQuery({
    queryKey: ["tasks", params],
    queryFn: () => getTasks(params),
    staleTime: Infinity,
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => getTask(id),
    staleTime: Infinity,
  });
};

export const useCreateTask = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task created successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTask = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: (payload: { id: string; data: Partial<Task> }) =>
      updateTask(payload.id, payload.data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task updated successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTask = () => {
  const { toast } = useToast();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task deleted successfully",
        variant: "default",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      });
    },
  });
};

export const useGetSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
    staleTime: Infinity,
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
