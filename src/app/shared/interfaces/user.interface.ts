export interface User {
  id: number;
  name: string;
  userName: string;
  email: string;
  role: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserForm {
  name: string;
  userName: string;
  email: string;
  roleId: number | string;
  password?: string;
}
