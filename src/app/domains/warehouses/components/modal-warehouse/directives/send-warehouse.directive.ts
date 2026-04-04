import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import { Directive, inject, input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { tap } from 'rxjs';
import { WarehouseService } from '../../../../../shared/services/warehouse.service';
import { WarehouseResourceService } from '../../../services/warehouse-resource.service';
import { Warehouse, WarehouseLocation } from '../../../../../shared/interfaces/warehouse.interface';

@Directive({
  selector: '[appSendWarehouse]',
  standalone: true,
  host: {
    '(click)': 'onClick()',
  },
})
export class SendWarehouseDirective {
  private readonly _warehouseService = inject(WarehouseService);
  private readonly _warehouseResourceService = inject(WarehouseResourceService);
  private readonly _dialog = inject(Dialog);
  private readonly _formGroupDirective = inject(FormGroupDirective);
  //   public form = input.required<FormGroup>();
  public keepOpen = input<boolean>(false);
  public data = inject(DIALOG_DATA);

  onClick(): void {
    const form = this._formGroupDirective.form;
    if (form.valid) {
      console.log(form.value);
      const warehouse = form.value;
      const locationWarehouse: WarehouseLocation = {
        address: warehouse.address,
        city: warehouse.city,
      };
      const warehouseToSend: Warehouse = {
        name: warehouse.name,
        location: locationWarehouse,
      };

      if (this.data) {
        this._warehouseService
          .update(warehouseToSend, this.data.id)
          .pipe(
            tap(() => this._warehouseResourceService.reloadWarehouse()),
            tap(() => (this.keepOpen() ? form.reset() : this._dialog.closeAll()))
          )
          .subscribe();
      } else {
        this._warehouseService
          .create(warehouseToSend)
          .pipe(
            tap(() => this._warehouseResourceService.reloadWarehouse()),
            tap(() => (this.keepOpen() ? form.reset() : this._dialog.closeAll()))
          )
          .subscribe();
      }
    } else {
      form.markAllAsTouched();
    }
  }
}
