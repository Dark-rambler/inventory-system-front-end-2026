import { Dialog } from '@angular/cdk/dialog';
import { Directive, inject, ViewContainerRef } from '@angular/core';
import { ProductsModalComponent } from '../products-modal/products-modal.component';

@Directive({
  selector: '[appClickAddProductModal]',
  host: {
    '(click)': 'onClick()',
  },
})
export class ClickAddProductModalDirective {
  private readonly _viewContainerRef = inject(ViewContainerRef);

  private readonly _dialog = inject(Dialog);
  public onClick(): void {
    this._dialog.open(ProductsModalComponent, {
      viewContainerRef: this._viewContainerRef,
    });
  }
}
