export interface StatisticsI {
  name: string;
  type: string;
  count: number;
  details: string;
  weeklyReport: Record<string, any>[];
}
