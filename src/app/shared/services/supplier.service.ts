import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PaginatorInterface } from '../interfaces/paginator.interface';
import { Supplier } from '../interfaces/supplier.interface';

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 1,
    name: 'Distribuidora Andina S.R.L.',
    contactName: 'Mariela Gomez',
    email: 'mariela.gomez@andina.bo',
    phone: '+591 70123456',
    city: 'La Paz',
    createdAt: '2026-04-23T04:04:05.56421Z',
    updatedAt: '2026-04-23T10:14:12.132Z',
  },
  {
    id: 2,
    name: 'Alimentos del Valle',
    contactName: 'Carlos Peña',
    email: 'carlos.pena@delvalle.com',
    phone: '+591 72111234',
    city: 'Cochabamba',
    createdAt: '2026-03-18T15:22:40.400Z',
    updatedAt: '2026-04-20T08:10:00.000Z',
  },
  {
    id: 3,
    name: 'Insumos Norte',
    contactName: 'Rocio Flores',
    email: 'rocio.flores@insumosnorte.com',
    phone: '+591 73345678',
    city: 'Santa Cruz',
    createdAt: '2026-01-25T11:30:00.000Z',
    updatedAt: '2026-04-18T17:45:00.000Z',
  },
  {
    id: 4,
    name: 'Comercial Oriente',
    contactName: 'Diego Arce',
    email: 'diego.arce@oriente.com',
    phone: '+591 76543210',
    city: 'Santa Cruz',
    createdAt: '2025-12-10T09:00:00.000Z',
    updatedAt: '2026-04-10T12:00:00.000Z',
  },
  {
    id: 5,
    name: 'Packaging Bolivia',
    contactName: 'Lucia Rivera',
    email: 'lucia.rivera@packbo.com',
    phone: '+591 71234567',
    city: 'La Paz',
    createdAt: '2026-02-12T13:15:25.120Z',
    updatedAt: '2026-04-05T09:30:15.000Z',
  },
  {
    id: 6,
    name: 'Tecno Frio Industrial',
    contactName: 'Alfredo Paredes',
    email: 'alfredo.paredes@tecnofrio.io',
    phone: '+591 78890011',
    city: 'El Alto',
    createdAt: '2026-01-05T07:45:00.000Z',
    updatedAt: '2026-04-12T14:18:00.000Z',
  },
  {
    id: 7,
    name: 'Lacteos del Sur',
    contactName: 'Noelia Rojas',
    email: 'noelia.rojas@lacteos-sur.com',
    phone: '+591 74566789',
    city: 'Tarija',
    createdAt: '2025-11-22T18:20:00.000Z',
    updatedAt: '2026-04-02T08:45:00.000Z',
  },
  {
    id: 8,
    name: 'Proveedor Central',
    contactName: 'Jorge Molina',
    email: 'jorge.molina@provcentral.bo',
    phone: '+591 70011223',
    city: 'Sucre',
    createdAt: '2026-04-01T16:12:45.450Z',
    updatedAt: '2026-04-21T11:05:30.300Z',
  },
  {
    id: 9,
    name: 'Soluciones Retail S.A.',
    contactName: 'Andrea Paz',
    email: 'andrea.paz@retailsol.com',
    phone: '+591 70999887',
    city: 'Cochabamba',
    createdAt: '2026-02-28T10:10:10.010Z',
    updatedAt: '2026-04-19T10:10:10.010Z',
  },
  {
    id: 10,
    name: 'Global Supplies BO',
    contactName: 'Felipe Borda',
    email: 'felipe.borda@globalsup.bo',
    phone: '+591 72223344',
    city: 'La Paz',
    createdAt: '2025-10-15T12:00:00.000Z',
    updatedAt: '2026-03-29T13:25:10.000Z',
  },
  {
    id: 11,
    name: 'Agroinsumos Bolivia',
    contactName: 'Marta Cespedes',
    email: 'marta.cespedes@agroinsumos.bo',
    phone: '+591 76667788',
    city: 'Santa Cruz',
    createdAt: '2026-01-30T08:40:20.000Z',
    updatedAt: '2026-04-17T15:00:00.000Z',
  },
  {
    id: 12,
    name: 'Mercado Mayorista Uno',
    contactName: 'Patricia Menacho',
    email: 'patricia.menacho@mayoristauno.com',
    phone: '+591 73441122',
    city: 'Oruro',
    createdAt: '2026-03-02T06:20:00.000Z',
    updatedAt: '2026-04-09T19:30:00.000Z',
  },
];

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private _suppliers: Supplier[] = [...MOCK_SUPPLIERS];
  private _nextId = this._suppliers.length + 1;

  public getAll(params?: HttpParams): Observable<PaginatorInterface<Supplier>> {
    const nameFilter = (params?.get('name') ?? '').trim().toLowerCase();
    const emailFilter = (params?.get('email') ?? '').trim().toLowerCase();
    const phoneFilter = (params?.get('phone') ?? '').trim().toLowerCase();

    const page = this._toPositiveInt(params?.get('page'), 1);
    const pageSize = this._toPositiveInt(params?.get('pageSize'), 10);

    const filteredSuppliers = this._suppliers
      .filter(supplier => {
        const byName = !nameFilter || supplier.name.toLowerCase().includes(nameFilter);
        const byEmail = !emailFilter || supplier.email.toLowerCase().includes(emailFilter);
        const byPhone = !phoneFilter || supplier.phone.toLowerCase().includes(phoneFilter);

        return byName && byEmail && byPhone;
      })
      .sort((left, right) => right.id - left.id);

    const totalCount = filteredSuppliers.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    const items = filteredSuppliers.slice(start, start + pageSize);

    return of({
      items,
      pageIndex: safePage,
      pageSize,
      totalCount,
      totalPages,
      hasPreviousPage: safePage > 1,
      hasNextPage: safePage < totalPages,
    }).pipe(delay(260));
  }

  public create(supplier: Partial<Supplier>): Observable<Supplier> {
    const now = new Date().toISOString();
    const createdSupplier: Supplier = {
      id: this._nextId,
      name: (supplier.name ?? '').trim(),
      contactName: (supplier.contactName ?? '').trim(),
      email: (supplier.email ?? '').trim(),
      phone: (supplier.phone ?? '').trim(),
      city: (supplier.city ?? '').trim(),
      createdAt: now,
      updatedAt: now,
    };

    this._nextId += 1;
    this._suppliers = [createdSupplier, ...this._suppliers];

    return of(createdSupplier).pipe(delay(200));
  }

  public update(supplier: Partial<Supplier>, id: string | number): Observable<Supplier> {
    const supplierId = Number(id);
    const supplierIndex = this._suppliers.findIndex(item => item.id === supplierId);

    if (supplierIndex < 0) {
      return throwError(() => ({ message: 'No se encontró el proveedor.' }));
    }

    const currentSupplier = this._suppliers[supplierIndex];
    const updatedSupplier: Supplier = {
      ...currentSupplier,
      name: (supplier.name ?? currentSupplier.name).trim(),
      contactName: (supplier.contactName ?? currentSupplier.contactName).trim(),
      email: (supplier.email ?? currentSupplier.email).trim(),
      phone: (supplier.phone ?? currentSupplier.phone).trim(),
      city: (supplier.city ?? currentSupplier.city).trim(),
      updatedAt: new Date().toISOString(),
    };

    this._suppliers = this._suppliers.map(item =>
      item.id === supplierId ? updatedSupplier : item
    );

    return of(updatedSupplier).pipe(delay(200));
  }

  public delete(id: string | number): Observable<void> {
    const supplierId = Number(id);
    const existsSupplier = this._suppliers.some(item => item.id === supplierId);

    if (!existsSupplier) {
      return throwError(() => ({ message: 'No se encontró el proveedor.' }));
    }

    this._suppliers = this._suppliers.filter(item => item.id !== supplierId);
    return of(void 0).pipe(delay(180));
  }

  private _toPositiveInt(value: string | null | undefined, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
  }
}
