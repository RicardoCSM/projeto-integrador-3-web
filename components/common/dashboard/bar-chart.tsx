"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChartData } from "@/types/Dashboard";

const chartConfig = {
  absences: {
    label: "Faltas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function DashboardBarChart({ data }: { data: BarChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Faltas da Semana</CardTitle>
        <CardDescription>Segunda - Sábado</CardDescription>
      </CardHeader>
      <CardContent className="px-3">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="absences" fill="var(--color-absences)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
