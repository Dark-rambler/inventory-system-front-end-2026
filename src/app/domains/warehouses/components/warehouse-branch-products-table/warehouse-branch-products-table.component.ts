import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  PaginatorComponent,
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '@shared/components/table';
import { WAREHOUSE_BRANCH_PRODUCT_COLUMNS } from '../../constants/warehouse-branch-product-columns.constant';
import { WarehouseBranchDetailResourceService } from '../../services/warehouse-branch-detail-resource.service';

@Component({
  selector: 'app-warehouse-branch-products-table',
  standalone: true,
  imports: [CommonModule, TableComponent, TableColumnDirective, PaginatorComponent],
  templateUrl: './warehouse-branch-products-table.component.html',
})
export class WarehouseBranchProductsTableComponent {
  private readonly _warehouseBranchDetailResourceService = inject(
    WarehouseBranchDetailResourceService
  );

  public readonly productsData = this._warehouseBranchDetailResourceService.productsData;
  public readonly currentPage = this._warehouseBranchDetailResourceService.productPagination;

  public readonly tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron productos para esta sucursal',
    showLoading: false,
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly productColumns = WAREHOUSE_BRANCH_PRODUCT_COLUMNS;

  protected changePage(page: number): void {
    this._warehouseBranchDetailResourceService.productPagination.update(params => ({
      ...params,
      page,
    }));
  }

  protected changePageSize(pageSize: number): void {
    this._warehouseBranchDetailResourceService.productPagination.update(params => ({
      ...params,
      page: 1,
      pageSize,
    }));
  }
}
