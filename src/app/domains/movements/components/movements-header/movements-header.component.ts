import { Component, inject, input, ViewContainerRef } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';
import { Dialog } from '@angular/cdk/dialog';
import { ModalMovementComponent } from '../modal-movement/modal-movement.component';

@Component({
  selector: 'app-movements-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './movements-header.component.html',
})
export class MovementsHeaderComponent {
  public title = input<string>('Movimientos de productos');
  public branchId = input<string | null>(null);
  public showCreateButton = input<boolean>(true);
  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  protected addNewProduct(): void {
    this._dialog.open(ModalMovementComponent, {
      viewContainerRef: this._viewContainerRef,
    });
  }
}
