import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  PaginatorComponent,
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '@shared/components/table';
import { WAREHOUSE_BRANCH_PRODUCT_COLUMNS } from '../../constants/warehouse-branch-product-columns.constant';
import { WarehouseBranchDetailResourceService } from '../../services/warehouse-branch-detail-resource.service';

@Component({
  selector: 'app-warehouse-branch-existing-products-table',
  standalone: true,
  imports: [CommonModule, TableComponent, TableColumnDirective, PaginatorComponent],
  templateUrl: './warehouse-branch-existing-products-table.component.html',
})
export class WarehouseBranchExistingProductsTableComponent {
  private readonly _warehouseBranchDetailResourceService = inject(
    WarehouseBranchDetailResourceService
  );
  private readonly _selectedProductIds = signal<string[]>([]);

  public readonly resetKey = input<number>(0);
  public readonly selectedProductIdsChange = output<string[]>();

  public readonly productsData = this._warehouseBranchDetailResourceService.productsData;
  public readonly currentPage = this._warehouseBranchDetailResourceService.productPagination;
  public readonly isLoading = this._warehouseBranchDetailResourceService.isLoadingProducts;
  public readonly selectedProductsCount = computed(() => this._selectedProductIds().length);
  public readonly isAllVisibleSelected = computed(() => {
    const visibleProducts = this.productsData().items;
    if (!visibleProducts.length) {
      return false;
    }

    const selectedIds = this._selectedProductIds();
    return visibleProducts.every(product => selectedIds.includes(product.id));
  });

  constructor() {
    effect(() => {
      this.resetKey();
      this._selectedProductIds.set([]);
      this.selectedProductIdsChange.emit([]);
    });
  }

  public readonly tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron productos para este almacen',
    showLoading: this.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly productColumns = WAREHOUSE_BRANCH_PRODUCT_COLUMNS;

  protected isProductSelected(productId: string): boolean {
    return this._selectedProductIds().includes(productId);
  }

  protected toggleProductSelection(productId: string, isChecked: boolean): void {
    const selectedSet = new Set(this._selectedProductIds());

    if (isChecked) {
      selectedSet.add(productId);
    } else {
      selectedSet.delete(productId);
    }

    const selectedIds = Array.from(selectedSet);
    this._selectedProductIds.set(selectedIds);
    this.selectedProductIdsChange.emit(selectedIds);
  }

  protected toggleVisibleProducts(isChecked: boolean): void {
    const visibleProducts = this.productsData().items;
    const selectedSet = new Set(this._selectedProductIds());

    visibleProducts.forEach(product => {
      if (isChecked) {
        selectedSet.add(product.id);
      } else {
        selectedSet.delete(product.id);
      }
    });

    const selectedIds = Array.from(selectedSet);
    this._selectedProductIds.set(selectedIds);
    this.selectedProductIdsChange.emit(selectedIds);
  }

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
