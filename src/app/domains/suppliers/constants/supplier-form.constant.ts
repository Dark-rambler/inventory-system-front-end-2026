import { Validators } from '@angular/forms';

export const SUPPLIER_FORM_CONTROL = {
  name: ['', [Validators.required]],
  contactName: ['', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  phone: ['', [Validators.required]],
  city: ['', []],
};
