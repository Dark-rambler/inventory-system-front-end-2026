import { Validators } from '@angular/forms';

export const CUSTOMER_FORM_CONTROL = {
  name: ['', [Validators.required]],
  nit: ['', [Validators.required]],
  phone: ['', [Validators.required]],
};
