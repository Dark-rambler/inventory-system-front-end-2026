export interface WarehouseLocation {
  id: number;
  address: string;
  city: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: WarehouseLocation;
  createdAt: Date;
  updatedAt: Date;
}
