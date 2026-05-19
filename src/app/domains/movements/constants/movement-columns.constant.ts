import { TableColumn } from '../../../shared/components/table';
import { Movement } from '../interfaces/movement.interface';

export const MOVEMENT_COLUMNS: TableColumn<Movement>[] = [
  { key: 'type', header: 'Tipo' },
  { key: 'product', header: 'Producto' },
  { key: 'fromBranch', header: 'Sucursal Origen' },
  { key: 'fromWarehouse', header: 'Almacen Origen' },
  { key: 'toBranch', header: 'Sucursal Destino' },
  { key: 'toWarehouse', header: 'Almacen Destino' },
  { key: 'quantity', header: 'Cantidad' },
  { key: 'createdAt', header: 'Fecha' },
];
export const MOVEMENT_COLUMNS_BRANCH: TableColumn<Movement>[] = [
  { key: 'type', header: 'Tipo' },
  { key: 'product', header: 'Producto' },
  { key: 'fromBranch', header: 'Sucursal Origen' },
  { key: 'toBranch', header: 'Sucursal Destino' },
  { key: 'quantity', header: 'Cantidad' },
  { key: 'createdAt', header: 'Fecha' },
];
export const MOVEMENT_COLUMNS_WAREHOUSE: TableColumn<Movement>[] = [
  { key: 'type', header: 'Tipo' },
  { key: 'product', header: 'Producto' },
  { key: 'fromWarehouse', header: 'Almacen Origen' },
  { key: 'toWarehouse', header: 'Almacen Destino' },
  { key: 'quantity', header: 'Cantidad' },
  { key: 'createdAt', header: 'Fecha' },
];
