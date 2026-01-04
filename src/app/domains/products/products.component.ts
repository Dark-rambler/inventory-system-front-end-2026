import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  TableActionEvent,
  TableColumn,
  TableColumnDirective,
  TableComponent,
  TableConfig,
} from '../../shared/components/table';

/**
 * Interface para el modelo de producto
 */
interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive' | 'discontinued';
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, TableComponent, TableColumnDirective],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  /** Datos mock de productos */
  products: Product[] = [];

  /** Configuración de columnas de la tabla */
  columns: TableColumn<Product>[] = [];

  /** Configuración general de la tabla */
  tableConfig: TableConfig = {
    emptyMessage: 'No se encontraron productos',
    showLoading: false,
    skeletonRows: 5,
    enableHover: true,
    enableStriped: true,
  };

  ngOnInit(): void {
    this.initializeColumns();
    this.loadMockData();
  }

  /**
   * Inicializa la configuración de columnas
   */
  private initializeColumns(): void {
    this.columns = [
      {
        key: 'id',
        header: 'ID',
        width: '80px',
      },
      {
        key: 'name',
        header: 'Nombre del Producto',
        width: '250px',
      },
      {
        key: 'sku',
        header: 'SKU',
        width: '150px',
      },
      {
        key: 'price',
        header: 'Precio',
        width: '120px',
        valueGetter: row => `$${row.price.toFixed(2)}`,
      },
      {
        key: 'stock',
        header: 'Stock',
        width: '100px',
      },
      {
        key: 'status',
        header: 'Estado',
        width: '150px',
      },
      {
        key: 'actions',
        header: 'Acciones',
        width: '150px',
        cssClass: 'text-right',
      },
    ];
  }

  /**
   * Carga datos mock de productos
   */
  private loadMockData(): void {
    this.products = [
      {
        id: 1,
        name: 'Laptop Dell XPS 15',
        sku: 'DELL-XPS-15-001',
        price: 1299.99,
        stock: 15,
        status: 'active',
      },
      {
        id: 2,
        name: 'Mouse Logitech MX Master 3',
        sku: 'LOG-MX3-002',
        price: 99.99,
        stock: 45,
        status: 'active',
      },
      {
        id: 3,
        name: 'Teclado Mecánico Keychron K8',
        sku: 'KEY-K8-003',
        price: 89.99,
        stock: 0,
        status: 'inactive',
      },
      {
        id: 4,
        name: 'Monitor LG UltraWide 34"',
        sku: 'LG-UW34-004',
        price: 599.99,
        stock: 8,
        status: 'active',
      },
      {
        id: 5,
        name: 'Webcam Logitech C920',
        sku: 'LOG-C920-005',
        price: 79.99,
        stock: 22,
        status: 'active',
      },
      {
        id: 6,
        name: 'Auriculares Sony WH-1000XM4',
        sku: 'SONY-WH4-006',
        price: 349.99,
        stock: 12,
        status: 'active',
      },
      {
        id: 7,
        name: 'Disco Duro Externo Seagate 2TB',
        sku: 'SEA-2TB-007',
        price: 79.99,
        stock: 5,
        status: 'discontinued',
      },
      {
        id: 8,
        name: 'Hub USB-C Anker',
        sku: 'ANK-USBC-008',
        price: 49.99,
        stock: 30,
        status: 'active',
      },
    ];
  }

  /**
   * Maneja las acciones de la tabla
   */
  handleAction(event: TableActionEvent<Product>): void {
    const { action, row, index } = event;

    switch (action) {
      case 'view':
        this.viewProduct(row);
        break;
      case 'edit':
        this.editProduct(row);
        break;
      case 'delete':
        this.deleteProduct(row, index);
        break;
      default:
        console.warn(`Acción no reconocida: ${action}`);
    }
  }

  /**
   * Ver detalles del producto
   */
  private viewProduct(product: Product): void {
    console.log('Ver producto:', product);
    // Aquí se implementaría la navegación o modal de detalles
    alert(`Ver detalles de: ${product.name}`);
  }

  /**
   * Editar producto
   */
  private editProduct(product: Product): void {
    console.log('Editar producto:', product);
    // Aquí se implementaría la navegación al formulario de edición
    alert(`Editar: ${product.name}`);
  }

  /**
   * Eliminar producto
   */
  private deleteProduct(product: Product, index: number): void {
    const confirmed = confirm(`¿Estás seguro de eliminar "${product.name}"? con ID: ${index}`);

    if (confirmed) {
      this.products = this.products.filter(p => p.id !== product.id);
      console.log('Producto eliminado:', product);
    }
  }

  /**
   * Obtiene la clase CSS según el estado del producto
   */
  getStatusClass(status: Product['status']): string {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      discontinued: 'bg-red-100 text-red-800',
    };
    return statusClasses[status] || '';
  }

  /**
   * Obtiene el texto traducido del estado
   */
  getStatusText(status: Product['status']): string {
    const statusTexts = {
      active: 'Activo',
      inactive: 'Inactivo',
      discontinued: 'Descontinuado',
    };
    return statusTexts[status] || status;
  }

  /**
   * Obtiene la clase CSS según el nivel de stock
   */
  getStockClass(stock: number): string {
    if (stock === 0) return 'text-red-600 font-semibold';
    if (stock < 10) return 'text-yellow-600 font-medium';
    return 'text-green-600';
  }
}
