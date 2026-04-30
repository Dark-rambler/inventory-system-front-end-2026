import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  PaginatorComponent,
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '@shared/components/table';
import { WAREHOUSE_BRANCH_MOVEMENT_COLUMNS } from '../../constants/warehouse-branch-movement-columns.constant';
import { WarehouseBranchDetailResourceService } from '../../services/warehouse-branch-detail-resource.service';

@Component({
  selector: 'app-warehouse-branch-movements-table',
  standalone: true,
  imports: [CommonModule, TableComponent, TableColumnDirective, PaginatorComponent],
  templateUrl: './warehouse-branch-movements-table.component.html',
})
export class WarehouseBranchMovementsTableComponent {
  private readonly _warehouseBranchDetailResourceService = inject(
    WarehouseBranchDetailResourceService
  );

  public readonly movementsData = this._warehouseBranchDetailResourceService.movementsData;
  public readonly currentPage = this._warehouseBranchDetailResourceService.movementPagination;
  public readonly isLoading = this._warehouseBranchDetailResourceService.isLoadingMovements;

  public readonly tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron movimientos para esta sucursal',
    showLoading: this.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly movementColumns = WAREHOUSE_BRANCH_MOVEMENT_COLUMNS;

  protected changePage(page: number): void {
    this._warehouseBranchDetailResourceService.movementPagination.update(params => ({
      ...params,
      page,
    }));
  }

  protected changePageSize(pageSize: number): void {
    this._warehouseBranchDetailResourceService.movementPagination.update(params => ({
      ...params,
      page: 1,
      pageSize,
    }));
  }
}
