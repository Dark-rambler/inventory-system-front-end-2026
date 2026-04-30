import { Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '@shared/components/button';
import { TabPanelDirective, TabsComponent } from '@shared/components/tabs';
import { map } from 'rxjs';
import { WarehouseBranchMovementsTableComponent } from './components/warehouse-branch-movements-table/warehouse-branch-movements-table.component';
import { WarehouseBranchProductsTableComponent } from './components/warehouse-branch-products-table/warehouse-branch-products-table.component';
import { WarehouseBranchDetailResourceService } from './services/warehouse-branch-detail-resource.service';

@Component({
  selector: 'app-warehouse-branch-details',
  standalone: true,
  imports: [
    ButtonComponent,
    TabsComponent,
    TabPanelDirective,
    WarehouseBranchProductsTableComponent,
    WarehouseBranchMovementsTableComponent,
  ],
  providers: [WarehouseBranchDetailResourceService],
  templateUrl: './warehouse-branch-details.component.html',
})
export class WarehouseBranchDetailsComponent {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _warehouseBranchDetailResourceService = inject(
    WarehouseBranchDetailResourceService
  );

  private readonly _warehouseId = toSignal(
    this._route.paramMap.pipe(map(params => params.get('warehouseId'))),
    { initialValue: null }
  );

  protected readonly warehouseId = this._warehouseId;
  protected readonly tabCounts = this._warehouseBranchDetailResourceService.tabCounts;

  constructor() {
    effect(() => {
      this._warehouseBranchDetailResourceService.setWarehouseId(this._warehouseId());
    });
  }

  protected goBack(): void {
    this._router.navigate(['warehouses']);
  }
}
