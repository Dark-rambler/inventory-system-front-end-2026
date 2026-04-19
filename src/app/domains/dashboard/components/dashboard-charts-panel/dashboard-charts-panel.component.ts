import { Component, inject } from '@angular/core';
import { ChartCardComponent } from '../chart-card/chart-card.component';
import { DashboardResourceService } from '../../services/dashboard-resource.service';

@Component({
  selector: 'app-dashboard-charts-panel',
  standalone: true,
  imports: [ChartCardComponent],
  templateUrl: './dashboard-charts-panel.component.html',
})
export class DashboardChartsPanelComponent {
  private readonly _dashboardResourceService = inject(DashboardResourceService);

  protected readonly areChartsLoading = this._dashboardResourceService.areChartsLoading;
  protected readonly overviewChart = this._dashboardResourceService.overviewChart;
  protected readonly movementChart = this._dashboardResourceService.movementChart;
}
