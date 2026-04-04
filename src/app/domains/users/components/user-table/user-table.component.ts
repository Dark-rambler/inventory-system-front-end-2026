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
import { User } from '../../../../shared/interfaces/user.interface';
import { USERCOLUMNS } from '../../constants/user-columns.constant';
import { UserResourceService } from '../../services/user-resource.service';
import { ModalUserComponent } from '../modal-user/modal-user.component';
import { UserService } from '../../../../shared/services/user.service';
import { ConfirmModalService } from '../../../../shared/services/confirm-modal.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    EditItemDirective,
    PaginatorComponent,
  ],
  templateUrl: './user-table.component.html',
})
export class UserTableComponent {
  private readonly _userResourceService = inject(UserResourceService);
  private readonly _userService = inject(UserService);
  private readonly _confirmModalService = inject(ConfirmModalService);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  public userData = this._userResourceService.userData;
  public currentPage = this._userResourceService.filterUserParameters;

  public tableConfig = computed<TableConfig>(() => ({
    emptyMessage: 'No se encontraron usuarios',
    showLoading: this._userResourceService.isLoading(),
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  }));

  protected readonly userColumns = USERCOLUMNS;

  protected editUser(event: User): void {
    this._dialog.open(ModalUserComponent, {
      data: event,
      viewContainerRef: this._viewContainerRef,
    });
  }

  protected deleteUser(user: User): void {
    this._confirmModalService
      .open({
        title: 'Eliminar usuario',
        message: `¿Estás seguro de eliminar el usuario "${user.name}"?`,
      })
      .subscribe(result => {
        if (result === 'confirm') {
          this._userService
            .delete(user.id.toString())
            .pipe(tap(() => this._userResourceService.reloadUser()))
            .subscribe();
        }
      });
  }

  protected changePage(page: number): void {
    this._userResourceService.filterUserParameters.update(p => ({ ...p, page }));
  }

  protected changePageSize(pageSize: number): void {
    this._userResourceService.filterUserParameters.update(p => ({ ...p, page: 1, pageSize }));
  }
}
