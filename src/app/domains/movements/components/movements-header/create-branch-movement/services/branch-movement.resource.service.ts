import { HttpParams } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Movement } from '@app/domains/movements/interfaces/movement.interface';
import { DEFAULT_GET_USER_PARAMS } from '@app/domains/users/constants/default-user-params.constants';
import { USER_PARAMETER_MAPPING } from '@app/domains/users/constants/user-mapping.constant';
import { UserParams } from '@app/domains/users/interfaces/user-params.interface';
import { PaginatorInterface } from '@app/shared/interfaces/paginator.interface';
import { InventoryMovementService } from '@app/shared/services/inventory-movement.service';
import { buildHttpParams } from '@app/shared/utils/http-params';
import { Observable, of } from 'rxjs';

@Injectable()
export class BranchMovementResourceService {
  private readonly _inventoryMovementService = inject(InventoryMovementService);
  private readonly _branchId = signal<string | null>(null);

  public filterUserParameters = signal<UserParams>(DEFAULT_GET_USER_PARAMS);

  public setBranchId(branchId: string | null): void {
    this._branchId.set(branchId);
  }

  public readonly userResource = rxResource({
    request: () => {
      const filters = this.filterUserParameters();
      const branchId = this._branchId();
      return { filters, branchId };
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!request.branchId) return of(null);
      if (!this._hasActiveFilters(request.filters)) return of(null);
      return this._getUser(request.filters, request.branchId);
    },
  });

  public movementData = linkedSignal(() => this.userResource.value() ?? null);
  public isLoading = this.userResource.isLoading;
  public reloadUser = () => this.userResource.reload();

  public isEmpty = linkedSignal(() => {
    const data = this.movementData();
    return !data || data.items.length === 0;
  });

  public hasActiveFilters = linkedSignal(() => this._hasActiveFilters(this.filterUserParameters()));

  private _getUser(
    request: UserParams,
    branchId: string
  ): Observable<PaginatorInterface<Movement>> {
    const params = this._createRequest(request);
    const requestParams: HttpParams = params.set('branchId', branchId);
    return this._inventoryMovementService.getAll(requestParams);
  }

  private _createRequest(request: UserParams): HttpParams {
    return buildHttpParams(request, USER_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: UserParams): boolean {
    const hasStringFilters = !!(
      params.name ||
      params.userName ||
      params.email ||
      params.role ||
      params.page ||
      params.pageSize
    );

    return hasStringFilters;
  }
}
