"use server";

import { getDoc } from "@/services/google-spreadsheets";
import { User } from "@/types/User";

interface FaltasData {
  day: string;
  faltas: number;
}

export interface PieChartData {
  key: string;
  quantidade: number;
  fill: string
}

export interface Cards {
  numFaltas: number;
  numPresencas: number;
  porcentagemFaltas: number;
}

export async function fetchDashboard(user: User, bimestre: number = 1): Promise<{
  barChart: FaltasData[];
  pieChart: PieChartData[];
  cards: Cards;
} | null> {
  try {
    const classIndex = user.class?.index || 0;
    const userPosition = user.position;

    const doc = getDoc(bimestre);
    await doc.loadInfo()

    if (classIndex < 0 || classIndex >= doc.sheetCount) {
      throw new Error("Índice de classe inválido");
    }

    const sheet = doc.sheetsByIndex[classIndex];

    const data: string[][] = await sheet.getCellsInRange(`E3:EE3`);

    const userRowData: string[][] = await sheet.getCellsInRange(`E${userPosition}:EE${userPosition}`);

    const dayLabels = data[0].slice(0, -2);

    const userValues = userRowData[0].slice(0, -2);

    if (!dayLabels || !userValues || dayLabels.length !== userValues.length) {
      console.error("Discrepância entre os rótulos dos dias e os valores do usuário.");
      return null;
    }

    const faltasMap: Record<string, number> = {};

    userValues.forEach((userValue, index) => {
      const dayLabel = dayLabels[index];

      if (userValue === "F") {
        faltasMap[dayLabel] = (faltasMap[dayLabel] || 0) + 1;
      }
    });

     const faltasArray: FaltasData[] = [
      {
        day: "seg",
        faltas: faltasMap["seg."] || 0,
      },
      {
        day: "ter",
        faltas: faltasMap["ter."] || 0,
      },
      {
        day: "qua",
        faltas: faltasMap["qua."] || 0,
      },
      {
        day: "qui",
        faltas: faltasMap["qui."] || 0,
      },
      {
        day: "sex",
        faltas: faltasMap["sex."] || 0,
      },
      {
        day: "sab",
        faltas: faltasMap["sab."] || 0,
      },
    ];

    //---------------------------------------------

    const pieChartMap: Record<string, number> = {};

    userValues.forEach((userValue, index) => {

      switch(userValue) {
        case "F":
          pieChartMap["faltas"] = (pieChartMap["faltas"] || 0) + 1;
          break;

        case "P":
          pieChartMap["presencas"] = (pieChartMap["presencas"] || 0) + 1;
          break;

        case "FJ":
          pieChartMap["faltasJustificadas"] = (pieChartMap["faltasJustificadas"] || 0) + 1;
          break;
      }
    });

    const pieChartArray: PieChartData[] = [
      {
        key: "faltas",
        quantidade: pieChartMap["faltas"] || 0,
        fill: "var(--color-faltas)"
      },
         {
        key: "faltasJustificadas",
        quantidade: pieChartMap["faltasJustificadas"] || 0,
        fill: "var(--color-faltasJustificadas)"
      },
         {
        key: "presencas",
        quantidade: pieChartMap["presencas"] || 0,
        fill: "var(--color-presencas)"
      }
    ];

    const cards: Cards = {
      numFaltas: 0,
      numPresencas: 0,
      porcentagemFaltas: 0
    }

    userValues.forEach((userValue, index) => {
      switch(userValue) {
        case "F":
          cards.numFaltas++;
          break;
        case "P":
         cards.numPresencas++;
          break;
      }
    });

    const total = userValues.filter((value) => value !== "0").length;

    cards.porcentagemFaltas = (cards.numFaltas / total) * 100;

    return {
      barChart: faltasArray,
      pieChart: pieChartArray,
      cards: cards
    };
  } catch (error) {
    console.error("Erro ao buscar dados de faltas:", error);
    return null;
  }
}