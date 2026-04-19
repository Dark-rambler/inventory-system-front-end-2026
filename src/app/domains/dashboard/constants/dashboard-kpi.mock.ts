import { DashboardKpi } from '../interfaces/dashboard-kpi.interface';

export const DASHBOARD_KPI_MOCK: DashboardKpi[] = [
  {
    id: 1,
    title: 'Ventas de Hoy',
    value: '$12,480',
    hint: '+6.3% vs ayer (POS + Sucursales)',
    tone: 'success',
  },
  {
    id: 2,
    title: 'Movimientos de Inventario',
    value: '328',
    hint: '54 transferencias, 174 entradas, 100 salidas',
    tone: 'info',
  },
  {
    id: 3,
    title: 'Productos con Stock Bajo',
    value: '23',
    hint: '7 críticos en 3 sucursales',
    tone: 'warning',
  },
];
