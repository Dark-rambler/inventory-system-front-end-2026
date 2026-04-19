import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { User, UserForm } from '../interfaces/user.interface';
import { PaginatorInterface } from '../interfaces/paginator.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/user`;

  public getAll(params?: HttpParams): Observable<PaginatorInterface<User>> {
    return this._httpClient.get<PaginatorInterface<User>>(this._url, { params });
  }

  public create(user: UserForm): Observable<User> {
    return this._httpClient.post<User>(this._url, user);
  }

  public update(user: UserForm, id: string): Observable<User> {
    return this._httpClient.put<User>(`${this._url}/${id}`, user);
  }

  public delete(id: string): Observable<void> {
    return this._httpClient.delete<void>(`${this._url}/${id}`);
  }
}
