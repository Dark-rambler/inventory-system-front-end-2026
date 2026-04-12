export interface InventoryCategory {
  id: string;
  name: string;
}

export interface Inventory {
  id: string;
  name: string;
  code: string;
  categoryName: string;
  description: string;
  category: InventoryCategory;
  price?: number;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
