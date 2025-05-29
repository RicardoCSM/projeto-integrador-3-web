"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { fetchDashboard } from "@/app/actions/dashboard";

import { ChartAreaInteractive } from "@/components/grafico-bar";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/store/useAuth";
import { DashboardPieChart } from "@/components/pie-chart";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react";

export default function Dashboard() {
  const [bimestre, setBimestre] = useState<number>(1);
  const { user } = useAuth();
  const { isLoading, error, data } = useQuery({
    queryKey: ["dashboard", bimestre],
    queryFn: async () => {
      if (!user || !user.class) {
        throw new Error("Usuário inválido!")
      }
      const dashboard = await fetchDashboard(user, bimestre);

      return dashboard;
    },
  });

  if (error) {
    return <>Error: {error}</>;
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <Tabs defaultValue="1" onValueChange={(value) => setBimestre(parseInt(value))} className="p-3">
              <TabsList>
                <TabsTrigger value="1">1º Bimestre</TabsTrigger>
                <TabsTrigger value="2">2º Bimestre</TabsTrigger>
                <TabsTrigger value="3">3º Bimestre</TabsTrigger>
                <TabsTrigger value="4">4º Bimestre</TabsTrigger>
              </TabsList>
              <TabsContent value={bimestre.toString()}>
                {isLoading ? (
                  <></>
                ) : (
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <SectionCards cards={data?.cards || {
                      numFaltas: 0,
                      numPresencas: 0,
                      porcentagemFaltas: 0
                    }} />
                    <div className="grid md:grid-cols-2 gap-4 px-4 lg:px-6">
                      {/* 3. Passe os dados para o componente ChartAreaInteractive */}
                      <ChartAreaInteractive data={data?.barChart || []} />
                      <DashboardPieChart quantidadeData={data?.pieChart || []} />
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}