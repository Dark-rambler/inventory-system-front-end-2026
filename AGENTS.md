# Agent Guidelines for Inventory System Frontend

This document provides guidelines for AI agents working on this Angular 19 project.

## Project Overview

- **Framework**: Angular 19 (standalone components)
- **Language**: TypeScript 5.7
- **Styling**: SCSS + Tailwind CSS
- **Testing**: Jasmine + Karma
- **Linting**: ESLint + Prettier
- **Package Manager**: npm

## Build/Lint/Test Commands

### Development

```bash
npm start          # Start dev server (ng serve)
npm run watch      # Build with watch mode (development)
```

### Build

```bash
npm run build      # Production build (ng build)
```

### Testing

```bash
npm test           # Run all tests (ng test)
```

To run a **single test file**, use:

```bash
npm test -- --include="**/category.service.spec.ts"
```

To run tests in watch mode:

```bash
npm test -- --watch
```

### Linting & Formatting

```bash
npm run lint       # Run ESLint (ng lint)
npm run format     # Format code with Prettier
npm run format:check  # Check formatting without fixing
```

## Code Style Guidelines

### General

- Use **strict TypeScript** (`strict: true` in tsconfig.json)
- Enable all strict compiler options
- Use **standalone components** (Angular 19 default)

### Imports

- Use **path aliases** from tsconfig.json when available
- Use **barrel exports** (`index.ts`) for cleaner imports
- Order imports: external (Angular, RxJS), then internal (shared, domains)
- Use **absolute imports** for app paths: `@app/`, `@shared/`, `@env/`

### Naming Conventions

| Type                  | Convention                             | Example                          |
| --------------------- | -------------------------------------- | -------------------------------- |
| Components            | kebab-case (files), PascalCase (class) | `category-table.component.ts`    |
| Directives            | kebab-case (files), PascalCase (class) | `open-delete-modal.directive.ts` |
| Services              | kebab-case (files), PascalCase (class) | `category.service.ts`            |
| Interfaces            | PascalCase with suffix                 | `Category`, `PaginatorInterface` |
| Constants             | SCREAMING_SNAKE_CASE                   | `DEFAULT_CATEGORY_PARAMS`        |
| Directives (selector) | attribute, camelCase                   | `[appOpenDeleteModal]`           |
| Component (selector)  | element, kebab-case                    | `<app-category-table>`           |

### Component Structure

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
})
export class ExampleComponent {
  private readonly _service = inject(Service);
}
```

### Dependency Injection

- Use **functional injection** (`inject()`) instead of constructor injection
- Use **private readonly** for injected dependencies
- Prefix private members with underscore: `_service`, `_httpClient`

### Types

- Avoid `any` - use proper types
- Use **interfaces** for object shapes
- Use **type** for unions, aliases
- Enable strict null checks

### Error Handling

- Use **RxJS error handling** (`catchError`, `throwError`)
- Handle HTTP errors with proper error types
- Display user-friendly error messages via components

### Templates (HTML)

- Use **control flow syntax** (`@if`, `@for`, `@switch`) - Angular 17+
- Avoid `*ngIf` and `*ngFor` - use new control flow
- Use **async pipe** for observable subscriptions
- Prefer **signal-based** patterns for reactivity (Angular 17+)

### Styling

- Use **Tailwind CSS** utility classes
- Use **SCSS** for component-specific styles
- Follow Tailwind config theme tokens (colors, spacing, etc.)
- Custom colors are defined in `tailwind.config.js`

### Testing

- Place tests alongside components: `*.component.spec.ts`
- Use **TestBed** for component testing
- Follow Jasmine naming: `describe`, `it`, `expect`
- Use `fixture.detectChanges()` after setting input properties
- Use `fakeAsync`, `tick` for async operations

### Git/Hooks

- Husky is configured for pre-commit hooks
- Lint-staged runs ESLint + Prettier on staged files
- Ensure all checks pass before committing

## Project Structure

```
src/
├── app/
│   ├── domains/          # Feature domains (categories, products, etc.)
│   │   └── <domain>/
│   │       ├── components/
│   │       ├── services/
│   │       ├── interfaces/
│   │       └── constants/
│   ├── shared/           # Shared components, directives, services
│   │   ├── components/
│   │   ├── directives/
│   │   ├── services/
│   │   ├── interfaces/
│   │   └── utils/
│   └── environments/      # Environment configs
├── styles.scss           # Global styles
└── index.html
```

## Tailwind Configuration

Custom design tokens are in `tailwind.config.js`:

- **Colors**: primary, secondary, success, warning, danger, info
- **Typography**: Inter font family, custom text sizes
- **Components**: button heights (btn-lg, btn-md, btn-sm)
- **Animations**: fade-in, slide-in, bounce-in

## ESLint Configuration

- Extends: ESLint recommended, TypeScript recommended, Angular recommended
- Prefix: `app` for selectors
- Uses `eslint-config-prettier` to avoid conflicts with Prettier
