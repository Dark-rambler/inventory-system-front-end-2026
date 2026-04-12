import { HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { Inventory } from '../../../domains/inventory/interfaces/inventory.interface';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { InventoryService } from '../../../shared/services/inventory.service';
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

  // TODO: replace with dynamic branch selection signal
  private readonly _branchId = '441b0b0d-90f4-43cd-a769-c58a3a7173db';

  readonly params = signal<PosProductParams>({ page: 1, pageSize: 10, search: '' });

  private readonly _productsResource = rxResource({
    request: () => this.params(),
    loader: ({ request }) => {
      let httpParams = new HttpParams()
        .set('page', String(request.page))
        .set('pageSize', String(request.pageSize));
      if (request.search) {
        httpParams = httpParams.set('name', request.search);
      }
      return this._inventoryService.getByBranch(this._branchId, httpParams).pipe(
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
