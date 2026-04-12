import { HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, tap } from 'rxjs';
import { Inventory } from '../../../domains/inventory/interfaces/inventory.interface';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { InventoryService } from '../../../shared/services/inventory.service';
import { getSelectedBranchIdFromStorage } from '../../../shared/utils/selected-branch-storage';
import { PosProduct } from '../interfaces/pos.interface';

export interface PosProductParams {
  page: number;
  pageSize: number;
  search: string;
}

const EMPTY_PAGINATOR: PaginatorInterface<unknown> = {
  items: [],
  pageSize: 10,
  pageIndex: 1,
  totalCount: 0,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

@Injectable({
  providedIn: 'root',
})
export class ProductsPosService {
  private readonly _inventoryService = inject(InventoryService);
  private readonly _authService = inject(AuthService);

  readonly params = signal<PosProductParams>({ page: 1, pageSize: 10, search: '' });

  private readonly _productsResource = rxResource({
    request: () => ({
      params: this.params(),
      branchId: this._authService.selectedBranchId() ?? getSelectedBranchIdFromStorage(),
    }),
    loader: ({ request }) => {
      if (!request.branchId) {
        return of(EMPTY_PAGINATOR as PaginatorInterface<Inventory>);
      }

      const { params } = request;
      let httpParams = new HttpParams()
        .set('page', String(params.page))
        .set('pageSize', String(params.pageSize));
      if (params.search) {
        httpParams = httpParams.set('name', params.search);
      }
      return this._inventoryService.getByBranch(request.branchId, httpParams).pipe(
        tap(response => {
          if (response?.items?.length) {
            console.log('[POS] Primer item del API:', response.items[0]);
          }
        })
      );
    },
  });

  readonly isLoading = this._productsResource.isLoading;
  readonly hasError = computed(() => this._productsResource.error() !== undefined);

  readonly paginatorData = computed<PaginatorInterface<unknown>>(
    () => (this._productsResource.value() as PaginatorInterface<unknown>) ?? EMPTY_PAGINATOR
  );

  readonly products = linkedSignal<PosProduct[]>(() => {
    const items = this._productsResource.value()?.items ?? [];
    return items.map(item => this._mapToProduct(item));
  });

  readonly categories = computed(() => {
    const cats = new Set(this.products().map(p => p.categoryName));
    return ['all', ...cats];
  });

  setPage(page: number): void {
    this.params.update(p => ({ ...p, page }));
  }

  setSearch(search: string): void {
    this.params.update(p => ({ ...p, search, page: 1 }));
  }

  setPageSize(pageSize: number): void {
    this.params.update(p => ({ ...p, pageSize, page: 1 }));
  }

  filterProducts(products: PosProduct[], category: string): PosProduct[] {
    if (category === 'all') return products;
    return products.filter(p => p.categoryName === category);
  }

  reduceStock(productId: string, amount = 1): void {
    this.products.update(items =>
      items.map(p => (p.id === productId ? { ...p, stock: Math.max(0, p.stock - amount) } : p))
    );
  }

  restoreStock(productId: string, amount = 1): void {
    this.products.update(items =>
      items.map(p => (p.id === productId ? { ...p, stock: p.stock + amount } : p))
    );
  }

  private _mapToProduct(item: Inventory): PosProduct {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = item as any;
    const price =
      item.price ??
      raw.salePrice ??
      raw.unitPrice ??
      raw.product?.price ??
      raw.product?.salePrice ??
      0;

    const stock = item.stock ?? raw.quantity ?? raw.currentStock ?? raw.product?.stock ?? 0;

    return {
      id: item.id,
      name: item.name,
      code: item.code,
      price,
      stock,
      categoryId: item.category?.id ?? '',
      categoryName: item.category?.name ?? item.categoryName ?? '',
    };
  }
}
