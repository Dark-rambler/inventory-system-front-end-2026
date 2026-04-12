import { Component, inject, ViewContainerRef } from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button';

@Component({
  selector: 'app-sales-header',
  imports: [ButtonComponent],
  templateUrl: './sales-header.component.html',
})
export class SalesHeaderComponent {
  private readonly _viewContainerRef = inject(ViewContainerRef);

  handleNewSale(): void {
    console.log('Nueva venta');
  }
}
