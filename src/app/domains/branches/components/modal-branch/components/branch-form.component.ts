import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { BRANCH_FORM_CONTROL } from '../../../constants/branch-form.constant';
import { SendBranchDirective } from '../directives/click-send-branch.directive';

@Component({
  selector: 'app-branch-form',
  imports: [FormInputComponent, ReactiveFormsModule, ButtonComponent, SendBranchDirective],
  templateUrl: './branch-form.component.html',
})
export class BranchFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  protected branchForm = this.formBuilder.group(BRANCH_FORM_CONTROL);
  protected data = inject(DIALOG_DATA);

  ngOnInit(): void {
    this.formatData();
  }

  private formatData(): void {
    if (this.data) {
      this.branchForm.patchValue({
        name: this.data.name,
        telephone: this.data.telephone,
        address: this.data.address,
        city: this.data.city,
      });
    }
  }
}
