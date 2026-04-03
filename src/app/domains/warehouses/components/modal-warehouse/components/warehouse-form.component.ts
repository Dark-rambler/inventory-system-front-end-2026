import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { ButtonComponent } from '../../../../../shared/components/button';
import { WAREHOUSE_FORM_CONTROL } from '../../../constants/warehouse-form.constant';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { WarehouseService } from '../../../../../shared/services/warehouse.service';
import { WarehouseResourceService } from '../../../services/warehouse-resource.service';
import { Dialog } from '@angular/cdk/dialog';
import { tap } from 'rxjs';
import { Warehouse } from '../../../../../shared/interfaces/warehouse.interface';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [FormInputComponent, ReactiveFormsModule, ButtonComponent],
  templateUrl: './warehouse-form.component.html',
})
export class WarehouseFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly _warehouseService = inject(WarehouseService);
  private readonly _warehouseResourceService = inject(WarehouseResourceService);
  private readonly _dialog = inject(Dialog);

  protected warehouseForm = this.formBuilder.group(WAREHOUSE_FORM_CONTROL);
  protected data = inject(DIALOG_DATA);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    if (this.data) {
      this.warehouseForm.patchValue(this.data);
    }
  }

  protected onSubmit(keepOpen = false): void {
    const form = this.warehouseForm;
    if (form.valid) {
      const warehouse = form.value as unknown as Warehouse;

      if (this.data) {
        this._warehouseService
          .update(warehouse, this.data.id)
          .pipe(
            tap(() => this._warehouseResourceService.reloadWarehouse()),
            tap(() => (keepOpen ? form.reset() : this._dialog.closeAll()))
          )
          .subscribe();
      } else {
        this._warehouseService
          .create(warehouse)
          .pipe(
            tap(() => this._warehouseResourceService.reloadWarehouse()),
            tap(() => (keepOpen ? form.reset() : this._dialog.closeAll()))
          )
          .subscribe();
      }
    } else {
      form.markAllAsTouched();
    }
  }
}
