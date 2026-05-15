import { Component, computed, inject, ViewContainerRef } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ActionButtonsComponent, IconButtonComponent } from '@shared/components/icon-button';
import {
  PaginatorComponent,
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '@shared/components/table';
import { EditItemDirective } from '@shared/directives';
import { Customer } from '@shared/interfaces/customer.interface';
import { ConfirmModalService } from '@shared/services/confirm-modal.service';
import { CustomerService } from '@shared/services/customer.service';
import { tap } from 'rxjs';
import { CUSTOMER_TABLE_COLUMNS } from '../../constants/customer-table-columns.constants';
import { CustomerResourceService } from '../../services/customer-resource.service';
import { ModalCustomerComponent } from '../modal-customer/modal-customer.component';

@Component({
  selector: 'app-customers-table',
  imports: [
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    EditItemDirective,
    PaginatorComponent,
  ],
  templateUrl: './customers-table.component.html',
})
export class CustomersTableComponent {
  private readonly _customerResourceService = inject(CustomerResourceService);
  private readonly _customerService = inject(CustomerService);
  private readonly _confirmModalService = inject(ConfirmModalService);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  public customerData = this._customerResourceService.customerData;
  public currentPage = this._customerResourceService.filterCustomerParameters;

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron clientes',
    showLoading: this._customerResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly customerColumns = CUSTOMER_TABLE_COLUMNS;

  protected editCustomer(event: Customer): void {
    this._dialog.open(ModalCustomerComponent, {
      data: event,
      viewContainerRef: this._viewContainerRef,
    });
  }

  protected deleteCustomer(customer: Customer): void {
    this._confirmModalService
      .open({
        title: 'Eliminar cliente',
        message: `¿Estás seguro de eliminar al cliente "${customer.name}"?`,
      })
      .subscribe(result => {
        if (result === 'confirm') {
          this._customerService
            .delete(customer.id)
            .pipe(
              tap(() => this._customerResourceService.reloadCustomer()),
              tap(() => this._dialog.closeAll())
            )
            .subscribe();
        }
      });
  }

  protected changePage(page: number): void {
    this._customerResourceService.filterCustomerParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._customerResourceService.filterCustomerParameters.update(p => ({
      ...p,
      page: 1,
      pageSize,
    }));
  }
}
