import { Validators } from '@angular/forms';

export const WAREHOUSE_FORM_CONTROL = {
  name: ['', [Validators.required]],
  address: ['', [Validators.required]],
  city: ['', [Validators.required]],
};
