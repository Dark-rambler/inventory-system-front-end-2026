import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Customer } from '../interfaces/customer.interface';
import { Observable } from 'rxjs';
import { PaginatorInterface } from '../interfaces/paginator.interface';
import { environment } from '@env/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly _url = `${environment.API_URL}/Customer`;
  private readonly _httpClient: HttpClient = inject(HttpClient);

  public getAll(params?: HttpParams): Observable<PaginatorInterface<Customer>> {
    return this._httpClient.get<PaginatorInterface<Customer>>(this._url, { params });
  }

  public create(customer: Partial<Customer>): Observable<Customer> {
    return this._httpClient.post<Customer>(this._url, customer);
  }

  public update(customer: Partial<Customer>, id: string | number): Observable<Customer> {
    return this._httpClient.put<Customer>(`${this._url}/${id}`, customer);
  }

  public delete(id: string | number): Observable<void> {
    return this._httpClient.delete<void>(`${this._url}/${id}`);
  }
}
