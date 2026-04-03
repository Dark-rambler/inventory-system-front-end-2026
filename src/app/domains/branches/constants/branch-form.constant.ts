import { Validators } from '@angular/forms';

export const BRANCH_FORM_CONTROL = {
  name: ['', [Validators.required]],
  telephone: ['', [Validators.required]],
  address: ['', [Validators.required]],
  location: {
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
  },
};
