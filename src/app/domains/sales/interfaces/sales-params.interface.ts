export interface SalesParams {
  folio?: string;
  customerName?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export const DEFAULT_SALES_PARAMS: SalesParams = {
  page: 1,
  pageSize: 10,
};
