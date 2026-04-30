export type PurchaseStatus = 'Borrador' | 'Emitida' | 'Recibida' | 'Anulada';

export interface Purchase {
  id: number;
  folio: string;
  supplierId: number;
  supplierName: string;
  status: PurchaseStatus;
  paymentMethod: string;
  items: number;
  total: number;
  expectedDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
