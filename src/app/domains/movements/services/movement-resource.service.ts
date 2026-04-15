import { HttpParams } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { InventoryMovementService } from '../../../shared/services/inventory-movement.service';
import { buildHttpParams } from '../../../shared/utils/http-params';
import { DEFAULT_GET_MOVEMENT_PARAMS } from '../constants/default-movement-params.constants';
import { MOVEMENT_PARAMETER_MAPPING } from '../constants/movement-mapping.constant';
import { MovementParams } from '../interfaces/movement-params.interface';
import { Movement } from '../interfaces/movement.interface';

@Injectable()
export class MovementResourceService {
  private readonly _inventoryMovementService = inject(InventoryMovementService);

  public filterMovementParameters = signal<MovementParams>(DEFAULT_GET_MOVEMENT_PARAMS);

  public readonly movementResource = rxResource({
    request: () => {
      const filters = this.filterMovementParameters();
      return filters;
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getMovements(request);
    },
  });

  public movementData = linkedSignal(() => this.movementResource.value() ?? null);
  public isLoading = this.movementResource.isLoading;
  public reloadMovement = () => this.movementResource.reload();

  public hasActiveFilters = linkedSignal(() =>
    this._hasActiveFilters(this.filterMovementParameters())
  );

  private _getMovements(request: MovementParams): Observable<PaginatorInterface<Movement>> {
    const params = this._createRequest(request);
    return this._inventoryMovementService.getAll(params);
  }

  private _createRequest(request: MovementParams): HttpParams {
    return buildHttpParams(request, MOVEMENT_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: MovementParams): boolean {
    const hasStringFilters = !!(
      params.movementType ||
      params.productName ||
      params.branchName ||
      params.startDate ||
      params.endDate ||
      params.page ||
      params.pageSize
    );

    return hasStringFilters;
  }
}
