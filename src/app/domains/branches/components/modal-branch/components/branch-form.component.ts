import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { ButtonComponent } from '../../../../../shared/components/button';
import { BRANCH_FORM_CONTROL } from '../../../constants/branch-form.constant';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [FormInputComponent, ReactiveFormsModule, ButtonComponent],
  templateUrl: './branch-form.component.html',
})
export class BranchFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  protected branchForm = this.formBuilder.group(BRANCH_FORM_CONTROL);
  protected data = inject(DIALOG_DATA);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    if (this.data) {
      this.branchForm.patchValue(this.data);
    }
  }

  protected onSubmit(keepOpen = false): void {
    console.log('Form submitted:', this.branchForm.value);
    if (keepOpen) {
      this.branchForm.reset();
    }
  }
}
