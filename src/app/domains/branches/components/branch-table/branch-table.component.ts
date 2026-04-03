import { Dialog } from '@angular/cdk/dialog';
import { Component, computed, inject, ViewContainerRef } from '@angular/core';
import {
  PaginatorComponent,
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '../../../../shared/components/table';
import {
  ConfirmActionDirective,
  EditItemDirective,
  ViewDetailsDirective,
} from '../../../../shared/directives';
import {
  ActionButtonsComponent,
  IconButtonComponent,
} from '../../../../shared/components/icon-button';
import { Branch } from '../../../../shared/interfaces/branch.interface';
import { BRANCHCOLUMNS } from '../../constants/branch-columns.constant';
import { BranchResourceService } from '../../services/branch-resource.service';
import { ModalBranchComponent } from '../modal-branch/modal-branch.component';
import { BranchService } from '../../../../shared/services/branch.service';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-branch-table',
  standalone: true,
  imports: [
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    ConfirmActionDirective,
    ViewDetailsDirective,
    EditItemDirective,
    PaginatorComponent,
  ],
  templateUrl: './branch-table.component.html',
  styleUrls: ['./branch-table.component.scss'],
})
export class BranchTableComponent {
  private readonly _branchResourceService = inject(BranchResourceService);
  private readonly _branchService = inject(BranchService);
  private readonly _confirmModalService = inject(ConfirmModalService);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  public branchData = this._branchResourceService.branchData;
  public currentPage = this._branchResourceService.filterBranchParameters;

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron sucursales',
    showLoading: this._branchResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly branchColumns = BRANCHCOLUMNS;

  protected editBranch(event: Branch): void {
    this._dialog.open(ModalBranchComponent, {
      data: event,
      viewContainerRef: this._viewContainerRef,
    });
  }

  protected deleteBranch(branch: Branch): void {
    this._confirmModalService
      .open({
        title: 'Eliminar sucursal',
        message: `¿Estás seguro de eliminar la sucursal "${branch.name}"?`,
      })
      .subscribe(result => {
        if (result === 'confirm') {
          this._branchService
            .delete(branch.id.toString())
            .pipe(tap(() => this._branchResourceService.reloadBranch()))
            .subscribe();
        }
      });
  }

  protected changePage(page: number): void {
    this._branchResourceService.filterBranchParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._branchResourceService.filterBranchParameters.update(p => ({
      ...p,
      page: 1,
      pageSize,
    }));
  }
}
