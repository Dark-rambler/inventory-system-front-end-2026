import { HttpParams } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { Supplier } from '../../../shared/interfaces/supplier.interface';
import { SupplierService } from '../../../shared/services/supplier.service';
import { buildHttpParams } from '../../../shared/utils/http-params';
import { DEFAULT_GET_SUPPLIER_PARAMS } from '../constants/default-supplier-params.constants';
import { SUPPLIER_PARAMETER_MAPPING } from '../constants/supplier-mapping.constant';
import { SupplierParams } from '../interfaces/supplier-params.interface';
import { Observable, of } from 'rxjs';

@Injectable()
export class SupplierResourceService {
  private readonly _supplierService = inject(SupplierService);

  public filterSupplierParameters = signal<SupplierParams>(DEFAULT_GET_SUPPLIER_PARAMS);

  public readonly supplierResource = rxResource({
    request: () => {
      const filters = this.filterSupplierParameters();
      return filters;
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getSuppliers(request);
    },
  });

  public supplierData = linkedSignal(() => this.supplierResource.value() ?? null);
  public isLoading = this.supplierResource.isLoading;
  public reloadSuppliers = () => this.supplierResource.reload();

  public isEmpty = linkedSignal(() => this.supplierData());

  public hasActiveFilters = linkedSignal(() =>
    this._hasActiveFilters(this.filterSupplierParameters())
  );

  private _getSuppliers(request: SupplierParams): Observable<PaginatorInterface<Supplier>> {
    const params = this._createRequest(request);
    return this._supplierService.getAll(params);
  }

  private _createRequest(request: SupplierParams): HttpParams {
    return buildHttpParams(request, SUPPLIER_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: SupplierParams): boolean {
    const hasStringFilters = !!(
      params.name ||
      params.email ||
      params.phone ||
      params.page ||
      params.pageSize
    );

    return hasStringFilters;
  }
}
