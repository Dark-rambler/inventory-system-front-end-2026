import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { WarehouseService } from '../../../shared/services/warehouse.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { Warehouse } from '../../../shared/interfaces/warehouse.interface';
import { WarehouseParams } from '../interfaces/warehouse-params.interface';
import { DEFAULT_GET_WAREHOUSE_PARAMS } from '../constants/default-warehouse-params.constants';
import { buildHttpParams } from '../../../shared/utils/http-params';
import { WAREHOUSE_PARAMETER_MAPPING } from '../constants/warehouse-mapping.constant';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class WarehouseResourceService {
  private readonly _warehouseService: WarehouseService = inject(WarehouseService);

  public filterWarehouseParameters = signal<WarehouseParams>(DEFAULT_GET_WAREHOUSE_PARAMS);

  public readonly warehouseResource = rxResource({
    request: () => {
      const filters = this.filterWarehouseParameters();
      return filters;
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getWarehouse(request);
    },
  });

  public warehouseData = linkedSignal(() => this.warehouseResource.value() ?? null);
  public isLoading = this.warehouseResource.isLoading;
  public reloadWarehouse = () => this.warehouseResource.reload();

  public hasActiveFilters = linkedSignal(() =>
    this._hasActiveFilters(this.filterWarehouseParameters())
  );

  private _getWarehouse(request: WarehouseParams): Observable<PaginatorInterface<Warehouse>> {
    const params = this._createRequest(request);
    return this._warehouseService.getAll(params);
  }

  private _createRequest(request: WarehouseParams): HttpParams {
    return buildHttpParams(request, WAREHOUSE_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: WarehouseParams): boolean {
    const hasStringFilters = !!(params.name || params.location || params.page || params.pageSize);
    return hasStringFilters;
  }
}
