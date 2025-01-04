import { ComposedChart, CartesianGrid, Label, XAxis, YAxis, Line } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardHeader, CardTitle } from "@/components/ui";
import { cn } from "@/lib/utils";

const chartConfig = {
  days: {
    label: "Number of days",
    color: "#34c5aa",
  },
} satisfies ChartConfig;

type TasksByDayProps = {
  className?: string;
  chartData?: {
    hour: number;
    days: number;
  }[];
};

export default function FocusTimeTrend({ className, chartData = [] }: TasksByDayProps) {
  return (
    <Card className={cn("flex flex-col rounded-md border px-4 pb-4", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Focus time trend</CardTitle>
      </CardHeader>
      <ChartContainer config={chartConfig} className="min-h-[100px] w-full">
        <ComposedChart
          accessibilityLayer
          data={chartData}
          margin={{ bottom: 20, left: 20, right: 20 }}
          className="overflow-visible"
        >
          <CartesianGrid vertical={false} />
          <XAxis dataKey="hour" tickLine={false} axisLine={false}>
            <Label offset={-10} position="insideBottom" value="Focus time" />
          </XAxis>
          <YAxis tickLine={false} axisLine={false} tickCount={5} yAxisId="left" dataKey="days">
            <Label
              value="Number of days"
              offset={5}
              position="insideLeft"
              orientation="vertical"
              angle={-90}
              className="text-sm font-semibold"
            />
          </YAxis>
          <ChartTooltip cursor={false} content={<ChartTooltipContent className="mr-8" />} />
          <Line
            dataKey="days"
            stroke="var(--color-days)"
            radius={0}
            yAxisId="left"
            strokeWidth={2}
            type="monotone"
            dot={false}
          />
        </ComposedChart>
      </ChartContainer>
    </Card>
  );
}
