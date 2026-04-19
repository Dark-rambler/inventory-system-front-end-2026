import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import { RECENT_ACTIVITY_MOCK } from '../constants/recent-activity.mock';
import { RecentActivity } from '../interfaces/recent-activity.interface';

@Injectable({
  providedIn: 'root',
})
export class RecentActivityService {
  private readonly _activities = [...RECENT_ACTIVITY_MOCK].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );

  public getRecentActivities(
    page: number,
    pageSize: number
  ): Observable<PaginatorInterface<RecentActivity>> {
    return of(this._paginateItems(this._activities, page, pageSize)).pipe(delay(500));
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
