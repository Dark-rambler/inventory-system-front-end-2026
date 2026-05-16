import { TableColumn } from '@shared/components/table';
import { Product } from '@shared/interfaces/product.interface';

export const BRANCH_MISSING_PRODUCTS_COLUMNS: TableColumn<Product>[] = [
  { key: 'select', header: '', width: '56px' },
  { key: 'code', header: 'Codigo', width: '140px' },
  { key: 'name', header: 'Producto' },
  { key: 'category', header: 'Categoria' },
  { key: 'price', header: 'Precio', width: '140px' },
  { key: 'stock', header: 'Stock', width: '130px' },
  { key: 'lowStock', header: 'Stock minimo', width: '140px' },
];
