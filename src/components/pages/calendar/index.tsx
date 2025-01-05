import TabBar from "@/components/mocules/tab-bar";
import AnalyzeScheduleDialog from "@/components/organisms/analyze-schedule-dialog";
import AppMenu from "@/components/organisms/app-menu";
import CalendarContainer from "@/components/organisms/calendar/calendar-container";
import { CalendarProvider } from "@/components/organisms/calendar/calendar-context";
import CalendarHeader from "@/components/organisms/calendar/calendar-header";
import CreateSessionDialog from "@/components/organisms/learning-session/create-session-dialog";

const CalendarPage = () => {
  return (
    <CalendarProvider>
      <div className="flex h-screen w-full flex-col">
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
        <div className="h-full flex-1 overflow-hidden p-8">
          <CalendarContainer />
        </div>
      </div>
    </CalendarProvider>
  );
};

export default CalendarPage;
