import { Dialog } from '@angular/cdk/dialog';
import { Component, computed, inject, ViewContainerRef } from '@angular/core';
import { ActionButtonsComponent, IconButtonComponent } from '@shared/components/icon-button';
import {
  PaginatorComponent,
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '@shared/components/table';
import { EditItemDirective } from '@shared/directives';
import { Business } from '@shared/interfaces/business.interface';
import { ConfirmModalService } from '@shared/services/confirm-modal.service';
import { tap } from 'rxjs';
import { BUSINESS_TABLE_COLUMNS } from '../../constants/business-table-columns.constants';
import { BusinessResourceService } from '../../services/business-resource.service';
import { ModalBusinessComponent } from '../modal-business/modal-business.component';
import { BusinessService } from '@shared/services/business.service';

@Component({
  selector: 'app-business-table',
  imports: [
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    EditItemDirective,
    PaginatorComponent,
  ],
  templateUrl: './business-table.component.html',
})
export class BusinessTableComponent {
  private readonly _businessResourceService = inject(BusinessResourceService);
  private readonly _businessService = inject(BusinessService);
  private readonly _confirmModalService = inject(ConfirmModalService);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  public businessData = this._businessResourceService.businessData;
  public currentPage = this._businessResourceService.filterBusinessParameters;

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron registros de business',
    showLoading: this._businessResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly businessColumns = BUSINESS_TABLE_COLUMNS;

  protected editBusiness(event: Business): void {
    this._dialog.open(ModalBusinessComponent, {
      data: event,
      viewContainerRef: this._viewContainerRef,
    });
  }

  protected deleteBusiness(business: Business): void {
    this._confirmModalService
      .open({
        title: 'Eliminar business',
        message: `¿Estás seguro de eliminar "${business.name}"?`,
      })
      .subscribe(result => {
        if (result === 'confirm') {
          this._businessService
            .delete(business.id)
            .pipe(
              tap(() => this._businessResourceService.reloadBusiness()),
              tap(() => this._dialog.closeAll())
            )
            .subscribe();
        }
      });
  }

  protected changePage(page: number): void {
    this._businessResourceService.filterBusinessParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._businessResourceService.filterBusinessParameters.update(p => ({
      ...p,
      page: 1,
      pageSize,
    }));
  }
}
