import { Validators } from '@angular/forms';

export const BUSINESS_FORM_CONTROL = {
  name: ['', [Validators.required]],
  nit: ['', [Validators.required]],
  phone: ['', [Validators.required]],
};
