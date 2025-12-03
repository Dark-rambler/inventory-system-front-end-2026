# InventorySystemFrontEnd

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.15.

## 🚀 Stack Tecnológico

- **Angular 19.2.0** - Framework principal
- **Angular CDK 19.2.19** - Component Development Kit
- **Tailwind CSS 3.4** - Framework de estilos utilitarios
- **TypeScript 5.7** - Lenguaje de programación
- **ESLint** - Linter de código
- **Prettier** - Formateador de código
- **Husky + lint-staged** - Pre-commit hooks

## 📋 Prerequisitos

- Node.js (versión 18 o superior)
- npm o yarn

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## 🎨 Formateo y Linting

### Formatear código

```bash
npm run format
```

### Verificar formato

```bash
npm run format:check
```

### Ejecutar linter

```bash
npm run lint
```

### Pre-commit hooks

El proyecto está configurado con Husky para ejecutar automáticamente:

- **Prettier** para formatear el código
- **ESLint** para verificar y corregir problemas de código

Estos se ejecutan automáticamente antes de cada commit, asegurando que el código siempre mantenga un estilo consistente.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## 📝 Extensiones Recomendadas de VS Code

El proyecto incluye recomendaciones de extensiones en `.vscode/extensions.json`:

- Angular Language Service
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
