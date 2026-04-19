import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SaleRequest } from '@app/domains/pos/interfaces/pos.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Branch, BranchForm } from '../interfaces/branch.interface';
import { PaginatorInterface } from '../interfaces/paginator.interface';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/branch`;

  public getAll(params?: HttpParams): Observable<PaginatorInterface<Branch>> {
    return this._httpClient.get<PaginatorInterface<Branch>>(this._url, { params });
  }

  public create(branch: BranchForm): Observable<Branch> {
    return this._httpClient.post<Branch>(this._url, branch);
  }

  public update(branch: BranchForm, id: string): Observable<Branch> {
    return this._httpClient.put<Branch>(`${this._url}/${id}`, branch);
  }

  public getById(id: string): Observable<Branch> {
    return this._httpClient.get<Branch>(`${this._url}/${id}`);
  }

  public delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this._url}/${id}`);
  }

  public processSale(branchId: string, body: SaleRequest): Observable<unknown> {
    return this._httpClient.post<unknown>(`${this._url}/${branchId}/sales`, body);
  }

  public getSalesByBranch(branchId: string, params?: HttpParams): Observable<unknown> {
    return this._httpClient.get<unknown>(`${this._url}/${branchId}/sales`, { params });
  }
}
