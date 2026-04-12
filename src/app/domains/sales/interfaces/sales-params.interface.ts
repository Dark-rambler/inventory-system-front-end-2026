export interface SalesParams {
  folio?: string;
  customerName?: string;
  branchName?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const DEFAULT_SALES_PARAMS: SalesParams = {
  page: 1,
  pageSize: 10,
};
