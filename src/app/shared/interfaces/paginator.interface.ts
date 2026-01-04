export interface PaginatorInterface<T> {
  items: T[];
  pageSize: number;
  pageIndex: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
