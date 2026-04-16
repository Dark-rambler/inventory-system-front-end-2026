import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CreateMovementRequest } from '../../domains/movements/interfaces/create-movement-request.interface';
import { Movement } from '../../domains/movements/interfaces/movement.interface';
import { PaginatorInterface } from '../interfaces/paginator.interface';

@Injectable({
  providedIn: 'root',
})
export class InventoryMovementService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/InventoryMovement`;

  public getAll(params?: HttpParams): Observable<PaginatorInterface<Movement>> {
    return this._httpClient.get<PaginatorInterface<Movement>>(this._url, { params });
  }

  public create(body: CreateMovementRequest): Observable<void> {
    return this._httpClient.post<void>(this._url, body);
  }
}
