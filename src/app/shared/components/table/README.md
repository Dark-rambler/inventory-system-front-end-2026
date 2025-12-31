# Componente de Tabla Genérica

Componente reutilizable de tabla construido con Angular CDK y Tailwind CSS, siguiendo el manual de marca de la aplicación.

## 📁 Ubicación

```
src/app/shared/components/table/
├── table.component.ts           # Componente principal
├── table.component.html         # Template
├── table.component.scss         # Estilos
├── table.types.ts              # Interfaces y tipos
├── index.ts                    # Barrel export
├── directives/
│   ├── table-column.directive.ts
│   └── table-cell-template.directive.ts
└── pipes/
    └── table-value.pipe.ts
```

## 🎯 Características

- ✅ **Tipado genérico**: Soporta cualquier tipo de dato `<T>`
- ✅ **Configuración flexible**: Columnas configurables via inputs
- ✅ **Proyección de contenido**: Templates personalizados con `ng-template`
- ✅ **Columna de acciones**: Botones personalizables (ver, editar, eliminar)
- ✅ **Estados**: Loading (skeleton) y vacío
- ✅ **Angular CDK**: Usa `CdkTable` para mejor rendimiento
- ✅ **Tailwind CSS**: Estilos siguiendo el manual de marca
- ✅ **SOLID**: Arquitectura modular y desacoplada

## 🎨 Manual de Marca

### Colores
- **Primary**: `#288B83`
- **Secondary**: `#A1CBC7`
- **Fondos**: `#FDFDFD`, `#EDF1F0`, `#F9F9F9`
- **Texto**: `#1E1E1E`

### Tipografía
- **Familia**: Inter
- **Header**: Semi-bold
- **Body**: Regular

### Estilos
- **Border radius**: 12px
- **Filas alternadas**: Habilitadas por defecto
- **Hover**: Fondo `#EDF1F0`
- **Transiciones**: 200ms ease

## 📖 Uso Básico

### 1. Importar el componente

```typescript
import { TableComponent, TableColumn, TableConfig, TableActionEvent } from '@shared/components/table';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [TableComponent],
  template: `...`
})
export class ExampleComponent { }
```

### 2. Definir el modelo de datos

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}
```

### 3. Configurar las columnas

```typescript
columns: TableColumn<Product>[] = [
  {
    key: 'id',
    header: 'ID',
    width: '80px'
  },
  {
    key: 'name',
    header: 'Nombre',
    width: '200px'
  },
  {
    key: 'price',
    header: 'Precio',
    valueGetter: (row) => `$${row.price.toFixed(2)}`
  },
  {
    key: 'actions',
    header: 'Acciones',
    cssClass: 'text-right'
  }
];
```

### 4. Configurar la tabla (opcional)

```typescript
tableConfig: TableConfig = {
  emptyMessage: 'No hay datos disponibles',
  showLoading: false,
  skeletonRows: 5,
  enableHover: true,
  enableStriped: true
};
```

### 5. Usar en el template

```html
<app-table
  [data]="products"
  [columns]="columns"
  [config]="tableConfig"
  (actionClick)="handleAction($event)">
</app-table>
```

## 🎨 Templates Personalizados

### Usando la directiva `appTableColumn`

```html
<app-table [data]="products" [columns]="columns">
  <!-- Template para la columna 'name' -->
  <ng-template appTableColumn="name" let-product>
    <div class="flex items-center gap-2">
      <img [src]="product.image" class="w-8 h-8 rounded">
      <span class="font-bold">{{ product.name }}</span>
    </div>
  </ng-template>

  <!-- Template para la columna 'status' -->
  <ng-template appTableColumn="status" let-product>
    <span class="px-2 py-1 rounded-full text-xs"
          [class.bg-green-100]="product.status === 'active'"
          [class.bg-red-100]="product.status === 'inactive'">
      {{ product.status }}
    </span>
  </ng-template>
