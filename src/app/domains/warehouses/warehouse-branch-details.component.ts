import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TabPanelDirective, TabsComponent } from '@shared/components/tabs';
import { map } from 'rxjs';
import { WarehouseBranchMovementsTableComponent } from './components/warehouse-branch-movements-table/warehouse-branch-movements-table.component';
import { WarehouseBranchProductsTableComponent } from './components/warehouse-branch-products-table/warehouse-branch-products-table.component';
import { WarehouseBranchDetailResourceService } from './services/warehouse-branch-detail-resource.service';
import { WarehouseService } from '@app/shared/services/warehouse.service';

@Component({
  selector: 'app-warehouse-branch-details',
  standalone: true,
  imports: [
    TabsComponent,
    TabPanelDirective,
    WarehouseBranchProductsTableComponent,
    WarehouseBranchMovementsTableComponent,
  ],
  providers: [WarehouseBranchDetailResourceService],
  templateUrl: './warehouse-branch-details.component.html',
})
export class WarehouseBranchDetailsComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _warehouseService = inject(WarehouseService);
  protected readonly branchName = signal<string | null>(null);
  private readonly _warehouseBranchDetailResourceService = inject(
    WarehouseBranchDetailResourceService
  );
  private readonly _warehouseId = toSignal(
    this._route.paramMap.pipe(map(params => params.get('warehouseId'))),
    { initialValue: null }
  );

  protected readonly warehouseId = this._warehouseId;
  protected readonly tabCounts = this._warehouseBranchDetailResourceService.tabCounts;

  ngOnInit(): void {
    this._warehouseService.getById(this._warehouseId()!).subscribe(branch => {
      this.branchName.set(branch.name);
    });
  }
}
