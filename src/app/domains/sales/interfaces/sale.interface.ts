import { TableColumn } from '../../../shared/components/table';

export interface Sale {
  id: number;
  folio: string;
  date: string;
  customerName: string;
  branchName: string;
  warehouseName: string;
  total: number;
  status: 'completed' | 'cancelled' | 'pending';
  paymentMethod: string;
  items: number;
}

export const SALES_COLUMNS: TableColumn<Sale>[] = [
  { key: 'folio', header: 'Folio' },
  { key: 'date', header: 'Fecha' },
  { key: 'customerName', header: 'Cliente' },
  { key: 'branchName', header: 'Sucursal' },
  { key: 'warehouseName', header: 'Almacén' },
  { key: 'paymentMethod', header: 'Método de Pago' },
  { key: 'items', header: 'Artículos' },
  { key: 'total', header: 'Total' },
  { key: 'status', header: 'Estado' },
  { key: 'actions', header: 'Acciones', width: '120px' },
];
