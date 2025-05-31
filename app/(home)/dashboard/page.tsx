"use client";

import { SectionCards } from "@/components/common/dashboard/section-cards";
import { SiteHeader } from "@/components/site-header";
import { fetchDashboard } from "@/app/actions/dashboard";
import { DashboardBarChart } from "@/components/common/dashboard/bar-chart";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/store/useAuth";
import { DashboardPieChart } from "@/components/common/dashboard/pie-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const [bimestre, setBimestre] = useState<number>(1);
  const { user } = useAuth();
  const { isLoading, error, data } = useQuery({
    queryKey: ["dashboard", user?.id, bimestre],
    queryFn: async () => {
      if (!user || !user.class) {
        throw new Error("Usuário inválido!");
      }
      const dashboard = await fetchDashboard(user, bimestre);

      return dashboard;
    },
  });

  if (error) {
    return <>Error: {error}</>;
  }

  return (
    <>
      <SiteHeader />
      <div className="@container/main flex flex-1 flex-col gap-2 mt-16">
        <Tabs
          defaultValue="1"
          onValueChange={(value) => setBimestre(parseInt(value))}
        >
          <TabsList className="h-18 sm:h-9 md:mx-4 mt-6 grid grid-cols-2 sm:grid-cols-4 w-full md:w-max">
            <TabsTrigger value="1">1º Bimestre</TabsTrigger>
            <TabsTrigger value="2">2º Bimestre</TabsTrigger>
            <TabsTrigger value="3">3º Bimestre</TabsTrigger>
            <TabsTrigger value="4">4º Bimestre</TabsTrigger>
          </TabsList>
          <TabsContent value={bimestre.toString()}>
            {isLoading ? (
              <div className="flex flex-col gap-4 mx-6 py-4 md:gap-6 md:py-6">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                  <Skeleton className="aspect-video rounded-xl" />
                  <Skeleton className="aspect-video rounded-xl" />
                  <Skeleton className="aspect-video rounded-xl" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Skeleton className="aspect-video rounded-xl" />
                  <Skeleton className="aspect-video rounded-xl" />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards
                  cards={
                    data?.cards || {
                      absencesCount: 0,
                      attendanceCount: 0,
                      absencesPercentage: 0,
                    }
                  }
                />
                <div className="grid md:grid-cols-2 gap-4 lg:px-6">
                  <DashboardBarChart data={data?.barChart || []} />
                  <DashboardPieChart data={data?.pieChart || []} />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
