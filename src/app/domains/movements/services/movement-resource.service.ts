import { HttpParams } from '@angular/common/http';
import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { InventoryMovementService } from '../../../shared/services/inventory-movement.service';
import { buildHttpParams } from '../../../shared/utils/http-params';
import { DEFAULT_GET_MOVEMENT_PARAMS } from '../constants/default-movement-params.constants';
import { CreateMovementRequest } from '../interfaces/create-movement-request.interface';
import { MOVEMENT_PARAMETER_MAPPING } from '../constants/movement-mapping.constant';
import { MovementParams } from '../interfaces/movement-params.interface';
import { Movement } from '../interfaces/movement.interface';

@Injectable()
export class MovementResourceService {
  private readonly _inventoryMovementService = inject(InventoryMovementService);
  private readonly _useMockData = true;

  private readonly _mockMovements: Movement[] = [
    {
      id: 'mov-001',
      branchId: '1',
      movementType: 'Entrada',
      productName: 'Coca Cola 2L',
      branchName: 'Sucursal Centro',
      warehouseName: 'Principal',
      quantity: 24,
      previousStock: 80,
      currentStock: 104,
      createdAt: '2026-04-10 09:15',
      notes: 'Reposicion semanal',
    },
    {
      id: 'mov-002',
      branchId: '1',
      movementType: 'Salida',
      productName: 'Arroz 1kg',
      branchName: 'Sucursal Centro',
      warehouseName: 'Principal',
      quantity: 10,
      previousStock: 45,
      currentStock: 35,
      createdAt: '2026-04-11 13:40',
      notes: 'Ajuste por venta',
    },
    {
      id: 'mov-003',
      branchId: '2',
      movementType: 'Entrada',
      productName: 'Leche Entera 1L',
      branchName: 'Sucursal Norte',
      warehouseName: 'Bodega 2',
      quantity: 30,
      previousStock: 18,
      currentStock: 48,
      createdAt: '2026-04-12 08:25',
    },
    {
      id: 'mov-004',
      branchId: '2',
      movementType: 'Salida',
      productName: 'Azucar 1kg',
      branchName: 'Sucursal Norte',
      warehouseName: 'Bodega 2',
      quantity: 8,
      previousStock: 23,
      currentStock: 15,
      createdAt: '2026-04-12 16:05',
    },
    {
      id: 'mov-005',
      branchId: '3',
      movementType: 'Entrada',
      productName: 'Fideo Spaghetti 500g',
      branchName: 'Sucursal Sur',
      warehouseName: 'Seco',
      quantity: 40,
      previousStock: 12,
      currentStock: 52,
      createdAt: '2026-04-13 10:10',
    },
  ];

  private readonly _currentBranchId = signal<string | null>(null);

  public filterMovementParameters = signal<MovementParams>(DEFAULT_GET_MOVEMENT_PARAMS);

  public isUsingMockData(): boolean {
    return this._useMockData;
  }

  public setBranchId(branchId: string | null): void {
    this._currentBranchId.set(branchId);
  }

  public appendMockMovement(payload: CreateMovementRequest): void {
    if (!this._useMockData) return;

    const branchId = payload.fromBranchId ?? payload.toBranchId ?? 'mock-branch';
    const branchLabel = payload.fromBranchId ?? payload.toBranchId ?? 'mock-branch';
    const warehouseLabel = payload.fromWarehouseId ?? payload.toWarehouseId ?? 'mock-wh';

    const createdMovement: Movement = {
      id: `mov-${Date.now()}`,
      branchId,
      movementType:
        payload.type === 2 ? 'Transferencia' : payload.type === 0 ? 'Salida' : 'Entrada',
      productName: `Producto ${payload.productId.slice(0, 8)}`,
      branchName: `Sucursal ${branchLabel.slice(0, 8)}`,
      warehouseName: `Bodega ${warehouseLabel.slice(0, 6)}`,
      quantity: payload.quantity,
      previousStock: 0,
      currentStock: payload.quantity,
      createdAt: new Date().toISOString(),
      notes: 'Movimiento creado desde vista dinamica',
    };

    this._mockMovements.unshift(createdMovement);
  }

