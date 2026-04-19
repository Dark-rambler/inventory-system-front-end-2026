import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { PaginatorComponent } from '../../../../shared/components/table';
import { PaginatorInterface } from '../../../../shared/interfaces/paginator.interface';
import { RecentActivity } from '../../interfaces/recent-activity.interface';
import { RecentActivityResourceService } from '../../services/recent-activity-resource.service';
import { RecentActivityItemComponent } from '../recent-activity-item/recent-activity-item.component';
import { RecentActivitySkeletonComponent } from '../recent-activity-skeleton/recent-activity-skeleton.component';

@Component({
  selector: 'app-recent-activity-card',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorComponent,
    RecentActivityItemComponent,
    RecentActivitySkeletonComponent,
  ],
  providers: [RecentActivityResourceService],
  templateUrl: './recent-activity-card.component.html',
})
export class RecentActivityCardComponent {
  private readonly _recentActivityResourceService = inject(RecentActivityResourceService);

  public currentPage = computed(
    () => this._recentActivityResourceService.filterRecentActivityParameters().page ?? 1
  );
  public currentPageSize = computed(
    () => this._recentActivityResourceService.filterRecentActivityParameters().pageSize ?? 10
  );
  public isLoading = this._recentActivityResourceService.isLoading;

  protected skeletonRows = computed(() =>
    Array.from({ length: this.currentPageSize() }, (_, index) => index)
  );

  protected activities = computed(
    () => this._recentActivityResourceService.recentActivityData()?.items ?? []
  );

  protected paginatorData = computed<PaginatorInterface<RecentActivity>>(() => {
    return (
      this._recentActivityResourceService.recentActivityData() ?? {
        items: [],
        pageSize: this.currentPageSize(),
        pageIndex: this.currentPage(),
        totalCount: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      }
    );
  });

  protected changePage(page: number): void {
    this._recentActivityResourceService.filterRecentActivityParameters.update(params => ({
      ...params,
      page,
    }));
  }

  protected changePageSize(pageSize: number): void {
    this._recentActivityResourceService.filterRecentActivityParameters.update(params => ({
      ...params,
      page: 1,
      pageSize,
    }));
  }
}
