import { HttpParams } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Movement } from '@app/domains/movements/interfaces/movement.interface';
import { PaginatorInterface } from '@shared/interfaces/paginator.interface';
import { InventoryMovementService } from '@shared/services/inventory-movement.service';
import { WarehouseService } from '@shared/services/warehouse.service';
import { buildHttpParams } from '@shared/utils/http-params';
import { catchError, map, Observable, of } from 'rxjs';
import { WarehouseBranchMovement } from '../interfaces/warehouse-branch-movement.interface';
import { WarehouseBranchProduct } from '../interfaces/warehouse-branch-product.interface';

interface WarehouseTablePagination {
  page: number;
  pageSize: number;
}

interface WarehouseMovementParams {
  warehouseId: string | null;
  page: number;
  pageSize: number;
}

interface WarehouseProductParams {
  page: number;
  pageSize: number;
}

interface WarehouseMissingProductParams {
  warehouseId: string | null;
  page: number;
  pageSize: number;
}

const DEFAULT_PAGINATION: WarehouseTablePagination = {
  page: 1,
  pageSize: 10,
};

const WAREHOUSE_MOVEMENT_PARAMETER_MAPPING: Record<keyof WarehouseMovementParams, string> = {
  warehouseId: 'branchId',
  page: 'page',
  pageSize: 'pageSize',
};

const WAREHOUSE_PRODUCT_PARAMETER_MAPPING: Record<keyof WarehouseProductParams, string> = {
  page: 'page',
  pageSize: 'pageSize',
};

@Injectable()
export class WarehouseBranchDetailResourceService {
  private readonly _inventoryMovementService = inject(InventoryMovementService);
  private readonly _warehouseService = inject(WarehouseService);
  private readonly _currentWarehouseId = signal<string | null>(null);

  public readonly productPagination = signal<WarehouseTablePagination>(DEFAULT_PAGINATION);
  public readonly movementPagination = signal<WarehouseTablePagination>(DEFAULT_PAGINATION);
  public readonly missingProductPagination = signal<WarehouseTablePagination>(DEFAULT_PAGINATION);

  public readonly productsResource = rxResource({
    request: () => {
      const warehouseId = this._currentWarehouseId();
      const pagination = this.productPagination();
      return { warehouseId, page: pagination.page, pageSize: pagination.pageSize };
    },
    loader: ({ request }) => {
      if (!request.warehouseId) return of(null);
      return this._getProducts(request.warehouseId, request.page, request.pageSize);
    },
  });

  public readonly movementsResource = rxResource({
    request: () => {
      const warehouseId = this._currentWarehouseId();
      const pagination = this.movementPagination();
      return { warehouseId, page: pagination.page, pageSize: pagination.pageSize };
    },
    loader: ({ request }) => {
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getMovements(request);
    },
  });

  public readonly missingProductsResource = rxResource({
    request: () => {
      const warehouseId = this._currentWarehouseId();
      const pagination = this.missingProductPagination();
      return { warehouseId, page: pagination.page, pageSize: pagination.pageSize };
    },
    loader: ({ request }) => {
      if (!request.warehouseId) {
        return of(this._buildEmptyMissingProductsPaginator(request.page, request.pageSize));
      }

      return this._getMissingProducts(request);
    },
  });

  public readonly productsData = linkedSignal(
    () => this.productsResource.value() ?? this._buildEmptyProductsPaginator()
  );

  public readonly movementsData = linkedSignal(
    () => this.movementsResource.value() ?? this._buildEmptyMovementsPaginator()
  );

  public readonly missingProductsData = linkedSignal(
    () => this.missingProductsResource.value() ?? this._buildEmptyMissingProductsPaginator()
  );

  public readonly isLoadingProducts = this.productsResource.isLoading;
  public readonly isLoadingMovements = this.movementsResource.isLoading;
  public readonly isLoadingMissingProducts = this.missingProductsResource.isLoading;
  public readonly reloadProducts = () => this.productsResource.reload();
  public readonly reloadMovements = () => this.movementsResource.reload();
  public readonly reloadMissingProducts = () => this.missingProductsResource.reload();

  public readonly isEmpty = linkedSignal(() => this.movementsData());

  public readonly hasActiveFilters = linkedSignal(() =>
    this._hasActiveFilters({
      warehouseId: this._currentWarehouseId(),
      ...this.movementPagination(),
    })
  );

  public readonly tabCounts = linkedSignal(() => ({
    products: this.productsData().totalCount,
    movements: this.movementsData().totalCount,
  }));

  public setWarehouseId(warehouseId: string | null): void {
    this._currentWarehouseId.set(warehouseId);
    this.productPagination.set({ ...DEFAULT_PAGINATION });
    this.movementPagination.set({ ...DEFAULT_PAGINATION });
    this.missingProductPagination.set({ ...DEFAULT_PAGINATION });
  }

  private _getProducts(
    warehouseId: string,
    page: number,
    pageSize: number
  ): Observable<PaginatorInterface<WarehouseBranchProduct>> {
    const params = buildHttpParams({ page, pageSize }, WAREHOUSE_PRODUCT_PARAMETER_MAPPING);
    return this._warehouseService.getProductsByWarehouse(warehouseId, params).pipe(
      map(response => response as unknown as PaginatorInterface<WarehouseBranchProduct>),
      catchError(() => of(this._buildEmptyProductsPaginator(page, pageSize)))
    );
  }

  private _getMovements(
    request: WarehouseMovementParams
  ): Observable<PaginatorInterface<WarehouseBranchMovement>> {
    const params = this._createRequest(request);
    return this._inventoryMovementService.getAll(params).pipe(
      map(response => ({
        ...response,
        items: (response.items ?? []).map(item => this._mapMovement(item)),
      })),
      catchError(() => of(this._buildEmptyMovementsPaginator(request.page, request.pageSize)))
    );
  }

  private _getMissingProducts(
    request: WarehouseMissingProductParams
  ): Observable<PaginatorInterface<WarehouseBranchProduct>> {
    const params = buildHttpParams(
      { page: request.page, pageSize: request.pageSize },
      WAREHOUSE_PRODUCT_PARAMETER_MAPPING
    );

    return this._warehouseService.getProductsNotInWarehouse(request.warehouseId!, params).pipe(
      map(response => response as unknown as PaginatorInterface<WarehouseBranchProduct>),
      catchError(() => of(this._buildEmptyMissingProductsPaginator(request.page, request.pageSize)))
    );
  }

  private _createRequest(request: WarehouseMovementParams): HttpParams {
    return buildHttpParams(request, WAREHOUSE_MOVEMENT_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: WarehouseMovementParams): boolean {
    return !!(params.warehouseId && params.page && params.pageSize);
  }

  private _mapMovement(movement: Movement): WarehouseBranchMovement {
    return {
      id: movement.id,
      movementType: movement.movementType,
      productName: movement.productName,
      quantity: movement.quantity,
      previousStock: movement.previousStock,
      currentStock: movement.currentStock,
      movementDate: movement.createdAt,
    };
  }

  private _buildEmptyProductsPaginator(
    pageIndex = this.productPagination().page,
    pageSize = this.productPagination().pageSize
  ): PaginatorInterface<WarehouseBranchProduct> {
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

  private _buildEmptyMovementsPaginator(
    pageIndex = this.movementPagination().page,
    pageSize = this.movementPagination().pageSize
  ): PaginatorInterface<WarehouseBranchMovement> {
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

  private _buildEmptyMissingProductsPaginator(
    pageIndex = this.missingProductPagination().page,
    pageSize = this.missingProductPagination().pageSize
  ): PaginatorInterface<WarehouseBranchProduct> {
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
