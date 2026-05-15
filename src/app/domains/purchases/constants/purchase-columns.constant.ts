import { TableColumn } from '../../../shared/components/table';
import { Purchase } from '../../../shared/interfaces/purchase.interface';

export const PURCHASE_COLUMNS: TableColumn<Purchase>[] = [
  { key: 'provider', header: 'Proveedor' },
  { key: 'branch', header: 'Sucursal' },
  { key: 'buyer', header: 'Comprador' },
  { key: 'items', header: 'Items' },
  { key: 'total', header: 'Total' },
  { key: 'date', header: 'Fecha' },
  { key: 'actions', header: 'Acciones', width: '120px' },
];
