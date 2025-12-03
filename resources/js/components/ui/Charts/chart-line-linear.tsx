"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { ArrowDownRight, Minus, TrendingUp } from "lucide-react";

interface ChartLineLinearProps {
  title: string;
  description?: string; // optional now, footer is computed
  chartData: Array<{ month: string; personas: number }>;
  chartConfig: ChartConfig; // expect key "personas" in your case
}

export const ChartLineLinear = ({
  title,
  description,
  chartData,
  chartConfig,
}: ChartLineLinearProps) => {
  // Use the last 6 data points if more are provided (defensive)
  const windowData = chartData.slice(-6);

  const total = windowData.reduce((s, d) => s + (d.personas ?? 0), 0);
  const current = windowData.at(-1)?.personas ?? 0;
  const prev = windowData.at(-2)?.personas ?? 0;

  const deltaAbs = current - prev;
  const deltaPct = prev === 0 ? null : (deltaAbs / prev) * 100;

  const trend =
    deltaAbs > 0 ? "up" : deltaAbs < 0 ? "down" : "flat";

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? ArrowDownRight : Minus;

  const trendColor =
    trend === "up"
      ? "text-emerald-600"
      : trend === "down"
      ? "text-red-600"
      : "text-muted-foreground";

  const firstLabel = windowData[0]?.month ?? "";
  const lastLabel = windowData.at(-1)?.month ?? "";

  const pctText =
    deltaPct == null
      ? "new vs last month" // handles prev === 0
      : `${Math.abs(deltaPct).toFixed(1)}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {/* Keep your original description if you pass one, else build a sensible default */}
        <CardDescription>
          {description ??
            (firstLabel && lastLabel
              ? `Showing personas created from ${firstLabel} to ${lastLabel}`
              : "Showing recent personas")}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            height={200}
            width={500}
            data={windowData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => String(value).slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="personas"                // <-- matches your data key
              type="linear"
              stroke="var(--color-personas)"     // <-- ChartContainer sets this var from config
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className={`flex items-center gap-2 leading-none font-medium ${trendColor}`}>
          {trend === "flat"
            ? "No change vs last month"
            : `Trending ${trend} by ${pctText}`}
          <TrendIcon className="h-4 w-4" />
        </div>

        <div className="leading-none text-muted-foreground">
          {firstLabel && lastLabel ? (
            <>
              Total personas {firstLabel}–{lastLabel}: <span className="font-medium text-foreground">{total}</span>
            </>
          ) : (
            <>Total personas: <span className="font-medium text-foreground">{total}</span></>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
