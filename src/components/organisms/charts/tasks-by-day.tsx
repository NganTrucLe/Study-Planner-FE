import { Bar, ComposedChart, CartesianGrid, Label, XAxis, YAxis, Line } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardHeader, CardTitle } from "@/components/ui";
import { format } from "date-fns";
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

type TasksByDayProps = {
  className?: string;
  chartData?: {
    dayOfWeek: string | Date;
    tasks: number;
    focusTime: number;
  }[];
  chartType?: "weekly" | "monthly";
};

export default function TasksByDay({
  className,
  chartType = "weekly",
  chartData = [],
}: TasksByDayProps) {
  return (
    <Card className={cn("flex flex-col rounded-md border px-4 pb-4", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>
          Tasks and focus time by day in {chartType == "weekly" ? "week" : "month"}
        </CardTitle>
      </CardHeader>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <ComposedChart
          accessibilityLayer
          data={chartData}
          margin={{ bottom: 20, left: 20, right: 20 }}
          className="overflow-visible"
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="dayOfWeek"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => {
              if (chartType === "monthly") return format(value, "d/MM");
              return format(value, "EEE");
            }}
          >
            <Label value="Days of week" offset={-10} position="insideBottom" />
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
            tickCount={8}
            orientation="right"
            yAxisId="right"
            dataKey="focusTime"
            domain={[0, "dataMax + 1"]}
            unit={"h"}
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
