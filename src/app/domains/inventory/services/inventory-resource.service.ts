import { HttpParams } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { getSelectedBranchIdFromStorage } from '@shared/utils/selected-branch-storage';
import { catchError, Observable, of } from 'rxjs';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { InventoryService } from '../../../shared/services/inventory.service';
import { buildHttpParams } from '../../../shared/utils/http-params';
import { DEFAULT_GET_INVENTORY_PARAMS } from '../constants/default-inventory-params.constants';
import { INVENTORY_PARAMETER_MAPPING } from '../constants/inventory-mapping.constant';
import { InventoryParams } from '../interfaces/inventory-params.interface';
import { Inventory } from '../interfaces/inventory.interface';

@Injectable()
export class InventoryResourceService {
  private readonly _inventoryService: InventoryService = inject(InventoryService);
  private readonly _currentBranchId = signal<string | null>(getSelectedBranchIdFromStorage());
  private readonly _allowStorageFallback = signal<boolean>(true);

  public filterInventoryParameters = signal<InventoryParams>(DEFAULT_GET_INVENTORY_PARAMS);

  public setBranchId(
    branchId: string | null,
    options?: { disableStorageFallback?: boolean }
  ): void {
    if (options?.disableStorageFallback) {
      this._allowStorageFallback.set(false);
    }

    this._currentBranchId.set(branchId);
  }

  public readonly inventoryResource = rxResource({
    request: () => {
      const filters = this.filterInventoryParameters();
      return {
        ...filters,
        branchId: this._currentBranchId(),
      };
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getInventory(request);
    },
  });

  public inventoryData = linkedSignal(() => this.inventoryResource.value() ?? null);
  public isLoading = this.inventoryResource.isLoading;
  public reloadInventory = () => this.inventoryResource.reload();

  public hasActiveFilters = linkedSignal(() =>
    this._hasActiveFilters(this.filterInventoryParameters())
  );

  private _getInventory(
    request: InventoryParams & { branchId?: string | null }
  ): Observable<PaginatorInterface<Inventory>> {
    const fallbackBranchId = this._allowStorageFallback() ? getSelectedBranchIdFromStorage() : null;
    const branchId = request.branchId ?? fallbackBranchId;
    if (!branchId) {
      return of(this._buildEmptyPaginator(request));
    }

    const params = this._createRequest(request);
    return this._inventoryService
      .getByBranch(branchId, params)
      .pipe(catchError(() => of(this._buildEmptyPaginator(request))));
  }

  private _createRequest(request: InventoryParams): HttpParams {
    return buildHttpParams(request, INVENTORY_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: InventoryParams): boolean {
    const hasStringFilters = !!(
      params.name ||
      params.code ||
      params.category ||
      params.page ||
      params.pageSize
    );
    return hasStringFilters;
  }

  private _buildEmptyPaginator(request: InventoryParams): PaginatorInterface<Inventory> {
    const pageIndex = request.page ?? 1;
    const pageSize = request.pageSize ?? 10;

    return {
      items: [],
      totalCount: 0,
      pageIndex,
      pageSize,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }
}
