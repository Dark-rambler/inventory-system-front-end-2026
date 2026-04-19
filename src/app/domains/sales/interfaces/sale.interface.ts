import { TableColumn } from '../../../shared/components/table';

export interface Sale {
  id: string;
  date: string;
  sellerName: string;
  branchName: string;
  productsSummary: string;
  total: number;
  items: number;
}

export const SALES_COLUMNS: TableColumn<Sale>[] = [
  { key: 'date', header: 'Fecha' },
  { key: 'sellerName', header: 'Vendedor' },
  { key: 'branchName', header: 'Sucursal' },
  { key: 'productsSummary', header: 'Productos' },
  { key: 'items', header: 'Artículos' },
  { key: 'total', header: 'Total' },
];
