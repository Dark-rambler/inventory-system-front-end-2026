import { DashboardChartConfig } from '../interfaces/dashboard-chart.interface';

export const DASHBOARD_OVERVIEW_CHART_MOCK: DashboardChartConfig = {
  id: 1,
  title: 'Ventas por Canal',
  description: 'Participación de ingresos del mes actual',
  metricLabel: 'Ingresos del Mes',
  metricValue: '$84,200',
  trend: '+8.4% vs mes anterior',
  trendDirection: 'up',
  type: 'doughnut',
  labels: ['POS', 'Sucursales', 'Ventas corporativas', 'Comercio en línea'],
  values: [36400, 21900, 14700, 11200],
  color: '#0f5d8a',
  segmentColors: ['#0f5d8a', '#1d8dbf', '#58b7d8', '#9ad9ea'],
};

export const DASHBOARD_MOVEMENTS_CHART_MOCK: DashboardChartConfig = {
  id: 2,
  title: 'Movimientos por Tipo',
  description: 'Actividad de inventario de los últimos 7 días',
  metricLabel: 'Total Movimientos',
  metricValue: '1,284',
  trend: '+12% vs semana anterior',
  trendDirection: 'up',
  type: 'doughnut',
  labels: ['Transferencias', 'Entradas', 'Salidas', 'Ajustes'],
  values: [418, 356, 301, 209],
  color: '#0b766e',
  segmentColors: ['#0b766e', '#129990', '#4bc2b9', '#95e1db'],
};
