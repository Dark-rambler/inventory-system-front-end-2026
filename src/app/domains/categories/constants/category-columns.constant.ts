import { TableColumn } from '../../../shared/components/table';
import { Category } from '../../../shared/interfaces/category.interface';

export const CATEGORYCOLUMNS: TableColumn<Category>[] = [
  { key: 'name', header: 'Nombre' },
  { key: 'description', header: 'Descripción' },
  { key: 'actions', header: 'Acciones', width: '120px' },
];
