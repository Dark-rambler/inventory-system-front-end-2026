import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PaginatorInterface } from '../interfaces/paginator.interface';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/Product`;

  public getAll(params?: HttpParams): Observable<PaginatorInterface<Product>> {
    return this._httpClient.get<PaginatorInterface<Product>>(this._url, { params });
  }
}
