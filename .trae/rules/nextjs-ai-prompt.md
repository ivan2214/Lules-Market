---
inclusion: always
---

# Lules Market Development Guidelines

## Project Context
Lules Market is a local business platform with three-tier subscriptions (Free/Basic/Premium) enabling businesses to showcase products and customers to discover local merchants.

## Technology Stack
* **Next.js 16.0.0** with App Router, React 19.2.0, Turbopack
* **Cache Components** enabled for performance optimization
* **Better-Auth** for authentication with 7-day sessions
* **Prisma ORM** with PostgreSQL and custom output path (`app/generated/prisma`)
* **shadcn/ui** with Tailwind CSS v4 and Radix UI primitives
* **TypeScript 5** with strict typing
* **Biome** for linting/formatting (not ESLint/Prettier)
* **pnpm** as package manager

## Core Development Principles
* Write complete, production-ready code with no placeholders
* Follow kebab-case for files/folders, PascalCase for components
* Use Server Components by default, Client Components when needed
* Implement proper TypeScript interfaces and Zod validation
* Include all imports and maintain consistent code organization

## Architecture Patterns

### File Organization
* Use `@/` alias for root imports (components, lib, utils, etc.)
* Server Actions in `app/actions/`, data fetching in `app/data/`
* Validation schemas in `app/schemas/` using Zod
* Custom hooks in `hooks/`, utilities in `utils/`

### Authentication & Authorization
* Better-Auth handles sessions with USER/BUSINESS/ADMIN/SUPER_ADMIN roles
* Protected routes require middleware checks
* Business setup required after registration

### Database Patterns
* Prisma client generated to `app/generated/prisma`
* Use camelCase for fields, PascalCase for models
* Implement proper relations and constraints

### Component Standards
* One component per file with default export
* Co-locate types in same file when component-specific
* Use Class Variance Authority for component variants
* Implement proper loading states and error boundaries

### Code Quality Rules
* Prefix event handlers with "handle" (handleClick, handleSubmit)
* Use const arrow functions over function declarations
* Implement early returns for better readability
* Use descriptive variable names and proper TypeScript types
* Include accessibility features (ARIA labels, keyboard navigation)

## Business Logic Integration
* Implement subscription limits (Free: 5 products, Basic: 20, Premium: unlimited)
* Support Mercado Pago payment processing with webhook handling
* Enable AWS S3 file uploads with presigned URLs
* Create proper analytics tracking for business insights

## Performance & Optimization
* Leverage Cache Components for server-side caching
* Use React Compiler optimizations
* Implement proper image optimization with Next.js Image
* Follow Turbopack build patterns for fast development

## Styling Conventions
* Use Tailwind CSS v4 utility classes exclusively
* Follow shadcn/ui component patterns and theming
* Support dark mode with Next Themes
* Maintain consistent spacing and color tokens
* Avoid custom CSS files or inline styles