import { Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TabPanelDirective, TabsComponent } from '@shared/components/tabs';
import { BranchService } from '@shared/services/branch.service';
import { InventoryFiltersComponent } from '../inventory/components/inventory-filters/inventory-filters.component';
import { InventoryTableComponent } from '../inventory/components/inventory-table';
import { InventoryResourceService } from '../inventory/services/inventory-resource.service';
import { catchError, map, of, switchMap } from 'rxjs';
import { MovementsFiltersComponent } from './components/movements-filters/movements-filters.component';
import { MovementResourceService } from './services/movement-resource.service';
import { SalesFiltersComponent } from '../sales/components/sales-filters/sales-filters.component';
import { SalesTableComponent } from '../sales/components/sales-table/sales-table.component';
import { SalesResourceService } from '../sales/services/sales-resource.service';
import { MovementsHeaderComponent } from './components/movements-header/movements-header.component';
import { CreateBranchMovementComponent } from './components/movements-header/create-branch-movement/create-branch-movement.component';

@Component({
  selector: 'app-branch-movements',
  standalone: true,
  imports: [
    MovementsHeaderComponent,
    TabsComponent,
    TabPanelDirective,
    SalesFiltersComponent,
    SalesTableComponent,
    MovementsFiltersComponent,
    InventoryFiltersComponent,
    InventoryTableComponent,
    CreateBranchMovementComponent,
  ],
  providers: [SalesResourceService, MovementResourceService, InventoryResourceService],
  templateUrl: './branch-movements.component.html',
})
export class BranchMovementsComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _branchService = inject(BranchService);
  private readonly _salesResourceService = inject(SalesResourceService);
  private readonly _movementResourceService = inject(MovementResourceService);
  private readonly _inventoryResourceService = inject(InventoryResourceService);

  private readonly _branchId = toSignal(
    this._route.paramMap.pipe(map(params => params.get('branchId'))),
    { initialValue: null }
  );

  protected readonly branchId = this._branchId;
  protected readonly branchName = signal<string | null>(null);
  protected readonly tabCounts = computed(() => {
    const sales = this._salesResourceService.salesData()?.items ?? [];
    const movements = this._movementResourceService.movementData()?.items ?? [];
    const products = this._inventoryResourceService.inventoryData()?.items ?? [];

    return {
      sales: sales.length,
      movements: movements.length,
      products: products.length,
    };
  });

  constructor() {
    effect(() => {
      const branchId = this._branchId();
      this._salesResourceService.setBranchId(branchId, { disableStorageFallback: true });
      this._movementResourceService.setBranchId(branchId);
      this._inventoryResourceService.setBranchId(branchId, { disableStorageFallback: true });
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
