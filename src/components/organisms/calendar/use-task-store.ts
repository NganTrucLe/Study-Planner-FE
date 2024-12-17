import { create } from "zustand";
import { Task } from "@/lib/types/task.type";
import { modifyTaskOffsets, parseTaskArrayToCalendar } from "./utils";
import { startOfDay } from "date-fns";

type State = {
  tasks: Record<string, (Task & { offset: number })[]>;
};

type Action = {
  scheduleTask: (oldTask: Task, newTask: Task) => void;
  clearTasks: () => void;
  setTasks: (tasks: Task[]) => void;
};

const useTaskStore = create<State & Action>((set) => ({
  tasks: {},
  scheduleTask: (oldTask, newTask) => {
    set((state) => {
      const start = startOfDay(newTask.startDate);
      const index = start.toISOString();
      const oldIndex = startOfDay(oldTask.startDate).toISOString();
      if (index === oldIndex) {
        state.tasks[index] = state.tasks[index].map((task) => {
          if (task._id === oldTask._id) {
            return {
              ...newTask,
              offset: task.offset,
            };
          }
          return task;
        });
        state.tasks[index] = modifyTaskOffsets(state.tasks[index]);
        return { tasks: state.tasks };
      }

      if (!state.tasks[index]) {
        state.tasks[index] = [];
      }

      state.tasks[index].push({
        ...newTask,
        offset: 0,
      });
      state.tasks[index] = modifyTaskOffsets(state.tasks[index]);

      state.tasks[oldIndex] = state.tasks[oldIndex].filter((task) => task._id !== oldTask._id);
      state.tasks[oldIndex] = modifyTaskOffsets(state.tasks[oldIndex]);

      return { tasks: state.tasks };
    });
  },
  clearTasks: () => set({ tasks: {} }),
  setTasks: (tasks) => {
    set({ tasks: parseTaskArrayToCalendar(tasks) });
  },
}));

export default useTaskStore;
