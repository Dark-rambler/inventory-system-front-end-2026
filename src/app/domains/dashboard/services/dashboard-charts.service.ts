import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  DASHBOARD_MOVEMENTS_CHART_MOCK,
  DASHBOARD_OVERVIEW_CHART_MOCK,
} from '../constants/dashboard-charts.mock';
import { DashboardChartConfig } from '../interfaces/dashboard-chart.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardChartsService {
  public getOverviewChart(): Observable<DashboardChartConfig> {
    return of(DASHBOARD_OVERVIEW_CHART_MOCK).pipe(delay(350));
  }

  public getMovementChart(): Observable<DashboardChartConfig> {
    return of(DASHBOARD_MOVEMENTS_CHART_MOCK).pipe(delay(350));
  }
}
