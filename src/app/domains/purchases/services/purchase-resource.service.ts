import { HttpParams } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { Purchase } from '../../../shared/interfaces/purchase.interface';
import { PurchaseService } from '../../../shared/services/purchase.service';
import { buildHttpParams } from '../../../shared/utils/http-params';
import { DEFAULT_GET_PURCHASE_PARAMS } from '../constants/default-purchase-params.constants';
import { PURCHASE_PARAMETER_MAPPING } from '../constants/purchase-mapping.constant';
import { PurchaseParams } from '../interfaces/purchase-params.interface';

@Injectable()
export class PurchaseResourceService {
  private readonly _purchaseService = inject(PurchaseService);

  public filterPurchaseParameters = signal<PurchaseParams>(DEFAULT_GET_PURCHASE_PARAMS);

  public readonly purchaseResource = rxResource({
    request: () => {
      const filters = this.filterPurchaseParameters();
      return filters;
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getPurchases(request);
    },
  });

  public purchaseData = linkedSignal(() => this.purchaseResource.value() ?? null);
  public isLoading = this.purchaseResource.isLoading;
  public reloadPurchases = () => this.purchaseResource.reload();

  public isEmpty = linkedSignal(() => this.purchaseData());

  public hasActiveFilters = linkedSignal(() =>
    this._hasActiveFilters(this.filterPurchaseParameters())
  );

  private _getPurchases(request: PurchaseParams): Observable<PaginatorInterface<Purchase>> {
    const params = this._createRequest(request);
    return this._purchaseService.getAll(params);
  }

  private _createRequest(request: PurchaseParams): HttpParams {
    return buildHttpParams(request, PURCHASE_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: PurchaseParams): boolean {
    const hasFilters = !!(
      params.folio ||
      params.supplierName ||
      params.status ||
      params.page ||
      params.pageSize
    );

    return hasFilters;
  }
}
