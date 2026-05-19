import { Validators } from '@angular/forms';

export const PURCHASE_FORM_CONTROL = {
  providerId: ['', [Validators.required]],
  branchId: [''],
  warehouseId: [''],
};
