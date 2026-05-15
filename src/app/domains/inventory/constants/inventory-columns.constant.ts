import { TableColumn } from '../../../shared/components/table';
import { Inventory } from '../interfaces/inventory.interface';

export const INVENTORYCOLUMNS: TableColumn<Inventory>[] = [
  { key: 'select', header: '', width: '56px' },
  { key: 'categoryName', header: 'Categoría' },
  { key: 'code', header: 'Código' },
  { key: 'description', header: 'Descripción' },
  { key: 'name', header: 'Nombre' },
  { key: 'price', header: 'Precio', width: '130px' },
  { key: 'stock', header: 'Stock' },
  { key: 'lowStock', header: 'Stock mínimo', width: '130px' },
  { key: 'actions', header: 'Acciones', width: '120px' },
];
