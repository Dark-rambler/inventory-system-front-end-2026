import { inject, Injectable, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';
import { PaginatorInterface } from '../../../shared/interfaces/paginator.interface';
import {
  DEFAULT_RECENT_ACTIVITY_PARAMS,
  RecentActivityParams,
} from '../interfaces/recent-activity-params.interface';
import { RecentActivity } from '../interfaces/recent-activity.interface';
import { RecentActivityService } from './recent-activity.service';

@Injectable()
export class RecentActivityResourceService {
  private readonly _recentActivityService = inject(RecentActivityService);

  public filterRecentActivityParameters = signal<RecentActivityParams>(
    DEFAULT_RECENT_ACTIVITY_PARAMS
  );

  public readonly recentActivityResource = rxResource({
    request: () => this.filterRecentActivityParameters(),
    loader: ({ request }) => {
      if (!request) return of(null);
      return this._getRecentActivities(request);
    },
  });

  public recentActivityData = linkedSignal(() => this.recentActivityResource.value() ?? null);
  public isLoading = this.recentActivityResource.isLoading;
  public reloadRecentActivity = () => this.recentActivityResource.reload();

  private _getRecentActivities(
    request: RecentActivityParams
  ): Observable<PaginatorInterface<RecentActivity>> {
    return this._recentActivityService.getRecentActivities(
      request.page ?? 1,
      request.pageSize ?? 10
    );
  }
}
