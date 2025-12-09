# Technology Stack

## Framework & Runtime
- **Next.js 16.0.0** with App Router and React 19.2.0
- **TypeScript 5** for type safety
- **Turbopack** for fast development and builds
- **React Compiler** enabled for optimization
- **Cache Components** enabled for performance

## Database & ORM
- **PostgreSQL** as primary database
- **Drizzle ORM**

## Authentication & Security
- **Better-Auth** for authentication system
- Email/password authentication with auto sign-in
- Session management with 7-day expiration
- Security headers configured in Next.js config

## UI & Styling
- **Tailwind CSS v4** for styling
- **Shadcn/UI** component library with Radix UI primitives
- **Lucide React** for icons
- **Next Themes** for theme management
- **Class Variance Authority** for component variants

## Forms & Validation
- **React Hook Form** with **@hookform/resolvers**
- **TanStack React Form** for advanced form handling
- **Zod v4** for schema validation

## Payment Processing
- **Mercado Pago SDK** for payment processing
- Webhook handling for payment status updates

## File Storage
- **AWS S3** with presigned URLs for image uploads
- **React Dropzone** for file upload UI

## Data Visualization
- **Recharts** for analytics charts and graphs

## Development Tools
- **Biome** for linting and formatting (replaces ESLint/Prettier)
- **pnpm** as package manager
- **tsx** for TypeScript execution

## Common Commands

```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production with Turbopack
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Drizzle client
pnpm db:migrate       # Push schema changes to database
pnpm db:studio        # Open Drizzle Studio GUI
pnpm db:seed          # Seed database with initial data

# Code Quality
pnpm lint             # Run Biome linter
pnpm format           # Format code with Biome
pnpm type-check       # TypeScript type checking

```

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Auth encryption key
- `BETTER_AUTH_URL` - Auth service URL
- `NEXT_PUBLIC_MP_PUBLIC_KEY` - Mercado Pago public key
- `MP_ACCESS_TOKEN` - Mercado Pago access token
- AWS S3 credentials for file uploads