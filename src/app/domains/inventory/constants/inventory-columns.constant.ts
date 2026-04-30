import { TableColumn } from '../../../shared/components/table';
import { Inventory } from '../interfaces/inventory.interface';

export const INVENTORYCOLUMNS: TableColumn<Inventory>[] = [
  { key: 'categoryName', header: 'Categoría' },
  { key: 'code', header: 'Código' },
  { key: 'description', header: 'Descripción' },
  { key: 'name', header: 'Nombre' },
  { key: 'stock', header: 'Stock' },
  { key: 'actions', header: 'Acciones', width: '120px' },
];
