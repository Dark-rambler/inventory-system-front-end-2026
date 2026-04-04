import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { WAREHOUSE_FORM_CONTROL } from '../../../constants/warehouse-form.constant';
import { SendWarehouseDirective } from '../directives/send-warehouse.directive';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [FormInputComponent, ReactiveFormsModule, ButtonComponent, SendWarehouseDirective],
  templateUrl: './warehouse-form.component.html',
})
export class WarehouseFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  protected warehouseForm = this.formBuilder.group(WAREHOUSE_FORM_CONTROL);
  protected data = inject(DIALOG_DATA);

  ngOnInit(): void {
    this.formatData();
  }

  private formatData(): void {
    if (this.data) {
      this.warehouseForm.patchValue({
        name: this.data.name,
        address: this.data.location.address,
        city: this.data.location.city,
      });
    }
    this.loadData();
  }
  private loadData(): void {
    if (this.data) {
      this.warehouseForm.patchValue(this.data);
    }
  }
}
