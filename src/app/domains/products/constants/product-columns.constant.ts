import { TableColumn } from '../../../shared/components/table';
import { Product } from '../../../shared/interfaces/product.interface';

export const PRODUCT_COLUMNS: TableColumn<Product>[] = [
  { key: 'code', header: 'Código' },
  { key: 'name', header: 'Nombre' },
  { key: 'description', header: 'Descripción' },
  { key: 'category.name', header: 'Categoría' },
  { key: 'actions', header: 'Acciones', width: '120px' },
];
