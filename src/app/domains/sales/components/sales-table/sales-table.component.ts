import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  PaginatorComponent,
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '../../../../shared/components/table';
import { SALES_COLUMNS } from '../../interfaces/sale.interface';
import { SalesResourceService } from '../../services/sales-resource.service';

@Component({
  selector: 'app-sales-table',
  standalone: true,
  imports: [CommonModule, TableComponent, TableColumnDirective, PaginatorComponent],
  templateUrl: './sales-table.component.html',
})
export class SalesTableComponent {
  private readonly _salesResourceService = inject(SalesResourceService);

  public salesData = this._salesResourceService.salesData;
  public currentPage = this._salesResourceService.filterSalesParameters;

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron ventas',
    showLoading: this._salesResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));
  protected readonly salesColumns = SALES_COLUMNS;

  protected changePage(page: number): void {
    this._salesResourceService.filterSalesParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._salesResourceService.filterSalesParameters.update(p => ({
      ...p,
      page: 1,
      pageSize,
    }));
  }
}
