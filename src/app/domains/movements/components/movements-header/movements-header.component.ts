import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, input, ViewContainerRef } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movements-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './movements-header.component.html',
})
export class MovementsHeaderComponent {
  public title = input<string>('Movimientos de productos');
  public branchId = input<string | null>(null);
  private readonly _router = inject(Router);

  private readonly _dialog = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  protected handleNewMovement(): void {
    console.log('');
  }
}
