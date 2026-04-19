import { Validators } from '@angular/forms';

const GUID_PATTERN =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export const MOVEMENT_FORM_CONTROL = {
  productId: ['', [Validators.required, Validators.pattern(GUID_PATTERN)]],
  quantity: [0, [Validators.required, Validators.min(1)]],
  type: [1, [Validators.required, Validators.min(0), Validators.max(1)]],
  fromWarehouseId: ['', [Validators.pattern(GUID_PATTERN)]],
  toWarehouseId: ['', [Validators.pattern(GUID_PATTERN)]],
  fromBranchId: ['', [Validators.pattern(GUID_PATTERN)]],
  toBranchId: ['', [Validators.pattern(GUID_PATTERN)]],
};
