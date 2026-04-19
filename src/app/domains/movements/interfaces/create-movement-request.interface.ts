export interface CreateMovementRequest {
  productId: string;
  quantity: number;
  type: number;
  fromWarehouseId: string | null;
  toWarehouseId: string | null;
  fromBranchId: string | null;
  toBranchId: string | null;
}
