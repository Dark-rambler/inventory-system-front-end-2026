export interface Branch {
  id?: number;
  name: string;
  telephone: string;
  address: string;
  location: {
    address: string;
    city: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
