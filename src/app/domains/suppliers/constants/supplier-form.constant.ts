import { Validators } from '@angular/forms';

export const SUPPLIER_FORM_CONTROL = {
  name: ['', [Validators.required]],
  contact: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  telephone: ['', [Validators.required]],
  city: ['', []],
};
