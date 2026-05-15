import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TabPanelDirective, TabsComponent } from '@shared/components/tabs';
import { ButtonComponent } from '@shared/components/button';
import { BranchService } from '@shared/services/branch.service';
import { BranchProductItem } from '@shared/interfaces/branch.interface';
import { InventoryFiltersComponent } from '../inventory/components/inventory-filters/inventory-filters.component';
import { InventoryTableComponent } from '../inventory/components/inventory-table';
import { InventoryResourceService } from '../inventory/services/inventory-resource.service';
import { catchError, finalize, map, of, tap } from 'rxjs';
import { MovementsFiltersComponent } from './components/movements-filters/movements-filters.component';
import { MovementResourceService } from './services/movement-resource.service';
import { SalesFiltersComponent } from '../sales/components/sales-filters/sales-filters.component';
import { SalesTableComponent } from '../sales/components/sales-table/sales-table.component';
import { SalesResourceService } from '../sales/services/sales-resource.service';
import { MovementsHeaderComponent } from './components/movements-header/movements-header.component';
import { CreateBranchMovementComponent } from './components/movements-header/create-branch-movement/create-branch-movement.component';
import { BranchMissingProductsTableComponent } from './components/branch-missing-products-table/branch-missing-products-table.component';
import { ToastrService } from 'ngx-toastr';
import { BranchMissingProductsResourceService } from './services/branch-missing-products-resource.service';

@Component({
  selector: 'app-branch-movements',
  standalone: true,
  imports: [
    MovementsHeaderComponent,
    ButtonComponent,
    TabsComponent,
    TabPanelDirective,
    SalesFiltersComponent,
    SalesTableComponent,
    MovementsFiltersComponent,
    InventoryFiltersComponent,
    InventoryTableComponent,
    BranchMissingProductsTableComponent,
    CreateBranchMovementComponent,
  ],
  providers: [
    SalesResourceService,
    MovementResourceService,
    InventoryResourceService,
    BranchMissingProductsResourceService,
  ],
  templateUrl: './branch-movements.component.html',
})
export class BranchMovementsComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _branchService = inject(BranchService);
  private readonly _toastrService = inject(ToastrService);
  private readonly _inventoryResourceService = inject(InventoryResourceService);
  private readonly _branchMissingProductsResourceService = inject(
    BranchMissingProductsResourceService
  );

  private readonly _branchId = toSignal(
    this._route.paramMap.pipe(map(params => params.get('branchId'))),
    { initialValue: null }
  );
  protected readonly branchId = this._branchId;
  protected readonly branchName = signal<string | null>(null);
  protected readonly selectedMissingProductIds = signal<string[]>([]);
  protected readonly selectedMissingProductsPayload = signal<BranchProductItem[]>([]);
  protected readonly isAddingProducts = signal<boolean>(false);
  protected readonly missingProductsResetKey = signal<number>(0);

  ngOnInit(): void {
    this._branchService
      .getById(this._branchId()!)
      .pipe(catchError(() => of(null)))
      .subscribe(branch => this.branchName.set(branch?.name ?? null));
  }

  protected onMissingProductsSelectionChange(ids: string[]): void {
    this.selectedMissingProductIds.set(ids);
  }

  protected onMissingProductsPayloadChange(payload: BranchProductItem[]): void {
    this.selectedMissingProductsPayload.set(payload);
  }

  protected addSelectedProductsToBranch(): void {
    const branchId = this.branchId();
    const selectedIds = this.selectedMissingProductIds();
    const payload = this.selectedMissingProductsPayload();

    if (!branchId) {
      this._toastrService.error('No se pudo identificar la sucursal actual.', 'Error');
      return;
    }

    if (!selectedIds.length) {
      return;
    }

    if (payload.length !== selectedIds.length) {
      this._toastrService.warning(
        'Completa precio, stock y stock minimo en todos los productos seleccionados.',
        'Datos incompletos'
      );
      return;
    }

    this.isAddingProducts.set(true);

    this._branchService
      .addProducts(branchId, payload)
      .pipe(
        tap(() => this._inventoryResourceService.reloadInventory()),
        tap(() => this._branchMissingProductsResourceService.reload()),
        catchError(() => {
          this._toastrService.error('No se pudieron agregar los productos a la sucursal.', 'Error');
          return of(null);
        }),
        finalize(() => this.isAddingProducts.set(false))
      )
      .subscribe(result => {
        if (result === null) {
          return;
        }

        this._toastrService.success(
          `${payload.length} producto(s) agregados a la sucursal correctamente.`,
          'Exito'
        );

        this.selectedMissingProductIds.set([]);
        this.selectedMissingProductsPayload.set([]);
        this.missingProductsResetKey.update(value => value + 1);
      });
  }
}
