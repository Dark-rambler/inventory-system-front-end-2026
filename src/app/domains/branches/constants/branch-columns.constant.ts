import { TableColumn } from '../../../shared/components/table';
import { Branch } from '../../../shared/interfaces/branch.interface';

export const BRANCHCOLUMNS: TableColumn<Branch>[] = [
  { key: 'name', header: 'Nombre' },
  { key: 'telephone', header: 'Teléfono' },
  { key: 'address', header: 'Dirección' },
  { key: 'city', header: 'Ciudad' },
  { key: 'actions', header: 'Acciones', width: '120px' },
];
