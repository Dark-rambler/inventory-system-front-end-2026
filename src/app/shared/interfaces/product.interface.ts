import { Category } from './category.interface';

export interface Product {
  id: string;
  name: string;
  code: string;
  description: string;
  category: Omit<Category, 'createdAt' | 'updatedAt'>;
}
