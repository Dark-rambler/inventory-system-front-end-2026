import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { ButtonComponent } from '../../../../../shared/components/button';
import { USER_FORM_CONTROL } from '../../../constants/user-form.constant';
import { SendUserDirective } from '../directives/click-send-user.directive';
import { CloseModalDirective } from '../../../../../shared/components/modal/directives/close-modal.directive';
import { DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    FormInputComponent,
    ReactiveFormsModule,
    ButtonComponent,
    SendUserDirective,
    CloseModalDirective,
  ],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  protected data = inject(DIALOG_DATA);

  protected userForm = this.formBuilder.group(USER_FORM_CONTROL);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    if (this.data) {
      this.userForm.patchValue({
        name: this.data.name,
        userName: this.data.userName,
        email: this.data.email,
        role: this.data.role,
      });
      this.userForm.get('password')?.clearValidators();
    }
  }
}
