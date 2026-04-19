import { CommonModule, NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ViewChild,
  inject,
  input,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import { DashboardChartConfig } from '../../interfaces/dashboard-chart.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './chart-card.component.html',
})
export class ChartCardComponent implements AfterViewInit, OnChanges {
  private readonly _destroyRef = inject(DestroyRef);
  private _chartInstance: Chart | null = null;

  @ViewChild('chartCanvas') private _chartCanvas?: ElementRef<HTMLCanvasElement>;

  public chart = input.required<DashboardChartConfig>();

  protected get summaryItems(): {
    label: string;
    value: number;
    color: string;
    percentage: number;
  }[] {
    const chart = this.chart();
    const total = chart.values.reduce((sum, value) => sum + value, 0);

    return chart.labels.map((label, index) => {
      const value = chart.values[index] ?? 0;
      return {
        label,
        value,
        color: chart.segmentColors?.[index] ?? chart.color,
        percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      };
    });
  }

  protected get trendClass(): string {
    switch (this.chart().trendDirection) {
      case 'up':
        return 'text-success';
      case 'down':
        return 'text-danger';
      default:
        return 'text-gray-500';
    }
  }

  public ngAfterViewInit(): void {
    this._renderChart();

    this._destroyRef.onDestroy(() => {
      this._destroyChart();
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['chart'] && !changes['chart'].firstChange) {
      this._renderChart();
    }
  }

  private _renderChart(): void {
    const canvas = this._chartCanvas?.nativeElement;
    if (!canvas) return;

    this._destroyChart();

    const inputChart = this.chart();
    const type = inputChart.type as ChartType;

    const config =
      type === 'doughnut'
        ? this._createDoughnutConfig(inputChart)
        : this._createCartesianConfig(inputChart, type === 'bar' ? 'bar' : 'line');

    this._chartInstance = new Chart(canvas, config);
  }

  private _createDoughnutConfig(
    chart: DashboardChartConfig
  ): ChartConfiguration<'doughnut', number[], string> {
    return {
      type: 'doughnut',
      data: {
        labels: chart.labels,
        datasets: [
          {
            label: chart.title,
            data: chart.values,
            borderColor: '#ffffff',
            backgroundColor: chart.segmentColors ?? chart.labels.map(() => chart.color),
            borderWidth: 3,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: { intersect: false },
        },
      },
    };
  }

  private _createCartesianConfig(
    chart: DashboardChartConfig,
    type: 'line' | 'bar'
  ): ChartConfiguration<'line' | 'bar', number[], string> {
    return {
      type,
      data: {
        labels: chart.labels,
        datasets: [
          {
            label: chart.title,
            data: chart.values,
            borderColor: chart.color,
            backgroundColor: this._withOpacity(chart.color, 0.2),
            borderWidth: 2,
            fill: type === 'line',
            tension: 0.35,
            maxBarThickness: 34,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#6b7280' },
          },
          y: {
            beginAtZero: true,
            ticks: { color: '#9ca3af' },
            grid: { color: '#e5e7eb' },
          },
        },
      },
    };
  }

  private _destroyChart(): void {
    if (!this._chartInstance) return;

    this._chartInstance.destroy();
    this._chartInstance = null;
  }

  private _withOpacity(hexColor: string, alpha: number): string {
    const sanitized = hexColor.replace('#', '');
    const expanded =
      sanitized.length === 3
        ? sanitized
            .split('')
            .map(char => `${char}${char}`)
            .join('')
        : sanitized;

    const normalizedAlpha = Math.max(0, Math.min(1, alpha));
    const red = parseInt(expanded.slice(0, 2), 16);
    const green = parseInt(expanded.slice(2, 4), 16);
    const blue = parseInt(expanded.slice(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${normalizedAlpha})`;
  }
}
