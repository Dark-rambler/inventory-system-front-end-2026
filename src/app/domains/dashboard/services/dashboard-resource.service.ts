import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DashboardChartConfig } from '../interfaces/dashboard-chart.interface';
import { DashboardChartsService } from './dashboard-charts.service';

@Injectable()
export class DashboardResourceService {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _dashboardChartsService = inject(DashboardChartsService);

  public readonly overviewChart = signal<DashboardChartConfig | null>(null);
  public readonly movementChart = signal<DashboardChartConfig | null>(null);
  public readonly areChartsLoading = signal(true);

  public loadCharts(): void {
    this.areChartsLoading.set(true);

    forkJoin({
      overviewChart: this._dashboardChartsService.getOverviewChart(),
      movementChart: this._dashboardChartsService.getMovementChart(),
    })
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => this.areChartsLoading.set(false))
      )
      .subscribe({
        next: ({ overviewChart, movementChart }) => {
          this.overviewChart.set(overviewChart);
          this.movementChart.set(movementChart);
        },
        error: () => {
          this.overviewChart.set(null);
          this.movementChart.set(null);
        },
      });
  }
}
