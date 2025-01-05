import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CalendarRange } from "@/components/organisms/calendar/type";
import { Session } from "@/lib/types/session.type";
import { Subject } from "@/lib/types/subject.type";
import { Task, TaskFormValue } from "@/lib/types/task.type";
import { askGemini, askGeminiForFeedback } from "@/services/gemini-ai";
import {
  createTask,
  deleteTask,
  getTask,
  getTasks,
  TaskQueryParams,
  updateTask,
} from "@/services/task";

import { useToast } from "../use-toast";

const taskKeys = {
  key: ["tasks"] as const,
  list: (params: TaskQueryParams) => [...taskKeys.key, params] as const,
  detail: (id: string) => [...taskKeys.key, id] as const,
  analyze: (range: CalendarRange) => ["analyze-schedule", range] as const,
  feedback: () => ["feedback"] as const,
  unscheduled: () => ["unscheduled-tasks"] as const,
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task created successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({
        queryKey: taskKeys.key,
      });
      queryClient.invalidateQueries({
        queryKey: taskKeys.unscheduled(),
      });
    },
    onError: (error) => {
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
    mutationFn: (payload: { id: string; data: Partial<TaskFormValue> }) => {
      return updateTask(payload.id, payload.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.key });
      queryClient.invalidateQueries({ queryKey: taskKeys.unscheduled() });
      toast({
        title: "Success",
        description: "Task updated successfully",
        variant: "default",
      });
    },
    onError: (error) => {
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task deleted successfully",
        variant: "default",
      });

      queryClient.invalidateQueries({ queryKey: taskKeys.key });
    },
    onError: (error) => {
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

export const useGenerateFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tasks,
      subjects,
      sessions,
      forceCall,
    }: {
      tasks: Task[];
      subjects: Subject[];
      sessions: Session[];
      forceCall: boolean;
    }) => {
      if (!tasks) return "You have no tasks";
      const cachedData: string = queryClient.getQueryData(taskKeys.feedback()) ?? "";
      if (cachedData && !forceCall) return cachedData;
      return askGeminiForFeedback({
        tasks,
        subjects,
        sessions,
      });
    },
    onSuccess: (data: string) => {
      queryClient.setQueryData(taskKeys.feedback(), data);
    },
  });
};

export const useGetUnscheduledTasks = () => {
  return useQuery({
    queryKey: taskKeys.unscheduled(),
    queryFn: () => getTasks({ nodate: true, limit: 100 }),
  });
};
