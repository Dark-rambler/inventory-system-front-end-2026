import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment.development';
import { Measure } from '../interfaces/measures.interface';

@Injectable({
  providedIn: 'root',
})
export class MeasureService {
  private readonly _url = `${environment.API_URL}/Measure`;
  private readonly _httpClient: HttpClient = inject(HttpClient);
  public getAll(): Observable<Measure[]> {
    return this._httpClient.get<Measure[]>(this._url);
  }
}
