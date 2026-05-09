export type PurchaseStatus = 'Borrador' | 'Emitida' | 'Recibida' | 'Anulada';

export interface PurchaseDetail {
  id: number;
  quantity: number;
  price: number;
  product: string;
}

export interface Purchase {
  id: string;
  total: number;
  provider: string;
  branch: string;
  buyer: string;
  date: string;
  purchaseDetails: PurchaseDetail[];

  // Legacy optional fields used by existing forms/components.
  folio?: string;
  supplierId?: number | string;
  supplierName?: string;
  status?: PurchaseStatus;
  paymentMethod?: string;
  items?: number;
  expectedDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
