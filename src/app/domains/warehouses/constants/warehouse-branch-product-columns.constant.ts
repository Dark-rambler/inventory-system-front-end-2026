import { TableColumn } from '@shared/components/table';
import { WarehouseBranchProduct } from '../interfaces/warehouse-branch-product.interface';

export const WAREHOUSE_BRANCH_PRODUCT_COLUMNS: TableColumn<WarehouseBranchProduct>[] = [
  { key: 'code', header: 'Codigo', width: '140px' },
  { key: 'name', header: 'Producto' },
  { key: 'categoryName', header: 'Categoria' },
  { key: 'stock', header: 'Stock', width: '120px' },
];
