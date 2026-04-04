import { HttpParams } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
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

  // TODO: replace with a dynamic signal once branch selection is implemented
  private readonly _branchId = 'f2087baf-9728-4bca-a265-9f905ad39667';

  public filterInventoryParameters = signal<InventoryParams>(DEFAULT_GET_INVENTORY_PARAMS);

  public readonly inventoryResource = rxResource({
    request: () => {
      const filters = this.filterInventoryParameters();
      return filters;
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

  private _getInventory(request: InventoryParams): Observable<PaginatorInterface<Inventory>> {
    const params = this._createRequest(request);
    return this._inventoryService.getByBranch(this._branchId, params);
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
}