  public readonly movementResource = rxResource({
    request: () => {
      const filters = this.filterMovementParameters();
      return {
        ...filters,
        branchId: this._currentBranchId() ?? filters.branchId,
      };
    },
    loader: ({ request }) => {
      if (!request) return of(null);
      if (!this._hasActiveFilters(request)) return of(null);
      return this._getMovements(request);
    },
  });

  public movementData = linkedSignal(() => this.movementResource.value() ?? null);
  public isLoading = this.movementResource.isLoading;
  public reloadMovement = () => this.movementResource.reload();

  public hasActiveFilters = linkedSignal(() =>
    this._hasActiveFilters(this.filterMovementParameters())
  );

  private _getMovements(request: MovementParams): Observable<PaginatorInterface<Movement>> {
    if (this._useMockData) {
      return of(this._getMockMovements(request));
    }

    const params = this._createRequest(request);
    return this._inventoryMovementService.getAll(params);
  }

  private _getMockMovements(request: MovementParams): PaginatorInterface<Movement> {
    const pageIndex = request.page ?? 1;
    const pageSize = request.pageSize ?? 10;

    let mockSource = this._mockMovements;
    if (request.branchId && !mockSource.some(item => item.branchId === request.branchId)) {
      mockSource = this._buildBranchMockMovements(request.branchId);
    }

    const filteredItems = mockSource.filter(item => {
      const branchMatches = !request.branchId || item.branchId === request.branchId;
      const typeMatches =
        !request.movementType ||
        item.movementType.toLowerCase().includes(request.movementType.toLowerCase());
      const productMatches =
        !request.productName ||
        item.productName.toLowerCase().includes(request.productName.toLowerCase());
      const branchNameMatches =
        !request.branchName ||
        item.branchName.toLowerCase().includes(request.branchName.toLowerCase());

      return branchMatches && typeMatches && productMatches && branchNameMatches;
    });

    const totalCount = filteredItems.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const start = (pageIndex - 1) * pageSize;
    const end = start + pageSize;
    const items = filteredItems.slice(start, end);

    return {
      items,
      pageIndex,
      pageSize,
      totalCount,
      totalPages,
      hasPreviousPage: pageIndex > 1,
      hasNextPage: pageIndex < totalPages,
    };
  }

  private _buildBranchMockMovements(branchId: string): Movement[] {
    return [
      {
        id: `mov-${branchId}-001`,
        branchId,
        movementType: 'Entrada',
        productName: 'Aceite Vegetal 1L',
        branchName: `Sucursal ${branchId}`,
        warehouseName: 'Principal',
        quantity: 18,
        previousStock: 22,
        currentStock: 40,
        createdAt: '2026-04-14 09:00',
        notes: 'Ingreso por reposicion',
      },
      {
        id: `mov-${branchId}-002`,
        branchId,
        movementType: 'Salida',
        productName: 'Harina 1kg',
        branchName: `Sucursal ${branchId}`,
        warehouseName: 'Principal',
        quantity: 6,
        previousStock: 31,
        currentStock: 25,
        createdAt: '2026-04-14 11:35',
        notes: 'Salida por venta',
      },
      {
        id: `mov-${branchId}-003`,
        branchId,
        movementType: 'Entrada',
        productName: 'Cafe Molido 250g',
        branchName: `Sucursal ${branchId}`,
        warehouseName: 'Seco',
        quantity: 14,
        previousStock: 9,
        currentStock: 23,
        createdAt: '2026-04-14 15:10',
      },
    ];
  }

  private _createRequest(request: MovementParams): HttpParams {
    return buildHttpParams(request, MOVEMENT_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: MovementParams): boolean {
    const hasStringFilters = !!(
      params.branchId ||
      params.movementType ||
      params.productName ||
      params.branchName ||
      params.startDate ||
      params.endDate ||
      params.page ||
      params.pageSize
    );

    return hasStringFilters;
  }
}
