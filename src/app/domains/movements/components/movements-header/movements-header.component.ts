import { Router } from '@angular/router';
import { Component, inject, input } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';
import { Dialog } from '@angular/cdk/dialog';
import { MovementProductModalComponent } from './create-branch-movement/components/movement-product-modal.component/movement-product-modal.component';

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
  private readonly _router = inject(Router);
  private readonly _dialog = inject(Dialog);

  protected addNewProduct(): void {
    this._dialog.open(MovementProductModalComponent);
  }
}
