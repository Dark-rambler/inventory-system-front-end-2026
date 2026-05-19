import { HttpParams } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginatorInterface } from '@shared/interfaces/paginator.interface';
import { BusinessService } from '@shared/services/business.service';
import { buildHttpParams } from '@shared/utils/http-params';
import { Observable, of } from 'rxjs';
import { BUSINESS_PARAMETER_MAPPING } from '../constants/business-parameter-mapping.constant';
import { DEFAULT_GET_BUSINESS_PARAMS } from '../constants/default-business-params.constant';
import { BusinessParams } from '../interfaces/business-params.interface';
import { Business } from '@shared/interfaces/business.interface';

@Injectable()
export class BusinessResourceService {
  private readonly _businessService: BusinessService = inject(BusinessService);
  public filterBusinessParameters = signal<BusinessParams>(DEFAULT_GET_BUSINESS_PARAMS);

  public readonly businessResource = rxResource({
    request: () => {
      const filters = this.filterBusinessParameters();
      return filters;
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getBusiness(request);
    },
  });

  public businessData = linkedSignal(() => this.businessResource.value() ?? null);
  public isLoading = this.businessResource.isLoading;
  public reloadBusiness = () => this.businessResource.reload();

  public isEmpty = linkedSignal(() => this.businessData());

  public hasActiveFilters = linkedSignal(() =>
    this._hasActiveFilters(this.filterBusinessParameters())
  );

  private _getBusiness(request: BusinessParams): Observable<PaginatorInterface<Business>> {
    const params = this._createRequest(request);
    return this._businessService.getAll(params);
  }

  private _createRequest(request: BusinessParams): HttpParams {
    return buildHttpParams(request, BUSINESS_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: BusinessParams): boolean {
    const hasStringFilters = !!(params.name || params.page || params.pageSize);

    return hasStringFilters;
  }
}
