# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the backend for "Grafit" — a portfolio/CMS platform for a design/architecture company. Built with NestJS and TypeScript, using PostgreSQL with TypeORM. See PLAN.md for the full development roadmap (in Russian).

The system manages:
- Users and authentication (JWT-based)
- Projects/portfolio items with categories
- CMS pages
- File uploads
- Contact form submissions

## Development Commands

```bash
# Install dependencies
npm install

# Development
npm run start:dev              # Watch mode (recommended for development)
npm run start:debug            # Debug mode with watch

# Building
npm run build                  # Compile TypeScript to dist/

# Production
npm run start:prod             # Run compiled code from dist/

# Testing
npm run test                   # Run unit tests
npm run test:watch             # Run tests in watch mode
npm run test:cov               # Generate coverage report
npm run test:e2e               # Run end-to-end tests
npm run test:debug             # Debug tests

# Code Quality
npm run lint                   # ESLint with auto-fix
npm run format                 # Prettier formatting

# Database Migrations
npm run migration:generate src/database/migrations/MigrationName  # Generate migration from entities
npm run migration:create src/database/migrations/MigrationName    # Create empty migration
npm run migration:run          # Run pending migrations
npm run migration:revert       # Revert last migration

# Database Seeds
npm run seed:admin             # Seed admin user (requires User entity)
npm run seed:contacts          # Seed initial contact settings (phone, email, address)
```

## Architecture

### Module Structure

Following NestJS conventions, each feature is organized as a module with:
- `*.module.ts` — module definition with imports, controllers, providers
- `*.controller.ts` — HTTP endpoints and routing
- `*.service.ts` — business logic
- `dto/` — Data Transfer Objects with validation decorators
- `entities/` — TypeORM database entities

Planned module hierarchy (from PLAN.md):
```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── config/                    # Configuration
├── database/                  # Migrations, seeds, data-source.ts
├── common/                    # Shared utilities, guards, decorators, filters
│   ├── decorators/           # @Roles, @CurrentUser
│   ├── dto/                  # PaginationDto, PaginatedResponseDto
│   ├── filters/              # HttpExceptionFilter
│   ├── guards/               # RolesGuard
│   ├── interceptors/         # TransformInterceptor
│   └── utils/                # slugify, etc.
├── auth/                     # JWT authentication
├── users/                    # User management
├── categories/               # Project categories
├── projects/                 # Portfolio projects
├── pages/                    # CMS pages
├── upload/                   # File upload handling
└── contacts/                 # Contact form submissions
```

### TypeScript Configuration

- Uses `nodenext` module resolution
- Decorators enabled (`experimentalDecorators`, `emitDecoratorMetadata`)
- Strict null checks enabled
- `noImplicitAny` is disabled (set to false)
- Output directory: `dist/`

### Code Style

**Prettier** (enforced via ESLint):
- Single quotes
- Trailing commas
- Auto end-of-line handling

**ESLint** (eslint.config.mjs):
- TypeScript recommended + type-checked rules
- Globals: Node.js + Jest
- Custom rules:
  - `@typescript-eslint/no-explicit-any`: off
  - `@typescript-eslint/no-floating-promises`: warn
  - `@typescript-eslint/no-unsafe-argument`: warn

### Database

TypeORM with PostgreSQL (planned):
- Entity files in `entities/` subdirectories
- Development: `synchronize: true` (auto-sync schema)
- Production: migrations via `typeorm` CLI using `data-source.ts`
- Configuration via `@nestjs/config` from environment variables

### API Structure

Global prefix: `/api` (configured in main.ts)

Route patterns:
- Public endpoints: `/api/{resource}` (e.g., `/api/projects`, `/api/pages/:slug`)
- Admin endpoints: `/api/admin/{resource}` (protected with JWT + role guards)
- Auth: `/api/auth/login`, `/api/auth/profile`

### Testing

- **Unit tests**: `*.spec.ts` files alongside source (Jest)
- **E2E tests**: `test/` directory with `jest-e2e.json` config
- Test rootDir: `src/`
- Coverage output: `coverage/`

## Key Dependencies

- `@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express` — NestJS framework
- `reflect-metadata`, `rxjs` — required by NestJS
- `typescript`, `ts-node`, `ts-jest` — TypeScript tooling

Planned additions (see PLAN.md):
- `@nestjs/config`, `@nestjs/typeorm`, `typeorm`, `pg`
- `@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`
- `class-validator`, `class-transformer`
- `bcrypt` (password hashing)
- `multer`, `sharp` (file uploads)
- `@nestjs/swagger` (API documentation)

## Generating Resources

Use NestJS CLI schematics:
```bash
# Generate a complete resource (module + controller + service + DTO + entity)
nest g resource <name>

# Generate individual components
nest g module <name>
nest g controller <name>
nest g service <name>
```

## Important Notes

- The server listens on port 3000 by default (or `process.env.PORT`)
- CORS will be configured in main.ts (origins from .env)
- Global validation pipe will be enabled with `whitelist: true`, `transform: true`
- All authentication uses JWT tokens in Authorization headers
- Role-based access control uses custom `@Roles()` decorator and `RolesGuard`
