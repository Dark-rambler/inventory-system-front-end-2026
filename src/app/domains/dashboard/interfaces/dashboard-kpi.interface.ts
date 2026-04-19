export type DashboardKpiTone = 'success' | 'info' | 'warning' | 'danger' | 'neutral';

export interface DashboardKpi {
  id: number;
  title: string;
  value: string;
  hint: string;
  tone: DashboardKpiTone;
}
