import { TableColumn } from '../../../shared/components/table';

export interface Sale {
  id: string;
  date: string;
  sellerName: string;
  branchName: string;
  folio: string;
  customer: string;
  productsSummary: string;
  total: number;
  items: number;
}

export const SALES_COLUMNS: TableColumn<Sale>[] = [
  { key: 'date', header: 'Fecha' },
  { key: 'folio', header: 'Folio' },
  { key: 'sellerName', header: 'Vendedor' },
  { key: 'customer', header: 'Cliente' },
  { key: 'branchName', header: 'Sucursal' },
  { key: 'productsSummary', header: 'Productos' },
  { key: 'items', header: 'Artículos' },
  { key: 'total', header: 'Total' },
];
