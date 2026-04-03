import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { PaginatorInterface } from '../interfaces/paginator.interface';
import { Warehouse } from '../interfaces/warehouse.interface';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/warehouse`;

  public getAll(params?: HttpParams): Observable<PaginatorInterface<Warehouse>> {
    return this._httpClient.get<PaginatorInterface<Warehouse>>(this._url, { params });
  }

  public create(warehouse: Warehouse): Observable<Warehouse> {
    return this._httpClient.post<Warehouse>(this._url, warehouse);
  }

  public update(warehouse: Warehouse, id: string): Observable<Warehouse> {
    return this._httpClient.put<Warehouse>(`${this._url}/${id}`, warehouse);
  }

  public delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this._url}/${id}`);
  }
}
