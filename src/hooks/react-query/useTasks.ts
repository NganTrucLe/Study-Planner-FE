import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { CalendarRange } from "@/components/organisms/calendar/type";
import { askGemini } from "@/services/gemini-ai";

const taskKeys = {
  key: ["tasks"] as const,
  list: (params: TaskQueryParams) => [...taskKeys.key, params] as const,
  detail: (id: string) => [...taskKeys.key, id] as const,
  analyze: (range: CalendarRange) => ["analyze-schedule", range] as const,
};
export const useTasks = (params: TaskQueryParams) => {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => getTasks(params),
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTask(id),
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { id: string; data: Partial<Task> }) =>
      updateTask(payload.id, payload.data),
    onSuccess: (returnData: Task) => {
      queryClient.setQueriesData(
        {
          queryKey: taskKeys.key,
        },
        (oldData: any) => {
          return {
            ...oldData,
            tasks: oldData.tasks.map((task: Task) =>
              task._id === returnData._id ? returnData : task
            ),
          };
        }
      );
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

export const useAnalyzeSchedule = (range: CalendarRange) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tasks, forceCall }: { tasks: Task[]; forceCall: boolean }) => {
      if (!tasks) return "You have no tasks this week";
      const cachedData: string = queryClient.getQueryData(taskKeys.analyze(range)) ?? "";
      if (cachedData && !forceCall) return cachedData;
      return askGemini(
        tasks.map((task) => ({
          _id: task._id,
          name: task.name,
          startDate: task.startDate,
          endDate: task.endDate,
          status: task.status,
        }))
      );
    },
    onSuccess: (data: string) => {
      queryClient.setQueryData(taskKeys.analyze(range), data);
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
