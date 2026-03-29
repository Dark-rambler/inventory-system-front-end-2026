import { Dialog } from '@angular/cdk/dialog';
import { Component, computed, inject, ViewContainerRef } from '@angular/core';
import {
  ActionButtonsComponent,
  IconButtonComponent,
} from '../../../../shared/components/icon-button';
import {
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '../../../../shared/components/table';
import { ConfirmActionDirective, EditItemDirective } from '../../../../shared/directives';
import { User } from '../../../../shared/interfaces/user.interface';
import { USERCOLUMNS } from '../../constants/user-columns.constant';
import { UserResourceService } from '../../services/user-resource.service';
import { ModalUserComponent } from '../modal-user/modal-user.component';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    TableComponent,
    TableColumnDirective,
    IconButtonComponent,
    ActionButtonsComponent,
    ConfirmActionDirective,
    EditItemDirective,
  ],
  templateUrl: './user-table.component.html',
})
export class UserTableComponent {
  private readonly _userResourceService = inject(UserResourceService);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  public userData = this._userResourceService.userData;

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
    console.log('Eliminar usuario:', user.id);
  }
}
