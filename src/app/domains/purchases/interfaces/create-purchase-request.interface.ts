export interface CreatePurchaseDetailRequest {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreatePurchaseRequest {
  providerId: string;
  branchId: string | null;
  warehouseId: string | null;
  purchaseDetails: CreatePurchaseDetailRequest[];
}
