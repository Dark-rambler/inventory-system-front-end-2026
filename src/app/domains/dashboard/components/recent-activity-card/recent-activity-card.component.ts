import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';
import { PaginatorComponent } from '../../../../shared/components/table';
import { PaginatorInterface } from '../../../../shared/interfaces/paginator.interface';
import { RecentActivity } from '../../interfaces/recent-activity.interface';
import { RecentActivityService } from '../../services/recent-activity.service';
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
  templateUrl: './recent-activity-card.component.html',
})
export class RecentActivityCardComponent implements OnInit {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _recentActivityService = inject(RecentActivityService);

  private readonly _currentPage = signal(1);
  private readonly _currentPageSize = signal(10);
  private readonly _isLoading = signal(false);
  private readonly _paginatorData = signal<PaginatorInterface<RecentActivity> | null>(null);

  public currentPage = this._currentPage.asReadonly();
  public currentPageSize = this._currentPageSize.asReadonly();
  public isLoading = this._isLoading.asReadonly();

  protected skeletonRows = computed(() =>
    Array.from({ length: this._currentPageSize() }, (_, index) => index)
  );

  protected activities = computed(() => this._paginatorData()?.items ?? []);

  protected paginatorData = computed<PaginatorInterface<RecentActivity>>(() => {
    return (
      this._paginatorData() ?? {
        items: [],
        pageSize: this._currentPageSize(),
        pageIndex: this._currentPage(),
        totalCount: 0,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      }
    );
  });

  public ngOnInit(): void {
    this._loadPage();
  }

  protected changePage(page: number): void {
    this._currentPage.set(page);
    this._loadPage();
  }

  protected changePageSize(pageSize: number): void {
    this._currentPageSize.set(pageSize);
    this._currentPage.set(1);
    this._loadPage();
  }

  private _loadPage(): void {
    this._isLoading.set(true);

    this._recentActivityService
      .getRecentActivities(this._currentPage(), this._currentPageSize())
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe(data => {
        this._paginatorData.set(data);
      });
  }
}
