import { DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { SendBranchDirective } from '../directives/click-send-branch.directive';

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [FormInputComponent, ReactiveFormsModule, ButtonComponent, SendBranchDirective],
  templateUrl: './branch-form.component.html',
})
export class BranchFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  protected branchForm = this.formBuilder.group({
    name: this.formBuilder.control('', [Validators.required]),
    telephone: this.formBuilder.control('', [Validators.required]),
    address: this.formBuilder.control('', [Validators.required]),
    location: this.formBuilder.group({
      address: this.formBuilder.control('', [Validators.required]),
      city: this.formBuilder.control('', [Validators.required]),
    }),
  });
  protected data = inject(DIALOG_DATA);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    if (this.data) {
      this.branchForm.patchValue(this.data);
    }
  }
}
