import { Dialog } from '@angular/cdk/dialog';
import { Component, inject, ViewContainerRef } from '@angular/core';
import { ButtonComponent } from '@shared/components/button';
import { ModalCustomerComponent } from '../modal-customer/modal-customer.component';

@Component({
  selector: 'app-customer-header',
  imports: [ButtonComponent],
  templateUrl: './customer-header.component.html',
})
export class CustomerHeaderComponent {
  private readonly _dialogService = inject(Dialog);
  private readonly _viewContainerRef = inject(ViewContainerRef);

  protected handleNewCustomer(): void {
    this._dialogService.open(ModalCustomerComponent, {
      viewContainerRef: this._viewContainerRef,
    });
  }
}
