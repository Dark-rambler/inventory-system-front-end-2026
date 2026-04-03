import { NgClass } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { PaginatorInterface } from '../../../../interfaces/paginator.interface';

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [NgClass],
  templateUrl: './paginator.component.html',
})
export class PaginatorComponent {
  public paginator = input.required<PaginatorInterface<unknown>>();
  public currentPage = input<number>(1);
  public currentPageSize = input<number>(10);
  public pageChange = output<number>();
  public pageSizeChange = output<number>();

  protected readonly pageSizeOptions = PAGE_SIZE_OPTIONS;

  protected startItem = computed(() => (this.currentPage() - 1) * this.currentPageSize() + 1);

  protected endItem = computed(() =>
    Math.min(this.currentPage() * this.currentPageSize(), this.paginator().totalCount)
  );

  protected isPrevDisabled = computed(() => this.currentPage() <= 1);
  protected isNextDisabled = computed(() => this.currentPage() >= this.paginator().totalPages);

  protected pages = computed<number[]>(() => {
    const current = this.currentPage();
    const totalPages = this.paginator().totalPages;
    const delta = 2;
    const start = Math.max(1, current - delta);
    const end = Math.min(totalPages, current + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  protected showFirst = computed(() => this.pages()[0] > 1);
  protected showFirstEllipsis = computed(() => this.pages()[0] > 2);
  protected showLast = computed(() => {
    const pages = this.pages();
    return pages[pages.length - 1] < this.paginator().totalPages;
  });
  protected showLastEllipsis = computed(() => {
    const pages = this.pages();
    return pages[pages.length - 1] < this.paginator().totalPages - 1;
  });

  protected goToPage(page: number): void {
    const totalPages = this.paginator().totalPages;
    if (page < 1 || page > totalPages || page === this.currentPage()) return;
    this.pageChange.emit(page);
  }

  protected onPageSizeChange(event: Event): void {
    const size = Number((event.target as HTMLSelectElement).value);
    if (size !== this.currentPageSize()) {
      this.pageSizeChange.emit(size);
    }
  }
}
