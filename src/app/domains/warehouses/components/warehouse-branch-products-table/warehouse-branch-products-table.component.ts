import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  PaginatorComponent,
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '@shared/components/table';
import { BranchProductItem } from '@shared/interfaces/branch.interface';
import { WAREHOUSE_BRANCH_MISSING_PRODUCT_COLUMNS } from '../../constants/warehouse-branch-missing-product-columns.constant';
import { WarehouseBranchProduct } from '../../interfaces/warehouse-branch-product.interface';
import { WarehouseBranchDetailResourceService } from '../../services/warehouse-branch-detail-resource.service';

type EditableField = 'unitPrice' | 'stock' | 'lowStock';

interface EditableValues {
  unitPrice: number | null;
  stock: number | null;
  lowStock: number | null;
}

@Component({
  selector: 'app-warehouse-branch-missing-products-table',
  standalone: true,
  imports: [CommonModule, TableComponent, TableColumnDirective, PaginatorComponent],
  templateUrl: './warehouse-branch-products-table.component.html',
})
export class WarehouseBranchMissingProductsTableComponent {
  private readonly _warehouseBranchDetailResourceService = inject(
    WarehouseBranchDetailResourceService
  );
  private readonly _selectedProductIds = signal<string[]>([]);
  private readonly _editableValues = signal<Record<string, EditableValues>>({});

  public readonly resetKey = input<number>(0);
  public readonly selectedProductIdsChange = output<string[]>();
  public readonly selectedProductsPayloadChange = output<BranchProductItem[]>();

  public readonly productsData = this._warehouseBranchDetailResourceService.missingProductsData;
  public readonly currentPage = this._warehouseBranchDetailResourceService.missingProductPagination;
  public readonly isLoading = this._warehouseBranchDetailResourceService.isLoadingMissingProducts;
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
      this._editableValues.set({});
      this.selectedProductIdsChange.emit([]);
      this.selectedProductsPayloadChange.emit([]);
    });
  }

  public readonly tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No hay productos pendientes por agregar a este almacen',
    showLoading: this.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly productColumns = WAREHOUSE_BRANCH_MISSING_PRODUCT_COLUMNS;

  protected changePage(page: number): void {
    this._warehouseBranchDetailResourceService.missingProductPagination.update(params => ({
      ...params,
      page,
    }));
  }

  protected changePageSize(pageSize: number): void {
    this._warehouseBranchDetailResourceService.missingProductPagination.update(params => ({
      ...params,
      page: 1,
      pageSize,
    }));
  }

  protected isProductSelected(productId: string): boolean {
    return this._selectedProductIds().includes(productId);
  }

  protected toggleProductSelection(product: WarehouseBranchProduct, isChecked: boolean): void {
    const selectedSet = new Set(this._selectedProductIds());

    if (isChecked) {
      selectedSet.add(product.id);
      this._editableValues.update(current => ({
        ...current,
        [product.id]: current[product.id] ?? {
          unitPrice: product.unitPrice ?? null,
          stock: product.stock ?? null,
          lowStock: null,
        },
      }));
    } else {
      selectedSet.delete(product.id);
    }

    const selectedIds = Array.from(selectedSet);
    this._selectedProductIds.set(selectedIds);
    this.selectedProductIdsChange.emit(selectedIds);
    this.selectedProductsPayloadChange.emit(this._buildSelectedPayload());
  }

  protected toggleVisibleProducts(isChecked: boolean): void {
    const visibleProducts = this.productsData().items;
    const selectedSet = new Set(this._selectedProductIds());

    visibleProducts.forEach(product => {
      if (isChecked) {
        selectedSet.add(product.id);
        this._editableValues.update(current => ({
          ...current,
          [product.id]: current[product.id] ?? {
            unitPrice: product.unitPrice ?? null,
            stock: product.stock ?? null,
            lowStock: null,
          },
        }));
      } else {
        selectedSet.delete(product.id);
      }
    });

    const selectedIds = Array.from(selectedSet);
    this._selectedProductIds.set(selectedIds);
    this.selectedProductIdsChange.emit(selectedIds);
    this.selectedProductsPayloadChange.emit(this._buildSelectedPayload());
  }

  protected getEditableValue(productId: string, field: EditableField): number | null {
    return this._editableValues()[productId]?.[field] ?? null;
  }

  protected updateEditableValue(productId: string, field: EditableField, rawValue: string): void {
    const parsedValue = rawValue.trim() === '' ? null : Number(rawValue);

    this._editableValues.update(current => {
      const existing = current[productId] ?? { unitPrice: null, stock: null, lowStock: null };

      return {
        ...current,
        [productId]: {
          ...existing,
          [field]: Number.isFinite(parsedValue) ? parsedValue : null,
        },
      };
    });

    this.selectedProductsPayloadChange.emit(this._buildSelectedPayload());
  }

  private _buildSelectedPayload(): BranchProductItem[] {
    const selectedIds = this._selectedProductIds();
    const editableValues = this._editableValues();

    return selectedIds
      .map(productId => {
        const values = editableValues[productId];
        if (!values) {
          return null;
        }

        if (values.unitPrice === null || values.stock === null || values.lowStock === null) {
          return null;
        }

        return {
          productId,
          price: values.unitPrice,
          stock: values.stock,
          lowStock: values.lowStock,
        };
      })
      .filter((item): item is BranchProductItem => item !== null);
  }
}
