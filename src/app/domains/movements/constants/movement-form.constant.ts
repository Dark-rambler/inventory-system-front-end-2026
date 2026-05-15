import { Validators } from '@angular/forms';

export const MOVEMENT_FORM_CONTROL = {
  productId: ['', [Validators.required]],
  quantity: [0, [Validators.required, Validators.min(1)]],
  type: [1, [Validators.required, Validators.min(0), Validators.max(2)]],
  fromWarehouseId: [''],
  toWarehouseId: [''],
  fromBranchId: [''],
  toBranchId: [''],
  notes: [''],
};
