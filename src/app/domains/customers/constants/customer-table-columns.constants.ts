import { TableColumn } from '@shared/components/table';
import { Customer } from '@shared/interfaces/customer.interface';

export const CUSTOMER_TABLE_COLUMNS: TableColumn<Customer>[] = [
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
    header: 'Teléfono',
  },
  {
    key: 'actions',
    header: 'Acciones',
    width: '120px',
  },
];
