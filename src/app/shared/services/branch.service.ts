import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { PaginatorInterface } from '../interfaces/paginator.interface';
import { Branch } from '../interfaces/branch.interface';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/branch`;

  public getAll(params?: HttpParams): Observable<PaginatorInterface<Branch>> {
    return this._httpClient.get<PaginatorInterface<Branch>>(this._url, { params });
  }

  public create(branch: Branch): Observable<Branch> {
    return this._httpClient.post<Branch>(this._url, branch);
  }

  public update(branch: Branch, id: string): Observable<Branch> {
    return this._httpClient.put<Branch>(`${this._url}/${id}`, branch);
  }

  public delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this._url}/${id}`);
  }
}
