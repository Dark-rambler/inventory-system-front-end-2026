export interface BranchSaleDetailApi {
  id: number;
  quantity: number;
  price: number;
  product: string;
}

export interface BranchSaleApi {
  id: string;
  total: number;
  branch: string;
  seller: string;
  date: string;
  saleDetails: BranchSaleDetailApi[];
}
