import { TableColumn } from '../../../shared/components/table';
import { Supplier } from '../../../shared/interfaces/supplier.interface';

export const SUPPLIER_COLUMNS: TableColumn<Supplier>[] = [
  { key: 'name', header: 'Proveedor' },
  { key: 'contact', header: 'Contacto' },
  { key: 'telephone', header: 'Teléfono' },
  { key: 'email', header: 'Correo' },
  { key: 'city', header: 'Ciudad' },
  { key: 'createdAt', header: 'Registro' },
  { key: 'actions', header: 'Acciones', width: '120px' },
];
