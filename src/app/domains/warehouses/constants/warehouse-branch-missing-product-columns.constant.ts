import { TableColumn } from '@shared/components/table';
import { WarehouseBranchProduct } from '../interfaces/warehouse-branch-product.interface';

export const WAREHOUSE_BRANCH_MISSING_PRODUCT_COLUMNS: TableColumn<WarehouseBranchProduct>[] = [
  { key: 'select', header: '', width: '56px' },
  { key: 'code', header: 'Codigo', width: '140px' },
  { key: 'name', header: 'Producto' },
  { key: 'category', header: 'Categoria' },
  { key: 'stock', header: 'Stock', width: '130px' },
  { key: 'lowStock', header: 'Stock minimo', width: '140px' },
];
