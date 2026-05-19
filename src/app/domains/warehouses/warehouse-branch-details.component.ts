import { Component, inject, OnInit, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '@shared/components/button';
import { TabPanelDirective, TabsComponent } from '@shared/components/tabs';
import { BranchProductItem } from '@shared/interfaces/branch.interface';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, map, of, tap } from 'rxjs';
import { WarehouseBranchMovementsTableComponent } from './components/warehouse-branch-movements-table/warehouse-branch-movements-table.component';
import { WarehouseBranchMissingProductsTableComponent } from './components/warehouse-branch-products-table/warehouse-branch-products-table.component';
import { WarehouseBranchExistingProductsTableComponent } from './components/warehouse-branch-existing-products-table/warehouse-branch-existing-products-table.component';
import { WarehouseBranchDetailResourceService } from './services/warehouse-branch-detail-resource.service';
import { WarehouseService } from '@app/shared/services/warehouse.service';

@Component({
  selector: 'app-warehouse-branch-details',
  standalone: true,
  imports: [
    ButtonComponent,
    TabsComponent,
    TabPanelDirective,
    WarehouseBranchExistingProductsTableComponent,
    WarehouseBranchMissingProductsTableComponent,
    WarehouseBranchMovementsTableComponent,
  ],
  providers: [WarehouseBranchDetailResourceService],
  templateUrl: './warehouse-branch-details.component.html',
})
export class WarehouseBranchDetailsComponent implements OnInit {
  private readonly _route = inject(ActivatedRoute);
  private readonly _warehouseService = inject(WarehouseService);
  private readonly _toastrService = inject(ToastrService);
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
  protected readonly selectedWarehouseProductIds = signal<string[]>([]);
  protected readonly selectedWarehouseProductsPayload = signal<BranchProductItem[]>([]);
  protected readonly isSendingProducts = signal<boolean>(false);
  protected readonly warehouseProductsResetKey = signal<number>(0);
  protected readonly selectedExistingWarehouseProductIds = signal<string[]>([]);
  protected readonly isDeletingProducts = signal<boolean>(false);
  protected readonly existingWarehouseProductsResetKey = signal<number>(0);

  ngOnInit(): void {
    this._warehouseBranchDetailResourceService.setWarehouseId(this._warehouseId());

    this._warehouseService.getById(this._warehouseId()!).subscribe(branch => {
      this.branchName.set(branch.name);
    });
  }

  protected onWarehouseProductsSelectionChange(ids: string[]): void {
    this.selectedWarehouseProductIds.set(ids);
  }

  protected onExistingWarehouseProductsSelectionChange(ids: string[]): void {
    this.selectedExistingWarehouseProductIds.set(ids);
  }

  protected onWarehouseProductsPayloadChange(payload: BranchProductItem[]): void {
    this.selectedWarehouseProductsPayload.set(payload);
  }

  protected sendSelectedProductsToWarehouse(): void {
    const warehouseId = this.warehouseId();
    const selectedIds = this.selectedWarehouseProductIds();
    const payload = this.selectedWarehouseProductsPayload();

    if (!warehouseId) {
      this._toastrService.error('No se pudo identificar el almacen actual.', 'Error');
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

    this.isSendingProducts.set(true);

    this._warehouseService
      .addProducts(warehouseId, payload)
      .pipe(
        tap(() => this._warehouseBranchDetailResourceService.reloadProducts()),
        tap(() => this._warehouseBranchDetailResourceService.reloadMissingProducts()),
        catchError(() => {
          this._toastrService.error('No se pudieron enviar los productos al almacen.', 'Error');
          return of(null);
        }),
        finalize(() => this.isSendingProducts.set(false))
      )
      .subscribe(result => {
        if (result === null) {
          return;
        }

        this._toastrService.success(
          `${payload.length} producto(s) enviados al almacen correctamente.`,
          'Exito'
        );

        this.selectedWarehouseProductIds.set([]);
        this.selectedWarehouseProductsPayload.set([]);
        this.warehouseProductsResetKey.update(value => value + 1);
      });
  }

  protected deleteSelectedProductsFromWarehouse(): void {
    const warehouseId = this.warehouseId();
    const selectedIds = this.selectedExistingWarehouseProductIds();

    if (!warehouseId || !selectedIds.length) {
      return;
    }

    this.isDeletingProducts.set(true);

    this._warehouseService
      .removeProductsByIds(warehouseId, selectedIds)
      .pipe(
        tap(() => this._warehouseBranchDetailResourceService.reloadProducts()),
        tap(() => this._warehouseBranchDetailResourceService.reloadMissingProducts()),
        catchError(() => {
          this._toastrService.error(
            'No se pudieron eliminar los productos seleccionados del almacen.',
            'Error'
          );
          return of(null);
        }),
        finalize(() => this.isDeletingProducts.set(false))
      )
      .subscribe(result => {
        if (result === null) {
          return;
        }

        this._toastrService.success(
          `${selectedIds.length} producto(s) eliminados del almacen correctamente.`,
          'Exito'
        );

        this.selectedExistingWarehouseProductIds.set([]);
        this.existingWarehouseProductsResetKey.update(value => value + 1);
      });
  }
}
