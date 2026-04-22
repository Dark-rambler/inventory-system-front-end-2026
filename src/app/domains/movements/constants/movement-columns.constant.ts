import { TableColumn } from '../../../shared/components/table';
import { Movement } from '../interfaces/movement.interface';

export const MOVEMENT_COLUMNS: TableColumn<Movement>[] = [
  { key: 'type', header: 'Tipo' },
  { key: 'product', header: 'Producto' },
  { key: 'fromBranch', header: 'Sucursal Origen' },
  { key: 'fromWarehouse', header: 'Almacen Origen' },
  { key: 'quantity', header: 'Cantidad' },
  { key: 'previousStock', header: 'Stock Anterior' },
  { key: 'currentStock', header: 'Stock Actual' },
  { key: 'createdAt', header: 'Fecha' },
];
