import { TableColumn } from '../../../shared/components/table';
import { Warehouse } from '../../../shared/interfaces/warehouse.interface';

export const WAREHOUSECOLUMNS: TableColumn<Warehouse>[] = [
  { key: 'name', header: 'Nombre' },
  { key: 'city', header: 'Ciudad' },
  { key: 'address', header: 'Dirección' },
  { key: 'actions', header: 'Acciones', width: '120px' },
];
