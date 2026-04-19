import { Component, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BranchService } from '@shared/services/branch.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { SalesFiltersComponent } from '../sales/components/sales-filters/sales-filters.component';
import { SalesTableComponent } from '../sales/components/sales-table/sales-table.component';
import { SalesResourceService } from '../sales/services/sales-resource.service';
import { MovementsHeaderComponent } from './components/movements-header/movements-header.component';

@Component({
  selector: 'app-branch-movements',
  standalone: true,
  imports: [MovementsHeaderComponent, SalesFiltersComponent, SalesTableComponent],
  providers: [SalesResourceService],
  templateUrl: './branch-movements.component.html',
})
export class BranchMovementsComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _branchService = inject(BranchService);
  private readonly _salesResourceService = inject(SalesResourceService);

  private readonly _branchId = toSignal(
    this._route.paramMap.pipe(map(params => params.get('branchId'))),
    { initialValue: null }
  );

  protected readonly branchId = this._branchId;
  protected readonly branchName = signal<string | null>(null);

  constructor() {
    effect(() => {
      const branchId = this._branchId();
      this._salesResourceService.setBranchId(branchId, { disableStorageFallback: true });
    });

    this._route.paramMap
      .pipe(
        map(params => params.get('branchId')),
        switchMap(branchId => {
          if (!branchId) {
            return of(null);
          }

          return this._branchService.getById(branchId).pipe(catchError(() => of(null)));
        }),
        takeUntilDestroyed()
      )
      .subscribe(branch => {
        this.branchName.set(branch?.name ?? null);
      });
  }
}
