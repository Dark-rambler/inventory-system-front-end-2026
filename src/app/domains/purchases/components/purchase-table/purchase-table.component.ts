import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
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
import { Purchase, PurchaseStatus } from '../../../../shared/interfaces/purchase.interface';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { PurchaseService } from '../../../../shared/services/purchase.service';
import { tap } from 'rxjs';
import { PURCHASE_COLUMNS } from '../../constants/purchase-columns.constant';
import { PurchaseResourceService } from '../../services/purchase-resource.service';
import { ModalPurchaseComponent } from '../modal-purchase/modal-purchase.component';

@Component({
  selector: 'app-purchase-table',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    EditItemDirective,
    PaginatorComponent,
  ],
  templateUrl: './purchase-table.component.html',
})
export class PurchaseTableComponent {
  private readonly _purchaseResourceService = inject(PurchaseResourceService);
  private readonly _purchaseService = inject(PurchaseService);
  private readonly _confirmModalService = inject(ConfirmModalService);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  public purchaseData = this._purchaseResourceService.purchaseData;
  public currentPage = this._purchaseResourceService.filterPurchaseParameters;

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron compras',
    showLoading: this._purchaseResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly purchaseColumns = PURCHASE_COLUMNS;

  protected editPurchase(event: Purchase): void {
    this._dialog.open(ModalPurchaseComponent, {
      data: event,
      viewContainerRef: this._viewContainerRef,
    });
  }

  protected deletePurchase(purchase: Purchase): void {
    this._confirmModalService
      .open({
        title: 'Eliminar compra',
        message: `Estas seguro de eliminar la compra "${purchase.folio}"?`,
      })
      .subscribe(result => {
        if (result === 'confirm') {
          this._purchaseService
            .delete(purchase.id)
            .pipe(
              tap(() => this._purchaseResourceService.reloadPurchases()),
              tap(() => this._dialog.closeAll())
            )
            .subscribe();
        }
      });
  }

  protected statusBadgeClass(status: PurchaseStatus): string {
    if (status === 'Recibida') {
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    }

    if (status === 'Emitida') {
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
    }

    if (status === 'Anulada') {
      return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
    }

    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
  }

  protected changePage(page: number): void {
    this._purchaseResourceService.filterPurchaseParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._purchaseResourceService.filterPurchaseParameters.update(p => ({
      ...p,
      page: 1,
      pageSize,
    }));
  }
}
