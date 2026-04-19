import { Component, OnInit, inject } from '@angular/core';
import { DashboardChartsPanelComponent } from './components/dashboard-charts-panel/dashboard-charts-panel.component';
import { DashboardKpiCardsComponent } from './components/dashboard-kpi-cards/dashboard-kpi-cards.component';
import { RecentActivityCardComponent } from './components/recent-activity-card/recent-activity-card.component';
import { DashboardResourceService } from './services/dashboard-resource.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardKpiCardsComponent, RecentActivityCardComponent, DashboardChartsPanelComponent],
  providers: [DashboardResourceService],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly _dashboardResourceService = inject(DashboardResourceService);

  public ngOnInit(): void {
    this._dashboardResourceService.loadCharts();
  }
}
