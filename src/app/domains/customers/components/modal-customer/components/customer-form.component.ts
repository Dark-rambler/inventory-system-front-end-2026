import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button';
import { FormInputComponent } from '@shared/form-input/form-input.component';
import { CUSTOMER_FORM_CONTROL } from '../../../constants/customer-form.constant';
import { SendCustomerDirective } from '../directives/click-send-customer.directive';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [FormInputComponent, ReactiveFormsModule, ButtonComponent, SendCustomerDirective],
  templateUrl: './customer-form.component.html',
})
export class CustomerFormComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);

  protected customerForm = this._formBuilder.group(CUSTOMER_FORM_CONTROL);
  protected data = inject(DIALOG_DATA);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    if (this.data) {
      this.customerForm.patchValue(this.data);
    }
  }
}
