import { Validators } from '@angular/forms';

export const INVENTORY_FORM_CONTROL = {
  name: ['', [Validators.required]],
  code: ['', [Validators.required]],
  description: ['', []],
  categoryName: ['', [Validators.required]],
  stock: [0, [Validators.required]],
};
