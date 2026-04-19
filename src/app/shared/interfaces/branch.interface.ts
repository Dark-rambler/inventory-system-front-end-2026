import { Location } from './warehouse.interface';

export interface Branch {
  id?: number;
  name: string;
  telephone: string;
  address: string;
  city: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface BranchForm {
  name: string;
  telephone: string;
  Location: Location;
}
