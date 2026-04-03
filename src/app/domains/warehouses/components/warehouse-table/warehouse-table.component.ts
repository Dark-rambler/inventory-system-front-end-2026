import { Dialog } from '@angular/cdk/dialog';
import { Component, computed, inject, ViewContainerRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
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
import { Warehouse } from '../../../../shared/interfaces/warehouse.interface';
import { WAREHOUSECOLUMNS } from '../../constants/warehouse-columns.constant';
import { WarehouseResourceService } from '../../services/warehouse-resource.service';
import { ModalWarehouseComponent } from '../modal-warehouse/modal-warehouse.component';
import { WarehouseService } from '../../../../shared/services/warehouse.service';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-warehouse-table',
  standalone: true,
  imports: [
    DecimalPipe,
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    ViewDetailsDirective,
    EditItemDirective,
    PaginatorComponent,
  ],
  templateUrl: './warehouse-table.component.html',
})
export class WarehouseTableComponent {
  private readonly _warehouseResourceService = inject(WarehouseResourceService);
  private readonly _warehouseService = inject(WarehouseService);
  private readonly _confirmModalService = inject(ConfirmModalService);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  public warehouseData = this._warehouseResourceService.warehouseData;
  public currentPage = this._warehouseResourceService.filterWarehouseParameters;

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron almacenes',
    showLoading: this._warehouseResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly warehouseColumns = WAREHOUSECOLUMNS;

  protected editWarehouse(event: Warehouse): void {
    this._dialog.open(ModalWarehouseComponent, {
      data: event,
      viewContainerRef: this._viewContainerRef,
    });
  }

  protected deleteWarehouse(warehouse: Warehouse): void {
    this._confirmModalService
      .open({
        title: 'Eliminar almacén',
        message: `¿Estás seguro de eliminar el almacén "${warehouse.name}"?`,
      })
      .subscribe(result => {
        if (result === 'confirm') {
          this._warehouseService
            .delete(warehouse.id.toString())
            .pipe(
              tap(() => this._warehouseResourceService.reloadWarehouse()),
              tap(() => this._dialog.closeAll())
            )
            .subscribe();
        }
      });
  }

  protected changePage(page: number): void {
    this._warehouseResourceService.filterWarehouseParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._warehouseResourceService.filterWarehouseParameters.update(p => ({
      ...p,
      page: 1,
      pageSize,
    }));
  }
}
