export interface PosProduct {
  id: string;
  name: string;
  code: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: string;
  categoryName: string;
}

export interface CartItem extends PosProduct {
  quantity: number;
  subtotal: number;
}

export interface PosSale {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  createdAt: Date;
}

export interface SaleDetail {
  productId: string;
  quantity: number;
}

export interface SaleRequest {
  customerId: string | number;
  saleDetails: SaleDetail[];
}
