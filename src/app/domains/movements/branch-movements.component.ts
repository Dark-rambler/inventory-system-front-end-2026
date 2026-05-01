import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TabPanelDirective, TabsComponent } from '@shared/components/tabs';
import { BranchService } from '@shared/services/branch.service';
import { InventoryFiltersComponent } from '../inventory/components/inventory-filters/inventory-filters.component';
import { InventoryTableComponent } from '../inventory/components/inventory-table';
import { InventoryResourceService } from '../inventory/services/inventory-resource.service';
import { catchError, map, of } from 'rxjs';
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
export class BranchMovementsComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _branchService = inject(BranchService);

  private readonly _branchId = toSignal(
    this._route.paramMap.pipe(map(params => params.get('branchId'))),
    { initialValue: null }
  );
  protected readonly branchId = this._branchId;
  protected readonly branchName = signal<string | null>(null);

  ngOnInit(): void {
    this._branchService
      .getById(this._branchId()!)
      .pipe(catchError(() => of(null)))
      .subscribe(branch => this.branchName.set(branch?.name ?? null));
  }
}
