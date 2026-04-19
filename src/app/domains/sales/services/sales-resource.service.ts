import { HttpParams } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { BranchService } from '@shared/services/branch.service';
import { getSelectedBranchIdFromStorage } from '@shared/utils/selected-branch-storage';
import { catchError, map, Observable, of } from 'rxjs';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { buildHttpParams } from '../../../shared/utils/http-params';
import { SALES_PARAMETER_MAPPING } from '../constants/sales.constants';
import { BranchSaleApi, BranchSaleDetailApi } from '../interfaces/sale-api.interface';
import { Sale } from '../interfaces/sale.interface';
import { DEFAULT_SALES_PARAMS, SalesParams } from '../interfaces/sales-params.interface';

@Injectable()
export class SalesResourceService {
  private readonly _branchService = inject(BranchService);
  private readonly _currentBranchId = signal<string | null>(getSelectedBranchIdFromStorage());
  private readonly _allowStorageFallback = signal<boolean>(true);

  public filterSalesParameters = signal<SalesParams>(DEFAULT_SALES_PARAMS);

  public setBranchId(
    branchId: string | null,
    options?: { disableStorageFallback?: boolean }
  ): void {
    if (options?.disableStorageFallback) {
      this._allowStorageFallback.set(false);
    }

    this._currentBranchId.set(branchId);
  }

  public readonly salesResource = rxResource({
    request: () => {
      const filters = this.filterSalesParameters();
      return {
        ...filters,
        branchId: this._currentBranchId(),
      };
    },
    loader: ({ request }) => {
      return this._getSales(request);
    },
  });

  public salesData = linkedSignal(() => this.salesResource.value() ?? null);
  public isLoading = this.salesResource.isLoading;
  public reloadSales = () => this.salesResource.reload();

  public isEmpty = linkedSignal(() => this.salesData());

  public hasActiveFilters = linkedSignal(() =>
    this._hasActiveFilters(this.filterSalesParameters())
  );

  private _getSales(
    request: SalesParams & { branchId?: string | null }
  ): Observable<PaginatorInterface<Sale>> {
    const fallbackBranchId = this._allowStorageFallback() ? getSelectedBranchIdFromStorage() : null;
    const branchId = request.branchId ?? fallbackBranchId;
    if (!branchId) {
      return of(this._buildEmptyPaginator(request));
    }

    const params = this._createRequest(request);

    return this._branchService.getSalesByBranch(branchId, params).pipe(
      map(response => this._normalizeResponse(response, request, branchId)),
      catchError(() => of(this._buildEmptyPaginator(request)))
    );
  }

