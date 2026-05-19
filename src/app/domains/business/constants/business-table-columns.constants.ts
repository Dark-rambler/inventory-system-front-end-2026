import { TableColumn } from '@shared/components/table';
import { Business } from '@shared/interfaces/business.interface';

export const BUSINESS_TABLE_COLUMNS: TableColumn<Business>[] = [
  {
    key: 'name',
    header: 'Nombre',
  },
  {
    key: 'nit',
    header: 'NIT',
  },
  {
    key: 'phone',
    header: 'Telefono',
  },
  {
    key: 'actions',
    header: 'Acciones',
    width: '120px',
  },
];
