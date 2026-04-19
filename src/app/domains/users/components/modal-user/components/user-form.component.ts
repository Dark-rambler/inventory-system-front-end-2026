import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../../../../../shared/form-input/form-input.component';
import { ButtonComponent } from '../../../../../shared/components/button';
import { USER_FORM_CONTROL } from '../../../constants/user-form.constant';
import { SendUserDirective } from '../directives/click-send-user.directive';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { FormDropdownComponent } from '@app/shared/form-dropdown/form-dropdown.component';
import { Role } from '@app/shared/interfaces/role.interface';
import { RolesService } from '@app/shared/services/roles.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    FormInputComponent,
    ReactiveFormsModule,
    ButtonComponent,
    SendUserDirective,
    FormDropdownComponent,
  ],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  protected data = inject(DIALOG_DATA);
  protected roleOptions = signal<Role[]>([]);
  private readonly _rolesService = inject(RolesService);

  protected userForm = this.formBuilder.group(USER_FORM_CONTROL);

  ngOnInit(): void {
    this.loadData();
    this.loadRoles();
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

  private loadRoles(): void {
    this._rolesService.getAll().subscribe(response => {
      this.roleOptions.set(response ?? []);
    });
  }
}
