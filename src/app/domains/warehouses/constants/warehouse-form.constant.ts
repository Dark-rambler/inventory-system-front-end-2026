import { Validators } from '@angular/forms';

export const WAREHOUSE_FORM_CONTROL = {
  name: ['', [Validators.required]],
  location: ['', [Validators.required]],
  manager: ['', [Validators.required]],
  capacity: ['', [Validators.required, Validators.min(1)]],
  isActive: [true, []],
};
