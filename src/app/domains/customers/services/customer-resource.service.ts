import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CustomerService } from '@shared/services/customer.service';
import { DEFAULT_GET_CUSTOMER_PARAMS } from '../constants/default-customer-params.constant';
import { CustomerParams } from '../interfaces/customer-params.interface';
import { Observable, of } from 'rxjs';
import { PaginatorInterface } from '@shared/interfaces/paginator.interface';
import { Customer } from '@shared/interfaces/customer.interface';
import { buildHttpParams } from '@shared/utils/http-params';
import { HttpParams } from '@angular/common/http';
import { CUSTOMER_PARAMETER_MAPPING } from '../constants/customer-parameter-mapping,constant';

@Injectable()
export class CustomerResourceService {
  private readonly _customerService: CustomerService = inject(CustomerService);
  public filterCustomerParameters = signal<CustomerParams>(DEFAULT_GET_CUSTOMER_PARAMS);

  public readonly customerResource = rxResource({
    request: () => {
      const filters = this.filterCustomerParameters();
      return filters;
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getCustomers(request);
    },
  });

  public customerData = linkedSignal(() => this.customerResource.value() ?? null);
  public isLoading = this.customerResource.isLoading;
  public reloadCustomer = () => this.customerResource.reload();

  public isEmpty = linkedSignal(() => this.customerData());

  public hasActiveFilters = linkedSignal(() =>
    this._hasActiveFilters(this.filterCustomerParameters())
  );

  private _getCustomers(request: CustomerParams): Observable<PaginatorInterface<Customer>> {
    const params = this._createRequest(request);
    return this._customerService.getAll(params);
  }

  private _createRequest(request: CustomerParams): HttpParams {
    return buildHttpParams(request, CUSTOMER_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: CustomerParams): boolean {
    const hasStringFilters = !!(params.name || params.page || params.pageSize);

    return hasStringFilters;
  }
}
