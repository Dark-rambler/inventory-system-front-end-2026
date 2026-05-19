import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@shared/components/button';
import { FormInputComponent } from '@shared/form-input/form-input.component';
import { BUSINESS_FORM_CONTROL } from '../../../constants/business-form.constant';
import { SendBusinessDirective } from '../directives/click-send-business.directive';

@Component({
  selector: 'app-business-form',
  standalone: true,
  imports: [FormInputComponent, ReactiveFormsModule, ButtonComponent, SendBusinessDirective],
  templateUrl: './business-form.component.html',
})
export class BusinessFormComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);

  protected businessForm = this._formBuilder.group(BUSINESS_FORM_CONTROL);
  protected data = inject(DIALOG_DATA);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    if (this.data) {
      this.businessForm.patchValue(this.data);
    }
  }
}
