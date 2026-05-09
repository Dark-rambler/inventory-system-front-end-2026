import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PaginatorInterface } from '../interfaces/paginator.interface';
import { Supplier } from '../interfaces/supplier.interface';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly _http = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/Provider`;

  public getAll(params?: HttpParams): Observable<PaginatorInterface<Supplier>> {
    return this._http.get<PaginatorInterface<Supplier>>(this._url, { params });
  }

  public create(supplier: Partial<Supplier>): Observable<Supplier> {
    return this._http.post<Supplier>(this._url, supplier);
  }

  public update(supplier: Partial<Supplier>, id: string | number): Observable<Supplier> {
    return this._http.put<Supplier>(`${this._url}/${id}`, supplier);
  }

  public delete(id: string | number): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);
  }
}
