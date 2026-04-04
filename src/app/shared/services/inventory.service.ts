import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Inventory } from '../../domains/inventory/interfaces/inventory.interface';
import { PaginatorInterface } from '../interfaces/paginator.interface';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/inventory`;

  public getAll(params?: HttpParams): Observable<PaginatorInterface<Inventory>> {
    return this._httpClient.get<PaginatorInterface<Inventory>>(this._url, { params });
  }

  public getByBranch(
    branchId: string,
    params?: HttpParams
  ): Observable<PaginatorInterface<Inventory>> {
    return this._httpClient.get<PaginatorInterface<Inventory>>(
      `${environment.API_URL}/branch/${branchId}/products`,
      { params }
    );
  }

  public create(inventory: Inventory): Observable<Inventory> {
    return this._httpClient.post<Inventory>(this._url, inventory);
  }

  public update(inventory: Inventory, id: string): Observable<Inventory> {
    return this._httpClient.put<Inventory>(`${this._url}/${id}`, inventory);
  }

  public delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this._url}/${id}`);
  }
}