</app-table>
```

### Variables de contexto disponibles

```typescript
let-row          // El objeto de la fila
let-i="index"    // Índice de la fila
let-first="first"  // Es primera fila
let-last="last"    // Es última fila
let-even="even"    // Índice es par
let-odd="odd"      // Índice es impar
```

## 🎬 Columna de Acciones

### Ejemplo completo con botones

```html
<ng-template appTableColumn="actions" let-product let-i="index">
  <div class="app-table-actions">
    <!-- Ver -->
    <button
      class="app-table-action-btn app-table-action-btn--view"
      (click)="handleAction({ action: 'view', row: product, index: i })"
      title="Ver detalles">
      <svg class="app-table-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </button>

    <!-- Editar -->
    <button
      class="app-table-action-btn app-table-action-btn--edit"
      (click)="handleAction({ action: 'edit', row: product, index: i })">
      <svg class="app-table-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>

    <!-- Eliminar -->
    <button
      class="app-table-action-btn app-table-action-btn--delete"
      (click)="handleAction({ action: 'delete', row: product, index: i })">
      <svg class="app-table-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
</ng-template>
```

### Manejador de acciones en el componente

```typescript
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
  }
}
```

## 🎨 Clases CSS para Botones

### Clases predefinidas

```scss
// Botones de acción
.app-table-action-btn--view      // Azul (info)
.app-table-action-btn--edit      // Verde/Primary (#288B83)
.app-table-action-btn--delete    // Rojo (danger)
.app-table-action-btn--primary   // Primary (#288B83)
.app-table-action-btn--secondary // Secondary (#A1CBC7)
.app-table-action-btn--outline   // Borde Primary
.app-table-action-btn--danger    // Rojo sólido

// Iconos
.app-table-action-icon           // Tamaño 4x4 (w-4 h-4)
```

## 📊 Estados de la Tabla

### Estado de carga (Loading)

```typescript
tableConfig: TableConfig = {
  showLoading: true,
  skeletonRows: 5  // Número de filas skeleton
};
```

### Estado vacío

Automático cuando `data` está vacío:

```typescript
data: Product[] = [];  // Mostrará el mensaje vacío
```

## 🔧 API Completa

### Inputs

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `data` | `T[]` | Array de datos a mostrar |
| `columns` | `TableColumn<T>[]` | Configuración de columnas |
| `config` | `TableConfig` | Configuración general |

### Outputs

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `actionClick` | `TableActionEvent<T>` | Emitido al hacer clic en acciones |

### Interfaces

```typescript
interface TableColumn<T> {
  key: string;
  header: string;
  cellTemplate?: TemplateRef<TableCellContext<T>>;
  cssClass?: string;
  width?: string;
  sortable?: boolean;
  valueGetter?: (row: T) => any;
}

interface TableConfig {
  emptyMessage?: string;
  showLoading?: boolean;
  skeletonRows?: number;
  enableHover?: boolean;
  enableStriped?: boolean;
}

interface TableActionEvent<T> {
  action: string;
  row: T;
  index: number;
}
```

## 🚀 Ejemplo Completo

Ver implementación completa en:
- **Componente**: [src/app/domains/products/products.component.ts](src/app/domains/products/products.component.ts)
- **Template**: [src/app/domains/products/products.component.html](src/app/domains/products/products.component.html)
- **Ruta**: `/products`

## 🎯 Principios SOLID Aplicados

1. **Single Responsibility**: Cada directiva y pipe tiene una única responsabilidad
2. **Open/Closed**: Extensible mediante templates sin modificar el código base
3. **Liskov Substitution**: Genéricos `<T>` permiten sustituir tipos
4. **Interface Segregation**: Interfaces específicas y pequeñas
5. **Dependency Inversion**: Depende de abstracciones (interfaces) no implementaciones

## 📝 Notas

- Requiere `@angular/cdk` instalado
- Usa Tailwind CSS para estilos
- Compatible con Angular 19+
- Modo standalone (sin NgModule)

## 🤝 Contribución

Para extender funcionalidad:
1. Crear nueva directiva en `directives/`
2. Crear nuevo pipe en `pipes/`
3. Exportar en `index.ts`
4. Documentar en este README
