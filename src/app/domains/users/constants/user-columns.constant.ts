import { TableColumn } from '../../../shared/components/table';
import { User } from '../../../shared/interfaces/user.interface';

export const USERCOLUMNS: TableColumn<User>[] = [
  { key: 'name', header: 'Nombre' },
  { key: 'userName', header: 'Usuario' },
  { key: 'email', header: 'Correo electrónico' },
  { key: 'role', header: 'Rol' },
  { key: 'actions', header: 'Acciones', width: '120px' },
];
