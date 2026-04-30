import { Validators } from '@angular/forms';

export const PURCHASE_FORM_CONTROL = {
  folio: ['', [Validators.required]],
  supplierId: ['', [Validators.required]],
  supplierName: [''],
  status: ['Emitida', [Validators.required]],
  paymentMethod: ['Credito 30 dias', [Validators.required]],
  items: [1, [Validators.required, Validators.min(1)]],
  total: [0, [Validators.required, Validators.min(0)]],
  expectedDate: ['', [Validators.required]],
  notes: ['', []],
};
