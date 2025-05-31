export interface BarChartData {
  day: string;
  absences: number;
}

export interface PieChartData {
  key: string;
  count: number;
  fill: string;
}

export interface Cards {
  absencesCount: number;
  attendanceCount: number;
  absencesPercentage: number;
}
