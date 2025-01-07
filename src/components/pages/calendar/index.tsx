import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import TabBar from "@/components/mocules/tab-bar";
import AnalyzeScheduleDialog from "@/components/organisms/analyze-schedule-dialog";
import AppMenu from "@/components/organisms/app-menu";
import CalendarContainer from "@/components/organisms/calendar/calendar-container";
import { CalendarProvider } from "@/components/organisms/calendar/calendar-context";
import CalendarHeader from "@/components/organisms/calendar/calendar-header";
import CreateTaskDialog from "@/components/organisms/create-task-dialog";
import CreateSessionDialog from "@/components/organisms/learning-session/create-session-dialog";

import UnscheduledTaskList from "./unscheduled-task-list";

const CalendarPage = () => {
  return (
    <CalendarProvider>
      <div className="flex h-screen w-full flex-col bg-neutral-50">
        <div className="h-32 bg-white">
          <div className="mb-2 flex flex-row items-center justify-between px-8 pt-8">
            <div className="flex flex-row items-center gap-8">
              <div className="flex flex-row items-center gap-4">
                <AppMenu />
                <h1 className="flex-wrap text-3xl font-semibold">My Task List</h1>
              </div>
              <CalendarHeader />
            </div>
            <div className="flex flex-row items-center gap-4">
              <CreateSessionDialog />
              <AnalyzeScheduleDialog />
            </div>
          </div>
          <TabBar />
        </div>
        <CreateTaskDialog />
        <div className="grid h-full flex-1 grid-cols-12 gap-4 overflow-hidden p-8">
          <DndProvider backend={HTML5Backend}>
            <CalendarContainer />
            <UnscheduledTaskList />
          </DndProvider>
        </div>
      </div>
    </CalendarProvider>
  );
};

export default CalendarPage;