  private _createRequest(request: SalesParams): HttpParams {
    return buildHttpParams(request, SALES_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: SalesParams): boolean {
    const hasStringFilters = !!(
      params.folio ||
      params.customerName ||
      params.status ||
      params.fromDate ||
      params.toDate ||
      params.page ||
      params.pageSize
    );

    return hasStringFilters;
  }

  private _normalizeResponse(
    response: unknown,
    request: SalesParams,
    branchId: string
  ): PaginatorInterface<Sale> {
    const pageIndex = request.page ?? 1;
    const pageSize = request.pageSize ?? 10;

    if (this._isPaginatorResponse(response)) {
      const items = response.items.map(item => this._mapApiSale(item, branchId));
      const totalCount = this._toSafeNumber(response.totalCount, items.length);
      const totalPages = Math.max(1, this._toSafeNumber(response.totalPages, 1));

      return {
        items,
        pageIndex: this._toSafeNumber(response.pageIndex, pageIndex),
        pageSize: this._toSafeNumber(response.pageSize, pageSize),
        totalCount,
        totalPages,
        hasPreviousPage: Boolean(response.hasPreviousPage),
        hasNextPage: Boolean(response.hasNextPage),
      };
    }

    const rawItems = this._extractItems(response);
    const mappedItems = rawItems.map(item => this._mapApiSale(item, branchId));

    const totalCount = mappedItems.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const start = (pageIndex - 1) * pageSize;
    const end = start + pageSize;

    return {
      items: mappedItems.slice(start, end),
      totalCount,
      pageIndex,
      pageSize,
      totalPages,
      hasPreviousPage: pageIndex > 1,
      hasNextPage: pageIndex < totalPages,
    };
  }

  private _mapApiSale(item: unknown, branchId: string): Sale {
    const sale = this._toRecord(item) as Partial<BranchSaleApi> & Record<string, unknown>;
    const details = this._extractSaleDetails(sale);
    const id = String(this._readNested(sale, ['id', 'saleId', 'folio']) ?? `${Date.now()}`);

    return {
      id,
      date: String(this._readNested(sale, ['date', 'createdAt', 'saleDate']) ?? ''),
      sellerName: String(this._readNested(sale, ['seller', 'sellerName', 'user.name']) ?? '-'),
      branchName: String(
        this._readNested(sale, ['branch', 'branchName', 'branch.name']) ?? `Sucursal ${branchId}`
      ),
      productsSummary: this._buildProductsSummary(details),
      total: this._toSafeNumber(this._readNested(sale, ['total', 'totalAmount', 'amount']), 0),
      items:
        this._toSafeNumber(this._readNested(sale, ['items', 'itemCount']), 0) || details.length,
    };
  }

  private _extractSaleDetails(
    sale: Partial<BranchSaleApi> & Record<string, unknown>
  ): BranchSaleDetailApi[] {
    const rawDetails = this._readNested(sale, ['saleDetails', 'details']);
    if (!Array.isArray(rawDetails)) {
      return [];
    }

    return rawDetails.map(detail => {
      const record = this._toRecord(detail);
      return {
        id: this._toSafeNumber(record['id'], 0),
        quantity: this._toSafeNumber(record['quantity'], 0),
        price: this._toSafeNumber(record['price'], 0),
        product: String(record['product'] ?? record['name'] ?? '-'),
      };
    });
  }

  private _buildProductsSummary(details: BranchSaleDetailApi[]): string {
    if (!details.length) {
      return '-';
    }

    const products = details.map(detail => detail.product).filter(Boolean);
    const visibleProducts = products.slice(0, 2);
    const extraCount = products.length - visibleProducts.length;
    return extraCount > 0
      ? `${visibleProducts.join(', ')} +${extraCount}`
      : visibleProducts.join(', ');
  }

  private _extractItems(response: unknown): unknown[] {
    if (Array.isArray(response)) return response;

    const record = this._toRecord(response);
    const candidates = [record['items'], record['data'], record['results'], record['sales']];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }

    return [];
  }

  private _buildEmptyPaginator(request: SalesParams): PaginatorInterface<Sale> {
    const pageIndex = request.page ?? 1;
    const pageSize = request.pageSize ?? 10;

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

  private _isPaginatorResponse(
    value: unknown
  ): value is PaginatorInterface<Record<string, unknown>> {
    const record = this._toRecord(value);
    return (
      Array.isArray(record['items']) &&
      record['pageIndex'] !== undefined &&
      record['pageSize'] !== undefined
    );
  }

  private _toRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object') return {};
    return value as Record<string, unknown>;
  }

  private _readNested(source: Record<string, unknown>, keys: string[]): unknown {
    for (const key of keys) {
      const path = key.split('.');
      let current: unknown = source;

      for (const token of path) {
        if (token === 'length' && Array.isArray(current)) {
          current = current.length;
          continue;
        }

        if (!current || typeof current !== 'object') {
          current = undefined;
          break;
        }

        current = (current as Record<string, unknown>)[token];
      }

      if (current !== undefined && current !== null && current !== '') {
        return current;
      }
    }

    return undefined;
  }

  private _toSafeNumber(value: unknown, fallback: number): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  }
}
