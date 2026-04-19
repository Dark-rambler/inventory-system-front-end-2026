import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment.development';
import { catchError, map, Observable, of } from 'rxjs';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { RECENT_ACTIVITY_MOCK } from '../constants/recent-activity.mock';
import { RecentActivity } from '../interfaces/recent-activity.interface';

@Injectable({
  providedIn: 'root',
})
export class RecentActivityService {
  private readonly _httpClient = inject(HttpClient);
  private readonly _url = `${environment.API_URL}/AuditHistory`;

  private readonly _activities = [...RECENT_ACTIVITY_MOCK].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );

  public getRecentActivities(
    page: number,
    pageSize: number
  ): Observable<PaginatorInterface<RecentActivity>> {
    const params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));

    return this._httpClient.get<unknown>(this._url, { params }).pipe(
      map(response => this._normalizeResponse(response, page, pageSize)),
      catchError(() => of(this._paginateItems(this._activities, page, pageSize)))
    );
  }

  private _normalizeResponse(
    response: unknown,
    page: number,
    pageSize: number
  ): PaginatorInterface<RecentActivity> {
    const safePageSize = Math.max(1, pageSize);

    if (this._isPaginatorResponse(response)) {
      const mappedItems = response.items.map((item, index) =>
        this._mapAuditItem(item, this._toSafeNumber(response.pageIndex, page), index)
      );

      return {
        items: mappedItems,
        pageIndex: this._toSafeNumber(response.pageIndex, page),
        pageSize: this._toSafeNumber(response.pageSize, safePageSize),
        totalCount: this._toSafeNumber(response.totalCount, mappedItems.length),
        totalPages: Math.max(1, this._toSafeNumber(response.totalPages, 1)),
        hasPreviousPage: Boolean(response.hasPreviousPage),
        hasNextPage: Boolean(response.hasNextPage),
      };
    }

    const rawItems = this._extractItems(response);
    const mappedItems = rawItems.map((item, index) => this._mapAuditItem(item, page, index));

    return this._paginateItems(mappedItems, page, safePageSize);
  }

  private _mapAuditItem(item: unknown, page: number, index: number): RecentActivity {
    const record = this._toRecord(item);
    const fallbackId = (Math.max(1, page) - 1) * 1000 + index + 1;

    return {
      id: this._toSafeNumber(this._readNested(record, ['id', 'auditId']), fallbackId),
      user: String(this._readNested(record, ['user', 'userName', 'createdBy']) ?? 'Sistema'),
      action: String(this._readNested(record, ['action', 'event', 'operation']) ?? 'Acción'),
      entity: String(this._readNested(record, ['entity', 'module', 'resource']) ?? 'General'),
      createdAt: String(
        this._readNested(record, ['createdAt', 'date', 'timestamp', 'createdDate']) ??
          new Date().toISOString()
      ),
    };
  }

  private _extractItems(response: unknown): unknown[] {
    if (Array.isArray(response)) {
      return response;
    }

    const record = this._toRecord(response);
    const candidates = [record['items'], record['data'], record['results'], record['auditHistory']];

    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }

    return [];
  }

  private _isPaginatorResponse(
    value: unknown
  ): value is PaginatorInterface<Record<string, unknown>> {
    const record = this._toRecord(value);
    return (
      Array.isArray(record['items']) &&
      record['pageIndex'] !== undefined &&
      record['pageSize'] !== undefined
    );
  }

  private _toRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object') {
      return {};
    }

    return value as Record<string, unknown>;
  }

  private _readNested(source: Record<string, unknown>, keys: string[]): unknown {
    for (const key of keys) {
      const path = key.split('.');
      let current: unknown = source;

      for (const token of path) {
        if (!current || typeof current !== 'object') {
          current = undefined;
          break;
        }

        current = (current as Record<string, unknown>)[token];
      }

      if (current !== undefined && current !== null && current !== '') {
        return current;
      }
    }

    return undefined;
  }

  private _toSafeNumber(value: unknown, fallback: number): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  private _paginateItems(
    items: RecentActivity[],
    page: number,
    pageSize: number
  ): PaginatorInterface<RecentActivity> {
    const safePageSize = Math.max(1, pageSize);
    const totalCount = items.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * safePageSize;

    return {
      items: items.slice(start, start + safePageSize),
      pageIndex: safePage,
      pageSize: safePageSize,
      totalCount,
      totalPages,
      hasPreviousPage: safePage > 1,
      hasNextPage: safePage < totalPages,
    };
  }
}
