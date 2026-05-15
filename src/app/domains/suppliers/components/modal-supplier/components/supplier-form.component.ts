import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { SUPPLIER_FORM_CONTROL } from '../../../constants/supplier-form.constant';
import { SendSupplierDirective } from '../directives/click-send-supplier.directive';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [FormInputComponent, ReactiveFormsModule, ButtonComponent, SendSupplierDirective],
  templateUrl: './supplier-form.component.html',
})
export class SupplierFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  protected supplierForm = this.formBuilder.group(SUPPLIER_FORM_CONTROL);
  protected data = inject(DIALOG_DATA);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    if (this.data) {
      this.supplierForm.patchValue(this.data);
    }
  }
}
