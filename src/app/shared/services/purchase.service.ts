import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PaginatorInterface } from '../interfaces/paginator.interface';
import { Purchase, PurchaseDetail } from '../interfaces/purchase.interface';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private readonly _http = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/Purchase`;

  public getAll(params?: HttpParams): Observable<PaginatorInterface<Purchase>> {
    return this._http
      .get<PaginatorInterface<Purchase>>(this._url, { params })
      .pipe(map(response => this._normalizePaginator(response)));
  }

  public create(purchase: Partial<Purchase>): Observable<Purchase> {
    const payload = this._normalizePurchasePayload(purchase);
    return this._http
      .post<Purchase>(this._url, payload)
      .pipe(map(item => this._normalizePurchase(item)));
  }

  public update(purchase: Partial<Purchase>, id: string | number): Observable<Purchase> {
    const payload = this._normalizePurchasePayload(purchase);
    return this._http
      .put<Purchase>(`${this._url}/${id}`, payload)
      .pipe(map(item => this._normalizePurchase(item)));
  }

  public delete(id: string | number): Observable<void> {
    return this._http.delete<void>(`${this._url}/${id}`);
  }

  private _normalizePaginator(
    response: PaginatorInterface<Purchase>
  ): PaginatorInterface<Purchase> {
    return {
      ...response,
      items: (response.items ?? []).map(item => this._normalizePurchase(item)),
    };
  }

  private _normalizePurchase(item: Purchase): Purchase {
    const purchaseDetails = Array.isArray(item.purchaseDetails) ? item.purchaseDetails : [];

    const itemsCount = purchaseDetails.reduce(
      (acc: number, detail: PurchaseDetail) => acc + Number(detail.quantity ?? 0),
      0
    );

    return {
      ...item,
      id: String(item.id ?? ''),
      provider: String(item.provider ?? ''),
      branch: String(item.branch ?? ''),
      buyer: String(item.buyer ?? ''),
      date: String(item.date ?? ''),
      total: Number(item.total ?? 0),
      purchaseDetails,

      // Compatibility for existing modal/edit flows.
      supplierName: String(item.provider ?? ''),
      expectedDate: String(item.date ?? '').slice(0, 10),
      items: itemsCount,
    };
  }

  private _normalizePurchasePayload(purchase: Partial<Purchase>): Partial<Purchase> {
    const purchaseDetails = Array.isArray(purchase.purchaseDetails)
      ? purchase.purchaseDetails.map(detail => ({
          ...detail,
          productId: this._toIntegerOrKeep(detail.productId),
          quantity: Number(detail.quantity ?? 0),
          price: Number(detail.price ?? 0),
        }))
      : purchase.purchaseDetails;

    return {
      ...purchase,
      purchaseDetails,
    };
  }

  private _toIntegerOrKeep(value: unknown): string | number | undefined {
    const parsedValue = Number(value);
    if (!Number.isInteger(parsedValue) || parsedValue < 1) {
      if (value === null || value === undefined) {
        return undefined;
      }

      return String(value);
    }

    return parsedValue;
  }
}
