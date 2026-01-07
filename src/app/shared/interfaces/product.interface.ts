export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
}
