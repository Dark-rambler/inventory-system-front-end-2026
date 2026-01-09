import { HttpParams } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { Product } from '../../../shared/interfaces/product.interface';
import { ProductService } from '../../../shared/services/product.service';
import { buildHttpParams } from '../../../shared/utils/http-params';
import { DEFAULT_GET_PRODUCT_PARAMS } from '../constants/default-product-params.constants';
import { PRODUCT_PARAMETER_MAPPING } from '../constants/product-mapping.constant';
import { ProductParams } from '../interfaces/product-params.interface';

@Injectable()
export class ProductResourceService {
  private readonly _productService: ProductService = inject(ProductService);

  public filterProductParameters = signal<ProductParams>(DEFAULT_GET_PRODUCT_PARAMS);

  public readonly productResource = rxResource({
    request: () => {
      const filters = this.filterProductParameters();
      return filters;
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getProduct(request);
    },
  });

  public productData = linkedSignal(() => this.productResource.value() ?? null);
  public isLoading = this.productResource.isLoading;
  public reloadProduct = () => this.productResource.reload();

  public isEmpty = linkedSignal(() => this.productData());

  public hasActiveFilters = linkedSignal(() =>
    this._hasActiveFilters(this.filterProductParameters())
  );

  private _getProduct(request: ProductParams): Observable<PaginatorInterface<Product>> {
    const params = this._createRequest(request);
    return this._productService.getAll(params);
  }

  private _createRequest(request: ProductParams): HttpParams {
    return buildHttpParams(request, PRODUCT_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: ProductParams): boolean {
    const hasStringFilters = !!(params.name || params.page || params.pageSize);

    return hasStringFilters;
  }
}
