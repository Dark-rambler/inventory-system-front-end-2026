import { Component } from '@angular/core';
import { DASHBOARD_KPI_MOCK } from '../../constants/dashboard-kpi.mock';
import { DashboardKpi, DashboardKpiTone } from '../../interfaces/dashboard-kpi.interface';

@Component({
  selector: 'app-dashboard-kpi-cards',
  standalone: true,
  templateUrl: './dashboard-kpi-cards.component.html',
})
export class DashboardKpiCardsComponent {
  protected readonly kpis: DashboardKpi[] = DASHBOARD_KPI_MOCK;

  protected getHintToneClass(tone: DashboardKpiTone): string {
    switch (tone) {
      case 'success':
        return 'text-success';
      case 'info':
        return 'text-info';
      case 'warning':
        return 'text-warning';
      case 'danger':
        return 'text-danger';
      default:
        return 'text-gray-500 dark:text-slate-400';
    }
  }
}
