export interface CreatePurchaseDetailRequest {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreatePurchaseRequest {
  providerId: string;
  branchId: string;
  warehouseId: string;
  purchaseDetails: CreatePurchaseDetailRequest[];
}
