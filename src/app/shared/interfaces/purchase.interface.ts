export type PurchaseStatus = 'Borrador' | 'Emitida' | 'Recibida' | 'Anulada';

export interface PurchaseDetail {
  id?: number | string;
  productId?: string | number;
  quantity: number;
  price: number;
  product?: string;
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
  providerId?: number | string;
  branchId?: number | string;
  warehouseId?: number | string;
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
