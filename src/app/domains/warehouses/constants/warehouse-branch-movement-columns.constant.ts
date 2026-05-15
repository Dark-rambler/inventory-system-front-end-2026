import { TableColumn } from '@shared/components/table';
import { WarehouseBranchMovement } from '../interfaces/warehouse-branch-movement.interface';

export const WAREHOUSE_BRANCH_MOVEMENT_COLUMNS: TableColumn<WarehouseBranchMovement>[] = [
  { key: 'movementDate', header: 'Fecha', width: '180px' },
  { key: 'movementType', header: 'Tipo', width: '130px' },
  { key: 'productName', header: 'Producto' },
  { key: 'quantity', header: 'Cantidad', width: '120px' },
  { key: 'previousStock', header: 'Stock previo', width: '130px' },
  { key: 'currentStock', header: 'Stock actual', width: '130px' },
];
