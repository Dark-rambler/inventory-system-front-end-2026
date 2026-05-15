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
import { EditItemDirective } from '../../../../shared/directives';
import { Supplier } from '../../../../shared/interfaces/supplier.interface';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { SupplierService } from '../../../../shared/services/supplier.service';
import { tap } from 'rxjs';
import { SUPPLIER_COLUMNS } from '../../constants/supplier-columns.constant';
import { SupplierResourceService } from '../../services/supplier-resource.service';
import { ModalSupplierComponent } from '../modal-supplier/modal-supplier.component';

@Component({
  selector: 'app-supplier-table',
  standalone: true,
  imports: [
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    EditItemDirective,
    PaginatorComponent,
  ],
  templateUrl: './supplier-table.component.html',
})
export class SupplierTableComponent {
  private readonly _supplierResourceService = inject(SupplierResourceService);
  private readonly _supplierService = inject(SupplierService);
  private readonly _confirmModalService = inject(ConfirmModalService);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  public supplierData = this._supplierResourceService.supplierData;
  public currentPage = this._supplierResourceService.filterSupplierParameters;

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron proveedores',
    showLoading: this._supplierResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly supplierColumns = SUPPLIER_COLUMNS;

  protected editSupplier(event: Supplier): void {
    this._dialog.open(ModalSupplierComponent, {
      data: event,
      viewContainerRef: this._viewContainerRef,
    });
  }

  protected deleteSupplier(supplier: Supplier): void {
    this._confirmModalService
      .open({
        title: 'Eliminar proveedor',
        message: `¿Estás seguro de eliminar el proveedor "${supplier.name}"?`,
      })
      .subscribe(result => {
        if (result === 'confirm') {
          this._supplierService
            .delete(supplier.id)
            .pipe(
              tap(() => this._supplierResourceService.reloadSuppliers()),
              tap(() => this._dialog.closeAll())
            )
            .subscribe();
        }
      });
  }

  protected changePage(page: number): void {
    this._supplierResourceService.filterSupplierParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._supplierResourceService.filterSupplierParameters.update(p => ({
      ...p,
      page: 1,
      pageSize,
    }));
  }
}
