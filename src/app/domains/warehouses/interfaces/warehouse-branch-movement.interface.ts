export interface WarehouseBranchMovement {
  id: string;
  movementType: string;
  productName: string;
  quantity: number;
  previousStock: number;
  currentStock: number;
  movementDate: string;
}
