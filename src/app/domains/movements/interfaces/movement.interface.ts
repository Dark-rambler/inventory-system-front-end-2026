export interface Movement {
  id: string;
  movementType: string;
  productName: string;
  branchName: string;
  warehouseName: string;
  quantity: number;
  previousStock: number;
  currentStock: number;
  createdAt: string;
  notes?: string;
}
