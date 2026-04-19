import { Validators } from '@angular/forms';

export const PRODUCT_FORM_CONTROL = {
  name: ['', Validators.required],
  description: ['', Validators.required],
  code: ['', Validators.required],
  categoryId: ['', Validators.required],
};
