"use server";

import { getDoc } from "@/services/google-spreadsheets";
import { BarChartData, Cards, PieChartData } from "@/types/Dashboard";
import { User } from "@/types/User";

export async function fetchDashboard(
  user: User,
  bimestre: number = 1
): Promise<{
  barChart: BarChartData[];
  pieChart: PieChartData[];
  cards: Cards;
} | null> {
  try {
    const classIndex = user.class?.index || 0;
    const userPosition = user.position;

    const doc = getDoc(bimestre);
    await doc.loadInfo();

    if (classIndex < 0 || classIndex >= doc.sheetCount) {
      throw new Error("Índice de classe inválido");
    }

    const sheet = doc.sheetsByIndex[classIndex];

    const data: string[][] = await sheet.getCellsInRange(`E3:EE3`);

    const userRowData: string[][] = await sheet.getCellsInRange(
      `E${userPosition}:EE${userPosition}`
    );

    const dayLabels = data[0].slice(0, -2);

    const userValues = userRowData[0].slice(0, -2);

    if (!dayLabels || !userValues || dayLabels.length !== userValues.length) {
      console.error(
        "Discrepância entre os rótulos dos dias e os valores do usuário."
      );
      return null;
    }

    const absencesMap: Record<string, number> = {};
    const pieChartMap: Record<string, number> = {};
    const cards: Cards = {
      absencesCount: 0,
      attendanceCount: 0,
      absencesPercentage: 0,
    };

    userValues.forEach((userValue, index) => {
      const dayLabel = dayLabels[index];

      if (userValue === "F") {
        absencesMap[dayLabel] = (absencesMap[dayLabel] || 0) + 1;
      }

      switch (userValue) {
        case "F":
          pieChartMap["absences"] = (pieChartMap["absences"] || 0) + 1;
          cards.absencesCount++;
          break;
        case "P":
          pieChartMap["attendances"] = (pieChartMap["attendances"] || 0) + 1;
          cards.attendanceCount++;
          break;
        case "FJ":
          pieChartMap["justifiedAbsences"] =
            (pieChartMap["justifiedAbsences"] || 0) + 1;
          break;
      }
    });

    const barChartArray = mountBarChartArray(absencesMap);

    const pieChartArray = mountPieChartArray(pieChartMap);

    const total = userValues.filter((value) => value !== "0").length;

    cards.absencesPercentage = (cards.absencesCount / total) * 100;

    return {
      barChart: barChartArray,
      pieChart: pieChartArray,
      cards: cards,
    };
  } catch (error) {
    console.error("Erro ao buscar dados de absences:", error);
    return null;
  }
}

const mountBarChartArray = (
  absencesMap: Record<string, number>
): BarChartData[] => {
  return [
    { day: "Seg", absences: absencesMap["seg."] || 0 },
    { day: "Ter", absences: absencesMap["ter."] || 0 },
    { day: "Qua", absences: absencesMap["qua."] || 0 },
    { day: "Qui", absences: absencesMap["qui."] || 0 },
    { day: "Sex", absences: absencesMap["sex."] || 0 },
    { day: "Sab", absences: absencesMap["sab."] || 0 },
  ];
};

const mountPieChartArray = (
  pieChartMap: Record<string, number>
): PieChartData[] => {
  return [
    {
      key: "absences",
      count: pieChartMap["absences"] || 0,
      fill: "var(--color-absences)",
    },
    {
      key: "justifiedAbsences",
      count: pieChartMap["justifiedAbsences"] || 0,
      fill: "var(--color-justifiedAbsences)",
    },
    {
      key: "attendances",
      count: pieChartMap["attendances"] || 0,
      fill: "var(--color-attendances)",
    },
  ];
};
