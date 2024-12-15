import CalendarContainer from "@/components/organisms/calendar/calendar-container";
import { CalendarProvider } from "@/components/organisms/calendar/calendar-context";
import CalendarHeader from "@/components/organisms/calendar/calendar-header";
import { Button } from "@/components/ui";
import { Sparkles } from "lucide-react";

const CalendarPage = () => {
  return (
    <main className="flex h-screen w-full flex-col">
      {/* <div className="h-20 border-b bg-white p-6">
        <h2 className="text-2xl font-semibold">My Calendar</h2>
      </div> */}
      <div className="flex h-full flex-1 flex-col px-8 py-4">
        <CalendarProvider>
          <div className="flex flex-row items-center justify-between">
            <CalendarHeader />
            <div className="flex flex-row gap-4">
              <Button variant="yellow">
                <Sparkles size={20} className="mr-2" />
                Analyze
              </Button>
              {/* <Button className="mb-5">
                <Plus size={20} className="mr-2" />
                Schedule a task
              </Button> */}
            </div>
          </div>
          <CalendarContainer />
        </CalendarProvider>
      </div>
    </main>
  );
};

export default CalendarPage;
