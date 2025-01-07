import { format, getDate } from "date-fns";
import { Bar, CartesianGrid, ComposedChart, Label, Line, XAxis, YAxis } from "recharts";

import { Card, CardHeader, CardTitle } from "@/components/ui";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const chartConfig = {
  tasks: {
    label: "Tasks",
    color: "#84c5aa",
  },
  focusTime: {
    label: "Focus time",
    color: "#f6ad55",
  },
} satisfies ChartConfig;

export type ChartType = "weekly" | "monthly";

type TasksByDayProps = {
  className?: string;
  chartData?: {
    dayOfWeek: string | Date;
    tasks: number;
    focusTime: number;
  }[];
  chartType?: ChartType;
};

export default function TasksByDay({
  className,
  chartType = "weekly",
  chartData = [],
}: TasksByDayProps) {
  const fromDay = chartData[0]?.dayOfWeek;
  const toDay = chartData[chartData.length - 1]?.dayOfWeek;
  return (
    <Card className={cn("flex flex-col rounded-md border px-4 pb-4", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>
          Tasks and focus time by day{" "}
          {fromDay && toDay
            ? `from ${format(fromDay, "d/M/yyyy")} to ${format(toDay, "d/M/yyyy")}`
            : `in ${chartType == "weekly" ? "week" : "month"}`}
        </CardTitle>
      </CardHeader>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <ComposedChart
          accessibilityLayer
          data={chartData.map((data) => ({
            ...data,
            focusTime: data.focusTime.toFixed(1),
          }))}
          margin={{ bottom: 20, left: 20, right: 20 }}
          className="overflow-visible"
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="dayOfWeek"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              if (chartType === "monthly") return getDate(value).toString();
              return format(value, "EEE");
            }}
          >
            <Label
              value={`Days of ${chartType == "weekly" ? "week" : "month"}`}
              offset={-10}
              position="insideBottom"
            />
          </XAxis>
          <YAxis tickLine={false} axisLine={false} tickCount={5} yAxisId="left" dataKey="tasks">
            <Label
              value="Tasks"
              offset={5}
              position="insideLeft"
              orientation="vertical"
              angle={-90}
              className="text-sm font-semibold"
            />
          </YAxis>
          <YAxis
            tickLine={false}
            axisLine={false}
            orientation="right"
            yAxisId="right"
            dataKey="focusTime"
            type="number"
            domain={[0, (dataMax: number) => Math.max(dataMax, 6)]}
            unit={"h"}
            tickFormatter={(value) => value.toFixed(0)}
          >
            <Label
              value="Focus time (hour)"
              offset={5}
              position="insideRight"
              orientation="vertical"
              angle={90}
              className="text-sm font-semibold"
            />
          </YAxis>
          <ChartLegend content={<ChartLegendContent />} verticalAlign="top" className="my-4" />
          <ChartTooltip cursor={false} content={<ChartTooltipContent className="mr-8" />} />
          <Bar
            dataKey="tasks"
            fill="var(--color-tasks)"
            radius={4}
            yAxisId="left"
            barSize={chartType == "weekly" ? 40 : undefined}
          />
          <Line
            dataKey="focusTime"
            stroke="var(--color-focusTime)"
            yAxisId="right"
            strokeWidth={2}
          />
        </ComposedChart>
      </ChartContainer>
    </Card>
  );
}
