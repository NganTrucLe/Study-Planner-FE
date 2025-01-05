import _ from "lodash";

import AppMenu from "@/components/organisms/app-menu";
import FocusTimeTrend from "@/components/organisms/charts/focus-timer";
import TasksByDay from "@/components/organisms/charts/tasks-by-day";
import TasksBySubject from "@/components/organisms/charts/tasks-by-subject";
import GeminiFeedbackDialog from "@/components/organisms/gemini-feedback-dialog";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Typography,
} from "@/components/ui";
import { MonthPicker } from "@/components/ui/month-picker";
import { WeekPicker } from "@/components/ui/week-picker";
import { taskStatuses } from "@/lib/constants";

import useAnalyticsPage from "./use-analytics-page";

const getFormatHM = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return {
    hours,
    minutes,
  };
};
export default function AnalyticsPage() {
  const {
    chartType,
    range,
    setRange,
    handleChangeChartType,
    tasksByDay,
    tasksBySubject,
    tasksByStatus,
    totalFocusTimeToday,
    totalFocusTimeInRange,
    maxFocusTime,
    focusTimeByHour,
  } = useAnalyticsPage();

  const formattedFTToday = getFormatHM(totalFocusTimeToday);
  const formattedFTInRange = getFormatHM(totalFocusTimeInRange);
  const formattedMaxFT = getFormatHM(maxFocusTime);

  return (
    <div className="relative w-full bg-neutral-50 pb-8">
      <div className="sticky top-0 z-10 mb-4 flex w-full flex-row justify-between border-b border-neutral-200 bg-white px-8 py-4">
        <div className="flex flex-row items-center gap-4">
          <AppMenu />
          <Typography variant="h2">Dashboard</Typography>
        </div>
        <div className="flex flex-row items-center gap-4">
          <GeminiFeedbackDialog />
          <div className="flex">
            <Select value={chartType} onValueChange={handleChangeChartType}>
              <SelectTrigger className="w-24 rounded-l-full rounded-r-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            {chartType == "weekly" ? (
              <WeekPicker value={range} onChange={setRange} className="w-60 rounded-l-none px-2" />
            ) : (
              <MonthPicker value={range} onChange={setRange} className="w-60 rounded-l-none" />
            )}
          </div>
        </div>
      </div>
      <div className="grid w-full grid-cols-12 gap-4 px-8 pt-4">
        {taskStatuses.map((status, index) => (
          <Card key={index} className="col-span-3">
            <CardHeader>
              <CardTitle>
                <Badge variant={status.variant}>{status.label}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography variant="h2">
                {tasksByStatus[status.value]?.length ?? 0}&nbsp;
                <span className="text-base font-normal">tasks</span>
              </Typography>
            </CardContent>
          </Card>
        ))}
        <TasksByDay className="col-span-8" chartData={tasksByDay} chartType={chartType} />
        <TasksBySubject className="col-span-4" chartData={tasksBySubject} />

        {/* <TotalSessionsTable /> */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Today's focus time</CardTitle>
          </CardHeader>

          <CardContent>
            <Typography variant="h2">
              {formattedFTToday.hours.toFixed(0) !== "0" && (
                <>
                  {formattedFTToday.hours.toFixed(0)}&nbsp;
                  <span className="text-base font-normal">
                    hour{Math.floor(formattedFTToday.hours) > 1 && "s"}
                  </span>
                  &nbsp;
                </>
              )}
              {formattedFTToday.minutes.toFixed(0) !== "0" && (
                <>
                  {formattedFTToday.minutes.toFixed(0)}&nbsp;
                  <span className="text-base font-normal">
                    minute{Math.floor(formattedFTToday.minutes) > 1 && "s"}
                  </span>
                </>
              )}
              {totalFocusTimeToday === 0 && (
                <span className="text-base font-normal">No focus time</span>
              )}
            </Typography>
          </CardContent>
        </Card>
        <FocusTimeTrend className="col-span-8 row-span-3" chartData={focusTimeByHour} />
        <Card className="col-span-4 col-start-1">
          <CardHeader>
            <CardTitle>Your record in time</CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant="h2">
              {formattedMaxFT.hours.toFixed(0) !== "0" && (
                <>
                  {formattedMaxFT.hours.toFixed(0)}&nbsp;
                  <span className="text-base font-normal">
                    hour{Math.floor(formattedMaxFT.hours) > 1 && "s"}
                  </span>
                  &nbsp;
                </>
              )}
              {formattedMaxFT.minutes.toFixed(0) !== "0" && (
                <>
                  {formattedMaxFT.minutes.toFixed(0)}&nbsp;
                  <span className="text-base font-normal">
                    minute{Math.floor(formattedMaxFT.minutes) > 1 && "s"}
                  </span>
                </>
              )}
              {formattedMaxFT.minutes === 0 && (
                <span className="text-base font-normal">No focus time</span>
              )}
            </Typography>
          </CardContent>
        </Card>
        <Card className="col-span-4 col-start-1">
          <CardHeader>
            <CardTitle>Total focus time</CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant="h2">
              {formattedFTInRange.hours.toFixed(0) !== "0" && (
                <>
                  {formattedFTInRange.hours.toFixed(0)}&nbsp;
                  <span className="text-base font-normal">
                    hour{Math.floor(formattedFTInRange.hours) > 1 && "s"}
                  </span>
                </>
              )}
              {formattedFTInRange.minutes.toFixed(0) !== "0" && (
                <>
                  {formattedFTInRange.minutes.toFixed(0)}&nbsp;
                  <span className="text-base font-normal">
                    minute{Math.floor(formattedFTInRange.minutes) > 1 && "s"}
                  </span>
                </>
              )}
              {formattedFTInRange.minutes === 0 && (
                <span className="text-base font-normal">No focus time</span>
              )}
            </Typography>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
