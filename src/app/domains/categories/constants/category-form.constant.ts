import { Validators } from '@angular/forms';

export const CATEGORY_FORM_CONTROL = {
  name: ['', [Validators.required]],
  description: ['', []],
};
