import { Dialog } from '@angular/cdk/dialog';
import { Component, computed, inject, ViewContainerRef } from '@angular/core';
import {
  ActionButtonsComponent,
  IconButtonComponent,
} from '../../../../shared/components/icon-button';
import {
  PaginatorComponent,
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '../../../../shared/components/table';
import { EditItemDirective, ViewDetailsDirective } from '../../../../shared/directives';
import { Inventory } from '../../interfaces/inventory.interface';
import { INVENTORYCOLUMNS } from '../../constants/inventory-columns.constant';
import { InventoryResourceService } from '../../services/inventory-resource.service';
import { InventoryService } from '../../../../shared/services/inventory.service';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { ModalInventoryComponent } from '../modal-inventory/modal-inventory.component';
import { tap } from 'rxjs';

@Component({
  selector: 'app-inventory-table',
  standalone: true,
  imports: [
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    ViewDetailsDirective,
    EditItemDirective,
    PaginatorComponent,
  ],
  templateUrl: './inventory-table.component.html',
})
export class InventoryTableComponent {
  private readonly _inventoryResourceService = inject(InventoryResourceService);
  private readonly _inventoryService = inject(InventoryService);
  private readonly _confirmModalService = inject(ConfirmModalService);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  public inventoryData = this._inventoryResourceService.inventoryData;
  public currentPage = this._inventoryResourceService.filterInventoryParameters;

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontró inventario',
    showLoading: this._inventoryResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly inventoryColumns = INVENTORYCOLUMNS;

  protected editInventory(event: Inventory): void {
    this._dialog.open(ModalInventoryComponent, {
      data: event,
      viewContainerRef: this._viewContainerRef,
    });
  }

  protected deleteInventory(inventory: Inventory): void {
    this._confirmModalService
      .open({
        title: 'Eliminar inventario',
        message: `¿Estás seguro de eliminar el inventario "${inventory.name}"?`,
      })
      .subscribe(result => {
        if (result === 'confirm') {
          this._inventoryService
            .delete(inventory.id.toString())
            .pipe(tap(() => this._inventoryResourceService.reloadInventory()))
            .subscribe();
        }
      });
  }

  protected changePage(page: number): void {
    this._inventoryResourceService.filterInventoryParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._inventoryResourceService.filterInventoryParameters.update(p => ({
      ...p,
      page: 1,
      pageSize,
    }));
  }
}
