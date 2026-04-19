import { TableColumn } from '../../../shared/components/table';
import { Movement } from '../interfaces/movement.interface';

export const MOVEMENT_COLUMNS: TableColumn<Movement>[] = [
  { key: 'movementType', header: 'Tipo' },
  { key: 'productName', header: 'Producto' },
  { key: 'branchName', header: 'Sucursal' },
  { key: 'warehouseName', header: 'Almacen' },
  { key: 'quantity', header: 'Cantidad' },
  { key: 'previousStock', header: 'Stock Anterior' },
  { key: 'currentStock', header: 'Stock Actual' },
  { key: 'createdAt', header: 'Fecha' },
];
