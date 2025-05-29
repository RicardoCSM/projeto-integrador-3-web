// components/grafico-bar.tsx
"use client"; // Se o seu gráfico usa hooks (como os do Recharts), ele precisa ser um Client Component

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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

interface FaltasData {
  day: string;
  faltas: number;
}

// O componente agora espera a prop 'data'
interface ChartAreaInteractiveProps {
  data: FaltasData[];
}

const chartConfig = {
  faltas: {
    label: "Faltas",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

// Receba a prop 'data' aqui
export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Faltas da Semana</CardTitle>
        <CardDescription>Segunda - Sábado</CardDescription>
      </CardHeader>
      <CardContent className="px-3">
        <ChartContainer config={chartConfig} className="h-[300px]">
          {/* Use 'data' aqui para renderizar o gráfico */}
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
            <Bar dataKey="faltas" fill="var(--color-faltas)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}