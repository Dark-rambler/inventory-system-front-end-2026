import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment.development';
import { Business } from '../interfaces/business.interface';
import { PaginatorInterface } from '../interfaces/paginator.interface';

@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  private readonly _url = `${environment.API_URL}/Business`;
  private readonly _httpClient: HttpClient = inject(HttpClient);

  public getAll(params?: HttpParams): Observable<PaginatorInterface<Business>> {
    return this._httpClient.get<PaginatorInterface<Business>>(this._url, { params });
  }

  public create(business: Partial<Business>): Observable<Business> {
    return this._httpClient.post<Business>(this._url, business);
  }

  public update(business: Partial<Business>, id: string | number): Observable<Business> {
    return this._httpClient.put<Business>(`${this._url}/${id}`, business);
  }

  public delete(id: string | number): Observable<void> {
    return this._httpClient.delete<void>(`${this._url}/${id}`);
  }
}
