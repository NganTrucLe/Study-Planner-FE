import TasksByDay from "@/components/organisms/charts/tasks-by-day";
import TasksBySubject from "@/components/organisms/charts/tasks-by-subject";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Typography,
  Badge,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui";
import { taskStatuses } from "@/lib/constants";
import _ from "lodash";
import { WeekPicker } from "@/components/ui/week-picker";
import { MonthPicker } from "@/components/ui/month-picker";
import useAnalyticsPage from "./use-analytics-page";

export default function AnalyticsPage() {
  const {
    chartType,
    range,
    setRange,
    handleChangeChartType,
    tasksByDay,
    tasksBySubject,
    tasksByStatus,
  } = useAnalyticsPage();

  return (
    <div className="w-full">
      <div className="mb-4 flex w-full flex-row justify-between border-b border-neutral-200 px-8 py-4">
        <Typography variant="h2">Dashboard</Typography>
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
      </div>
    </div>
  );
}
