import { HttpParams } from '@angular/common/http';
import { Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { buildHttpParams } from '../../../shared/utils/http-params';
import { SALES_PARAMETER_MAPPING } from '../constants/sales.constants';
import { Sale } from '../interfaces/sale.interface';
import { DEFAULT_SALES_PARAMS, SalesParams } from '../interfaces/sales-params.interface';

const MOCK_SALES: Sale[] = [
  {
    id: 1,
    folio: 'Venta-001',
    date: '2026-04-10',
    customerName: 'Juan Pérez',
    branchName: 'Sucursal Central',
    warehouseName: 'Almacén Principal',
    total: 1500.0,
    status: 'completed',
    paymentMethod: 'Efectivo',
    items: 5,
  },
  {
    id: 2,
    folio: 'Venta-002',
    date: '2026-04-11',
    customerName: 'María García',
    branchName: 'Sucursal Norte',
    warehouseName: 'Almacén Norte',
    total: 2300.5,
    status: 'completed',
    paymentMethod: 'Tarjeta Débito',
    items: 8,
  },
  {
    id: 3,
    folio: 'Venta-003',
    date: '2026-04-11',
    customerName: 'Carlos López',
    branchName: 'Sucursal Central',
    warehouseName: 'Almacén Principal',
    total: 750.25,
    status: 'pending',
    paymentMethod: 'Transferencia',
    items: 3,
  },
  {
    id: 4,
    folio: 'Venta-004',
    date: '2026-04-12',
    customerName: 'Ana Martínez',
    branchName: 'Sucursal Sur',
    warehouseName: 'Almacén Sur',
    total: 4200.0,
    status: 'completed',
    paymentMethod: 'Tarjeta Crédito',
    items: 12,
  },
  {
    id: 5,
    folio: 'Venta-005',
    date: '2026-04-12',
    customerName: 'Roberto Sánchez',
    branchName: 'Sucursal Norte',
    warehouseName: 'Almacén Norte',
    total: 950.0,
    status: 'cancelled',
    paymentMethod: 'Efectivo',
    items: 2,
  },
  {
    id: 6,
    folio: 'Venta-006',
    date: '2026-04-13',
    customerName: 'Laura Torres',
    branchName: 'Sucursal Central',
    warehouseName: 'Almacén Principal',
    total: 3100.75,
    status: 'completed',
    paymentMethod: 'Tarjeta Débito',
    items: 7,
  },
  {
    id: 7,
    folio: 'Venta-007',
    date: '2026-04-13',
    customerName: 'Miguel Hernández',
    branchName: 'Sucursal Sur',
    warehouseName: 'Almacén Sur',
    total: 1800.0,
    status: 'completed',
    paymentMethod: 'Efectivo',
    items: 4,
  },
  {
    id: 8,
    folio: 'Venta-008',
    date: '2026-04-14',
    customerName: 'Sofia Rodríguez',
    branchName: 'Sucursal Este',
    warehouseName: 'Almacén Este',
    total: 5600.0,
    status: 'completed',
    paymentMethod: 'Transferencia',
    items: 15,
  },
  {
    id: 9,
    folio: 'Venta-009',
    date: '2026-04-14',
    customerName: 'David González',
    branchName: 'Sucursal Central',
    warehouseName: 'Almacén Principal',
    total: 2200.5,
    status: 'pending',
    paymentMethod: 'Tarjeta Crédito',
    items: 6,
  },
  {
    id: 10,
    folio: 'Venta-010',
    date: '2026-04-15',
    customerName: 'Elena Fernández',
    branchName: 'Sucursal Oeste',
    warehouseName: 'Almacén Oeste',
    total: 890.25,
    status: 'completed',
    paymentMethod: 'Efectivo',
    items: 3,
  },
];

@Injectable()
export class SalesResourceService {
  public filterSalesParameters = signal<SalesParams>(DEFAULT_SALES_PARAMS);

  public readonly salesResource = rxResource({
    request: () => {
      const filters = this.filterSalesParameters();
      return filters;
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

  private _getSales(request: SalesParams): Observable<PaginatorInterface<Sale>> {
    const pageSize = request.pageSize ?? 10;
    const pageIndex = request.page ?? 1;
    const totalCount = MOCK_SALES.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const mockResponse: PaginatorInterface<Sale> = {
      items: MOCK_SALES,
      totalCount,
      pageIndex,
      pageSize,
      totalPages,
      hasPreviousPage: pageIndex > 1,
      hasNextPage: pageIndex < totalPages,
    };

    return of(mockResponse).pipe(delay(500));
  }

  private _createRequest(request: SalesParams): HttpParams {
    return buildHttpParams(request, SALES_PARAMETER_MAPPING);
  }

  private _hasActiveFilters(params: SalesParams): boolean {
    const hasStringFilters = !!(
      params.folio ||
      params.customerName ||
      params.branchName ||
      params.status ||
      params.startDate ||
      params.endDate ||
      params.page ||
      params.pageSize
    );

    return hasStringFilters;
  }
}
