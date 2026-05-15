import { PurchaseStatus } from '@shared/interfaces/purchase.interface';

interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
}

export const PURCHASE_STATUS_OPTIONS: SelectOption<PurchaseStatus>[] = [
  { value: 'Borrador', label: 'Borrador' },
  { value: 'Emitida', label: 'Emitida' },
  { value: 'Recibida', label: 'Recibida' },
  { value: 'Anulada', label: 'Anulada' },
];

export const PURCHASE_PAYMENT_METHOD_OPTIONS: SelectOption[] = [
  { value: 'Contado', label: 'Contado' },
  { value: 'Credito 15 dias', label: 'Credito 15 dias' },
  { value: 'Credito 30 dias', label: 'Credito 30 dias' },
  { value: 'Transferencia bancaria', label: 'Transferencia bancaria' },
];
