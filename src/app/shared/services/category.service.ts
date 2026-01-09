import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Category } from '../interfaces/category.interface';
import { PaginatorInterface } from '../interfaces/paginator.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/category`;

  public getAll(params?: HttpParams): Observable<PaginatorInterface<Category>> {
    return this._httpClient.get<PaginatorInterface<Category>>(this._url, { params });
  }

  public create(category: Category): Observable<Category> {
    return this._httpClient.post<Category>(this._url, category);
  }

  public update(category: Category, id: string): Observable<Category> {
    return this._httpClient.put<Category>(`${this._url}/${id}`, category);
  }
}
