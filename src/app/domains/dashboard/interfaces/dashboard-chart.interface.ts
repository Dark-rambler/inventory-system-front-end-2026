export type DashboardChartType = 'line' | 'bar' | 'doughnut';

export type DashboardTrendDirection = 'up' | 'down' | 'neutral';

export interface DashboardChartConfig {
  id: number;
  title: string;
  description: string;
  metricLabel: string;
  metricValue: string;
  trend: string;
  trendDirection: DashboardTrendDirection;
  type: DashboardChartType;
  labels: string[];
  values: number[];
  color: string;
  segmentColors?: string[];
}
