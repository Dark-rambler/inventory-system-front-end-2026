import { TableColumn } from '../../../shared/components/table';
import { Purchase } from '../../../shared/interfaces/purchase.interface';

export const PURCHASE_COLUMNS: TableColumn<Purchase>[] = [
  { key: 'folio', header: 'Folio' },
  { key: 'supplierName', header: 'Proveedor' },
  { key: 'status', header: 'Estado' },
  { key: 'paymentMethod', header: 'Pago' },
  { key: 'items', header: 'Items' },
  { key: 'total', header: 'Total' },
  { key: 'expectedDate', header: 'Entrega' },
  { key: 'actions', header: 'Acciones', width: '120px' },
];
