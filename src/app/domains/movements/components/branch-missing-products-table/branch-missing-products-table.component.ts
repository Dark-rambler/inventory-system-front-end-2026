import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import {
  PaginatorComponent,
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '@shared/components/table';
import { BRANCH_MISSING_PRODUCTS_COLUMNS } from '../../constants/branch-missing-products-columns.constant';
import { BranchMissingProductsResourceService } from '../../services/branch-missing-products-resource.service';
import { BranchProductItem } from '@shared/interfaces/branch.interface';
import { Product } from '@shared/interfaces/product.interface';

type EditableField = 'price' | 'stock' | 'lowStock';

interface EditableValues {
  price: number | null;
  stock: number | null;
  lowStock: number | null;
}

@Component({
  selector: 'app-branch-missing-products-table',
  standalone: true,
  imports: [TableComponent, TableColumnDirective, PaginatorComponent],
  templateUrl: './branch-missing-products-table.component.html',
})
export class BranchMissingProductsTableComponent {
  private readonly _resourceService = inject(BranchMissingProductsResourceService);
  private readonly _selectedProductIds = signal<string[]>([]);
  private readonly _editableValues = signal<Record<string, EditableValues>>({});

  public readonly branchId = input<string | null>(null);
  public readonly resetKey = input<number>(0);
  public readonly selectedProductIdsChange = output<string[]>();
  public readonly selectedProductsPayloadChange = output<BranchProductItem[]>();

  public readonly missingProductsData = this._resourceService.missingProductsData;
  public readonly currentPage = this._resourceService.pagination;
  public readonly selectedProductsCount = computed(() => this._selectedProductIds().length);
  public readonly isAllVisibleSelected = computed(() => {
    const visibleProducts = this.missingProductsData().items;
    if (!visibleProducts.length) {
      return false;
    }

    const selectedIds = this._selectedProductIds();
    return visibleProducts.every(product => selectedIds.includes(product.id));
  });

  constructor() {
    effect(() => {
      this.resetKey();
      this._resourceService.setBranchId(this.branchId());
      this._selectedProductIds.set([]);
      this._editableValues.set({});
      this.selectedProductIdsChange.emit([]);
      this.selectedProductsPayloadChange.emit([]);
    });
  }

  public readonly tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No hay productos pendientes por agregar',
    showLoading: this._resourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly productColumns = BRANCH_MISSING_PRODUCTS_COLUMNS;

  protected changePage(page: number): void {
    this._resourceService.pagination.update(current => ({
      ...current,
      page,
    }));
  }

  protected changePageSize(pageSize: number): void {
    this._resourceService.pagination.update(current => ({
      ...current,
      page: 1,
      pageSize,
    }));
  }

  protected isProductSelected(productId: string): boolean {
    return this._selectedProductIds().includes(productId);
  }

  protected toggleProductSelection(product: Product, isChecked: boolean): void {
    const selectedSet = new Set(this._selectedProductIds());

    if (isChecked) {
      selectedSet.add(product.id);
    } else {
      selectedSet.delete(product.id);
    }

    const selectedIds = Array.from(selectedSet);
    this._selectedProductIds.set(selectedIds);
    this.selectedProductIdsChange.emit(selectedIds);
    this.selectedProductsPayloadChange.emit(this._buildSelectedPayload());
  }

  protected toggleVisibleProducts(isChecked: boolean): void {
    const visibleProducts = this.missingProductsData().items;
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
    this.selectedProductsPayloadChange.emit(this._buildSelectedPayload());
  }

  protected getEditableValue(productId: string, field: EditableField): number | null {
    return this._editableValues()[productId]?.[field] ?? null;
  }

  protected updateEditableValue(productId: string, field: EditableField, rawValue: string): void {
    const parsedValue = rawValue.trim() === '' ? null : Number(rawValue);

    this._editableValues.update(current => {
      const existing = current[productId] ?? { price: null, stock: null, lowStock: null };

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

        if (values.price === null || values.stock === null || values.lowStock === null) {
          return null;
        }

        return {
          productId,
          price: values.price,
          stock: values.stock,
          lowStock: values.lowStock,
        };
      })
      .filter((item): item is BranchProductItem => item !== null);
  }
}
