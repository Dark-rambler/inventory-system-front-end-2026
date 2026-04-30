import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PaginatorInterface } from '../interfaces/paginator.interface';
import { Purchase, PurchaseStatus } from '../interfaces/purchase.interface';

const PURCHASE_STATUSES: PurchaseStatus[] = ['Borrador', 'Emitida', 'Recibida', 'Anulada'];

const SUPPLIER_NAME_BY_ID: Record<number, string> = {
  1: 'Distribuidora Andina S.R.L.',
  2: 'Alimentos del Valle',
  3: 'Insumos Norte',
  4: 'Comercial Oriente',
  5: 'Packaging Bolivia',
  6: 'Tecno Frio Industrial',
  7: 'Lacteos del Sur',
  8: 'Proveedor Central',
  9: 'Soluciones Retail S.A.',
  10: 'Global Supplies BO',
};

const MOCK_PURCHASES: Purchase[] = [
  {
    id: 1,
    folio: 'CMP-00001',
    supplierId: 1,
    supplierName: 'Distribuidora Andina S.R.L.',
    status: 'Recibida',
    paymentMethod: 'Credito 30 dias',
    items: 24,
    total: 12450,
    expectedDate: '2026-04-08',
    notes: 'Reposicion de productos de alta rotacion.',
    createdAt: '2026-04-05T09:15:00.000Z',
    updatedAt: '2026-04-08T16:40:00.000Z',
  },
  {
    id: 2,
    folio: 'CMP-00002',
    supplierId: 3,
    supplierName: 'Insumos Norte',
    status: 'Emitida',
    paymentMethod: 'Transferencia bancaria',
    items: 15,
    total: 8950,
    expectedDate: '2026-04-18',
    notes: 'Compra para sucursal central.',
    createdAt: '2026-04-12T11:22:00.000Z',
    updatedAt: '2026-04-12T11:22:00.000Z',
  },
  {
    id: 3,
    folio: 'CMP-00003',
    supplierId: 2,
    supplierName: 'Alimentos del Valle',
    status: 'Borrador',
    paymentMethod: 'Contado',
    items: 10,
    total: 4130,
    expectedDate: '2026-04-27',
    notes: 'Pendiente validacion de precios.',
    createdAt: '2026-04-20T08:05:00.000Z',
    updatedAt: '2026-04-20T08:05:00.000Z',
  },
  {
    id: 4,
    folio: 'CMP-00004',
    supplierId: 8,
    supplierName: 'Proveedor Central',
    status: 'Anulada',
    paymentMethod: 'Credito 15 dias',
    items: 6,
    total: 2190,
    expectedDate: '2026-04-11',
    notes: 'Orden cancelada por falta de stock.',
    createdAt: '2026-04-09T14:30:00.000Z',
    updatedAt: '2026-04-10T09:12:00.000Z',
  },
  {
    id: 5,
    folio: 'CMP-00005',
    supplierId: 5,
    supplierName: 'Packaging Bolivia',
    status: 'Recibida',
    paymentMethod: 'Transferencia bancaria',
    items: 18,
    total: 6720,
    expectedDate: '2026-04-06',
    notes: 'Empaques para campaña de temporada.',
    createdAt: '2026-04-02T10:10:00.000Z',
    updatedAt: '2026-04-06T15:48:00.000Z',
  },
  {
    id: 6,
    folio: 'CMP-00006',
    supplierId: 9,
    supplierName: 'Soluciones Retail S.A.',
    status: 'Emitida',
    paymentMethod: 'Credito 30 dias',
    items: 12,
    total: 9580,
    expectedDate: '2026-04-30',
    notes: 'Incluye terminales y accesorios POS.',
    createdAt: '2026-04-24T12:40:00.000Z',
    updatedAt: '2026-04-24T12:40:00.000Z',
  },
];

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private _purchases: Purchase[] = [...MOCK_PURCHASES];
  private _nextId = this._purchases.length + 1;

  public getAll(params?: HttpParams): Observable<PaginatorInterface<Purchase>> {
    const folioFilter = (params?.get('folio') ?? '').trim().toLowerCase();
    const supplierFilter = (params?.get('supplierName') ?? '').trim().toLowerCase();
    const statusFilter = (params?.get('status') ?? '').trim().toLowerCase();

    const page = this._toPositiveInt(params?.get('page'), 1);
    const pageSize = this._toPositiveInt(params?.get('pageSize'), 10);

    const filteredPurchases = this._purchases
      .filter(purchase => {
        const byFolio = !folioFilter || purchase.folio.toLowerCase().includes(folioFilter);
        const bySupplier =
          !supplierFilter || purchase.supplierName.toLowerCase().includes(supplierFilter);
        const byStatus = !statusFilter || purchase.status.toLowerCase() === statusFilter;

        return byFolio && bySupplier && byStatus;
      })
      .sort((left, right) => right.id - left.id);

    const totalCount = filteredPurchases.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    const items = filteredPurchases.slice(start, start + pageSize);

    return of({
      items,
      pageIndex: safePage,
      pageSize,
      totalCount,
      totalPages,
      hasPreviousPage: safePage > 1,
      hasNextPage: safePage < totalPages,
    }).pipe(delay(280));
  }

  public create(purchase: Partial<Purchase>): Observable<Purchase> {
    const now = new Date().toISOString();
    const supplierId = this._toPositiveInt(purchase.supplierId, 0);

    const createdPurchase: Purchase = {
      id: this._nextId,
      folio: this._normalizeText(purchase.folio) || `CMP-${String(this._nextId).padStart(5, '0')}`,
      supplierId,
      supplierName: this._resolveSupplierName(
        supplierId,
        this._normalizeText(purchase.supplierName)
      ),
      status: this._normalizeStatus(purchase.status),
      paymentMethod: this._normalizeText(purchase.paymentMethod) || 'Credito 30 dias',
      items: Math.max(1, this._toSafeNumber(purchase.items, 1)),
      total: Math.max(0, this._toSafeNumber(purchase.total, 0)),
      expectedDate: this._normalizeDateOnly(purchase.expectedDate),
      notes: this._normalizeText(purchase.notes),
      createdAt: now,
      updatedAt: now,
    };

    this._nextId += 1;
    this._purchases = [createdPurchase, ...this._purchases];

    return of(createdPurchase).pipe(delay(220));
  }

  public update(purchase: Partial<Purchase>, id: string | number): Observable<Purchase> {
    const purchaseId = Number(id);
    const purchaseIndex = this._purchases.findIndex(item => item.id === purchaseId);

    if (purchaseIndex < 0) {
      return throwError(() => ({ message: 'No se encontro la compra.' }));
    }

    const currentPurchase = this._purchases[purchaseIndex];
    const supplierId = this._toPositiveInt(purchase.supplierId, currentPurchase.supplierId);

    const updatedPurchase: Purchase = {
      ...currentPurchase,
      folio: this._normalizeText(purchase.folio) || currentPurchase.folio,
      supplierId,
      supplierName: this._resolveSupplierName(
        supplierId,
        this._normalizeText(purchase.supplierName) || currentPurchase.supplierName
      ),
      status: this._normalizeStatus(purchase.status, currentPurchase.status),
      paymentMethod: this._normalizeText(purchase.paymentMethod) || currentPurchase.paymentMethod,
      items: Math.max(1, this._toSafeNumber(purchase.items, currentPurchase.items)),
      total: Math.max(0, this._toSafeNumber(purchase.total, currentPurchase.total)),
      expectedDate: this._normalizeDateOnly(purchase.expectedDate) || currentPurchase.expectedDate,
      notes: this._normalizeText(purchase.notes) || currentPurchase.notes,
      updatedAt: new Date().toISOString(),
    };

    this._purchases = this._purchases.map(item =>
      item.id === purchaseId ? updatedPurchase : item
    );

    return of(updatedPurchase).pipe(delay(220));
  }

  public delete(id: string | number): Observable<void> {
    const purchaseId = Number(id);
    const existsPurchase = this._purchases.some(item => item.id === purchaseId);

    if (!existsPurchase) {
      return throwError(() => ({ message: 'No se encontro la compra.' }));
    }

    this._purchases = this._purchases.filter(item => item.id !== purchaseId);
    return of(void 0).pipe(delay(180));
  }

  private _toPositiveInt(value: unknown, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
  }

  private _toSafeNumber(value: unknown, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private _normalizeText(value: unknown): string {
    return String(value ?? '').trim();
  }

  private _normalizeDateOnly(value: unknown): string {
    const rawValue = this._normalizeText(value);
    if (!rawValue) {
      return new Date().toISOString().slice(0, 10);
    }

    return rawValue.slice(0, 10);
  }

  private _normalizeStatus(value: unknown, fallback: PurchaseStatus = 'Emitida'): PurchaseStatus {
    const rawStatus = this._normalizeText(value);
    const matchedStatus = PURCHASE_STATUSES.find(status => status === rawStatus);
    return matchedStatus ?? fallback;
  }

  private _resolveSupplierName(supplierId: number, fallbackName: string): string {
    return (SUPPLIER_NAME_BY_ID[supplierId] ?? fallbackName) || 'Proveedor sin registrar';
  }
}
