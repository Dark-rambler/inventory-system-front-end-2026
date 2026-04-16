import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, input, ViewContainerRef } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';
import { MovementFormComponent } from '../modal-movement/components/movement-form.component';

@Component({
  selector: 'app-movements-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './movements-header.component.html',
})
export class MovementsHeaderComponent {
  public title = input<string>('Movimientos de productos');
  public showCreateButton = input<boolean>(false);
  public branchId = input<string | null>(null);

  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  protected handleNewMovement(): void {
    this._dialog.open(MovementFormComponent, {
      viewContainerRef: this._viewContainerRef,
      data: {
        branchId: this.branchId(),
      },
    });
  }
}
