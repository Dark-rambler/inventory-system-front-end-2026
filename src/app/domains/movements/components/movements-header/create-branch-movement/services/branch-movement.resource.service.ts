import { HttpParams } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
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
  private readonly _router = inject(Router);

  public filterUserParameters = signal<UserParams>(DEFAULT_GET_USER_PARAMS);

  public readonly userResource = rxResource({
    request: () => {
      const filters = this.filterUserParameters();
      return filters;
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getUser(request);
    },
  });

  public movementData = linkedSignal(() => this.userResource.value() ?? null);
  public isLoading = this.userResource.isLoading;
  public reloadUser = () => this.userResource.reload();

  public isEmpty = linkedSignal(() => this.movementData());

  public hasActiveFilters = linkedSignal(() => this._hasActiveFilters(this.filterUserParameters()));

  private _getUser(request: UserParams): Observable<PaginatorInterface<Movement>> {
    const branchId = this._router.parseUrl(this._router.url).queryParams['branchId'];
    const params = this._createRequest(request);
    const requestParams: HttpParams = branchId ? params.set('branchId', String(branchId)) : params;
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
