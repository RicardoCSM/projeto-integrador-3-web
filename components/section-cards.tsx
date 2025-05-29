import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cards } from "@/app/actions/dashboard";

export function SectionCards({ cards } : {
  cards: Cards;
}) {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Número de Faltas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {cards.numFaltas}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Número de Presenças</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {cards.numPresencas}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card @main:col-span-1 @xl/main:col-span-2 @5xl/main:col-span-1">
        <CardHeader className="relative">
          <CardDescription>Porcentagem de Faltas</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {cards.porcentagemFaltas.toFixed(1)} %
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
