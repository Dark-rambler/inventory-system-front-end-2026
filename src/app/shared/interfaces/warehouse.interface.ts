export interface Location {
  id?: number;
  address: string;
  city: string;
}

export interface Warehouse {
  id?: string;
  name: string;
  location: Location;
  createdAt?: Date;
  updatedAt?: Date;
}
