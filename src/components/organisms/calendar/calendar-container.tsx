import { addHours, eachDayOfInterval, format, isBefore, isSameDay, isSameWeek } from "date-fns";
import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import TaskCard from "@/components/mocules/task-card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTasks, useUpdateTask } from "@/hooks/react-query/useTasks";
import { EnumTaskStatus } from "@/lib/enums";
import { Task, TaskFormValue, TaskFormValueWithId } from "@/lib/types/task.type";
import { cn } from "@/lib/utils";

import CreateSessionDialog from "../learning-session/create-session-dialog";
import { useSession } from "../learning-session/useSessionContext";
import TaskForm from "../task-management/task-form";
import { useCalendar } from "./calendar-context";
import { CELL_HEIGHT, TIMES } from "./constants";
import DraggableCalendarCell from "./draggable-calendar-cell";
import TimestampTrackLine from "./timestamp-trackline";
import useTaskStore from "./use-task-store";
import { removeTaskId } from "./utils";

const CalendarContainer = () => {
  const { range, type } = useCalendar();
  const { data } = useTasks({
    from: range.start.toString(),
  });
  const showTimeDivider = isSameWeek(range.start, new Date());
  const daysOfWeek = eachDayOfInterval(range);
  const today = new Date();
  const timeDividerRef = useRef<HTMLDivElement>(null);
  const { clearTasks, setTasks, tasks } = useTaskStore();

  const [openUpdateDialog, setUpdateDialog] = useState(false);
  const { session } = useSession();
  const isDuringSession = !!session;

  useEffect(() => {
    if (isDuringSession) setUpdateDialog(false);
  }, [isDuringSession, setUpdateDialog]);

  const selectedTask = useRef<TaskFormValueWithId | null>(null);

  const { mutate: updateTask } = useUpdateTask();

  useEffect(() => {
    if (showTimeDivider && timeDividerRef.current) {
      timeDividerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showTimeDivider]);

  useEffect(() => {
    if (data) setTasks(data.tasks);
    return () => {
      clearTasks();
    };
  }, [clearTasks, data, setTasks]);

  const handleTaskClicked = (task: Task) => {
    selectedTask.current = {
      ...task,
      subjectId: task.subjectId?._id,
      startDate: new Date(task.startDate),
      endDate: new Date(task.endDate),
    };
    setUpdateDialog(true);
  };

  const handleUpdateTask = useCallback(
    (data: TaskFormValue) => {
      if (!selectedTask.current) return;
      const omitted = _.omit(data, ["_id", "userId", "createdAt", "updatedAt"]) as TaskFormValue;
      updateTask({
        id: selectedTask.current._id as string,
        data: omitted,
      });
      selectedTask.current = null;
      setUpdateDialog(false);
    },
    [updateTask, setUpdateDialog]
  );

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl border">
      {type == "monthly" ? (
        <p>Not supported yet</p>
      ) : (
        <>
          <div className="grid grid-cols-[80px_repeat(7,_minmax(0,_1fr))]">
            <div className="border-b border-r bg-gray-100"></div>
            <div className="col-span-7 grid w-full grid-cols-subgrid border-b">
              {daysOfWeek.map((day, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-2 border-r bg-gray-100 p-4 text-center text-sm text-gray-600 last:border-none",
                    isSameDay(day, today) &&
                      "box-content border-b-2 border-b-primary bg-primary/10 font-semibold text-primary"
                  )}
                >
                  <p className="text-wrap">{format(day, "EEEE dd")}</p>
                </div>
              ))}
            </div>
          </div>

          <Dialog open={openUpdateDialog} onOpenChange={setUpdateDialog}>
            <DialogContent>
              <DialogTitle>Task Details</DialogTitle>
              <DialogDescription>
                {selectedTask.current && (
                  <TaskForm
                    onTaskMutate={handleUpdateTask}
                    initialData={removeTaskId(selectedTask.current)}
                  />
                )}
              </DialogDescription>
              {/* <div className="w-full"> */}
              <CreateSessionDialog
                selectedTaskId={selectedTask.current?._id}
                disabled={
                  selectedTask.current?.status === EnumTaskStatus.DONE ||
                  selectedTask.current?.status === EnumTaskStatus.OVERDUE
                }
                variant="outline"
              />
              <p className="-mt-2 text-sm text-neutral-500">
                {selectedTask.current?.status === EnumTaskStatus.OVERDUE
                  ? "Task is overdue, cannot create focus session"
                  : selectedTask.current?.status === EnumTaskStatus.TODO &&
                    "This will convert the task to In Progress"}
              </p>
              {/* </div> */}
            </DialogContent>
          </Dialog>

          <ScrollArea className="h-full flex-1">
            <div className="relative grid w-full grid-cols-[80px_repeat(7,_minmax(0,_1fr))]">
              {/* HEADER TIME TICKS */}
              <div className="border-r">
                {TIMES.map(({ label }, index) => (
                  <div
                    key={index}
                    className="relative border-b p-4 text-center text-sm text-gray-600 [&_p]:first:hidden"
                    style={{
                      height: CELL_HEIGHT,
                    }}
                  >
                    <p className="absolute right-1/2 top-0 -translate-y-1/2 translate-x-1/2 bg-white px-2 text-center">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              {daysOfWeek.map((day, index) => {
                return (
                  <div className="relative flex-1 border-r last:border-none" key={index}>
                    {/* BACKGROUND GRID */}
                    <DndProvider backend={HTML5Backend}>
                      {TIMES.map(({ label, time }) => (
                        <DraggableCalendarCell key={label} startDate={addHours(day, time)} />
                      ))}
                      {tasks[day.toISOString()]?.map((task, taskIndex) => (
                        <TaskCard
                          key={taskIndex}
                          {...task}
                          color={task.subjectId?.color ?? null}
                          onClick={() => handleTaskClicked(task)}
                        />
                      ))}
                    </DndProvider>
                  </div>
                );
              })}
              {showTimeDivider && <TimestampTrackLine ref={timeDividerRef} />}
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
};
export default CalendarContainer;
