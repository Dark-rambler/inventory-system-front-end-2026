import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Role } from '../interfaces/role.interface';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/roles`;

  public getAll(params?: HttpParams): Observable<Role[]> {
    return this._httpClient.get<Role[]>(this._url, { params });
  }

  public create(role: Role): Observable<Role> {
    return this._httpClient.post<Role>(this._url, role);
  }

  public update(role: Role, id: string): Observable<Role> {
    return this._httpClient.put<Role>(`${this._url}/${id}`, role);
  }

  public delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this._url}/${id}`);
  }
}
