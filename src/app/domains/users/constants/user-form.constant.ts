import { Validators } from '@angular/forms';

export const USER_FORM_CONTROL = {
  name: ['', [Validators.required]],
  userName: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
  role: ['', [Validators.required]],
};
