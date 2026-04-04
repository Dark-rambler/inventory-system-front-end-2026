import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { tap } from 'rxjs';
import { InventoryService } from '../../../../../shared/services/inventory.service';
import { InventoryResourceService } from '../../../services/inventory-resource.service';

@Directive({
  selector: '[appSendInventory]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class SendInventoryDirective {
  public keepOpen = input<boolean>(false);
  private readonly _inventoryService = inject(InventoryService);
  private readonly _formGroupDirective = inject(FormGroupDirective, { optional: true });
  private readonly _dialog = inject(Dialog);
  private readonly _inventoryResourceService = inject(InventoryResourceService);
  protected data = inject(DIALOG_DATA);

  onClick(): void {
    const form = this._formGroupDirective?.form;
    if (form?.valid) {
      if (this.data) {
        this._updateInventory();
      } else {
        this._createInventory();
      }
    } else {
      form?.markAllAsTouched();
    }
  }

  private _createInventory(): void {
    const form = this._formGroupDirective?.form;
    const inventory = form?.value;
    this._inventoryService
      .create(inventory)
      .pipe(
        tap(() => this._inventoryResourceService.reloadInventory()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe();
  }

  private _updateInventory(): void {
    const form = this._formGroupDirective?.form;
    const inventory = form?.value;

    this._inventoryService
      .update(inventory, this.data.id)
      .pipe(
        tap(() => this._inventoryResourceService.reloadInventory()),
        tap(() => (this.keepOpen() ? form?.reset() : this._dialog.closeAll()))
      )
      .subscribe();
  }
}
