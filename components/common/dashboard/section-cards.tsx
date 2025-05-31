import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cards } from "@/types/Dashboard";
import { Copy, CopyX, PercentCircle } from "lucide-react";

export function SectionCards({ cards }: { cards: Cards }) {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Número de Faltas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {cards.absencesCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <CopyX />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Número de faltas no bimestre
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Número de Presenças</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {cards.attendanceCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Copy />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Número de presenças no bimestre
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card @main:col-span-1 @xl/main:col-span-2 @5xl/main:col-span-1">
        <CardHeader className="relative">
          <CardDescription>Porcentagem de Faltas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {cards.absencesPercentage.toFixed(1)} %
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <PercentCircle />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Número de faltas em relação ao total de aulas
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
