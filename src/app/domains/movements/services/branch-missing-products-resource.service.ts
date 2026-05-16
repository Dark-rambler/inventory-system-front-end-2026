import { HttpParams } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginatorInterface } from '@shared/interfaces/paginator.interface';
import { Product } from '@shared/interfaces/product.interface';
import { WarehouseService } from '@shared/services/warehouse.service';
import { buildHttpParams } from '@shared/utils/http-params';
import { catchError, map, Observable, of } from 'rxjs';

interface MissingProductsPagination {
  page: number;
  pageSize: number;
}

interface MissingProductsRequest extends MissingProductsPagination {
  branchId: string | null;
}

const DEFAULT_PAGINATION: MissingProductsPagination = {
  page: 1,
  pageSize: 10,
};

const MISSING_PRODUCTS_PARAMETER_MAPPING: Record<keyof MissingProductsPagination, string> = {
  page: 'page',
  pageSize: 'pageSize',
};

@Injectable()
export class BranchMissingProductsResourceService {
  private readonly _warehouseService = inject(WarehouseService);
  private readonly _currentBranchId = signal<string | null>(null);

  public readonly pagination = signal<MissingProductsPagination>(DEFAULT_PAGINATION);

  public readonly missingProductsResource = rxResource({
    request: () => {
      const branchId = this._currentBranchId();
      const pagination = this.pagination();
      return {
        branchId,
        page: pagination.page,
        pageSize: pagination.pageSize,
      };
    },
    loader: ({ request }) => {
      if (!request.branchId) {
        return of(this._buildEmptyPaginator(request.page, request.pageSize));
      }

      return this._getMissingProducts(request);
    },
  });

  public readonly missingProductsData = linkedSignal(
    () => this.missingProductsResource.value() ?? this._buildEmptyPaginator()
  );

  public readonly isLoading = this.missingProductsResource.isLoading;
  public readonly reload = () => this.missingProductsResource.reload();

  public setBranchId(branchId: string | null): void {
    this._currentBranchId.set(branchId);
    this.pagination.update(current => ({ ...current, page: 1 }));
  }

  private _getMissingProducts(
    request: MissingProductsRequest
  ): Observable<PaginatorInterface<Product>> {
    const params = this._createRequest(request);
    return this._warehouseService.getProductsNotInBranch(request.branchId!, params).pipe(
      map(response => this._normalizeResponse(response, request.page, request.pageSize)),
      catchError(() => of(this._buildEmptyPaginator(request.page, request.pageSize)))
    );
  }

  private _normalizeResponse(
    response: PaginatorInterface<Product> | Product[] | null | undefined,
    pageIndex: number,
    pageSize: number
  ): PaginatorInterface<Product> {
    if (Array.isArray(response)) {
      return {
        items: response,
        totalCount: response.length,
        pageIndex,
        pageSize,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      };
    }

    if (response && Array.isArray(response.items)) {
      return response;
    }

    const unknownResponse = response as
      | { data?: Product[]; totalCount?: number; totalPages?: number }
      | null
      | undefined;
    const items = unknownResponse?.data ?? [];

    return {
      items,
      totalCount: unknownResponse?.totalCount ?? items.length,
      pageIndex,
      pageSize,
      totalPages: unknownResponse?.totalPages ?? 1,
      hasPreviousPage: pageIndex > 1,
      hasNextPage: false,
    };
  }

  private _createRequest(request: MissingProductsPagination): HttpParams {
    return buildHttpParams(request, MISSING_PRODUCTS_PARAMETER_MAPPING);
  }

  private _buildEmptyPaginator(
    pageIndex = this.pagination().page,
    pageSize = this.pagination().pageSize
  ): PaginatorInterface<Product> {
    return {
      items: [],
      totalCount: 0,
      pageIndex,
      pageSize,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }
}
