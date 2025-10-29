---
inclusion: fileMatch
fileMatchPattern: ['**/*form*.tsx', '**/*Form*.tsx', '**/actions/*.ts', '**/schemas/*.ts']
---

# Form Development Guidelines

## Core Requirements
- Write complete, production-ready forms with no placeholders or TODOs
- Implement dual validation: server-side (security) + client-side (UX)
- Use Server Actions for all form processing with proper error handling
- Follow progressive enhancement patterns for accessibility
- Integrate subscription limits and role-based access controls

## Architecture Patterns

### Server Actions (`app/actions/`)
```typescript
"use server"
// Extract FormData → Validate with Zod → Process → Return structured response
// Use revalidatePath/revalidateTag for cache invalidation
// Handle redirects after successful submissions
```

### Validation Schemas (`app/schemas/`)
- Create shared Zod schemas for client/server reuse
- Include business logic validation (subscription limits, role checks)
- Support field-level and form-level validation rules

### Form Components
- Use shadcn/ui Form + react-hook-form integration
- Follow FormField → FormItem → FormLabel → FormMessage pattern
- Implement loading states with pending indicators
- Support file uploads with S3 integration via custom hooks

## Business Logic Integration
- **Subscription Limits**: Free (5 products), Basic (20), Premium (unlimited)
- **Authentication**: Better-Auth session checks for protected forms
- **Payments**: Mercado Pago integration with webhook handling
- **Roles**: USER/BUSINESS/ADMIN/SUPER_ADMIN access controls

## Error Handling Standards
- Server-side: Try/catch blocks with user-friendly error messages
- Client-side: Field-level errors with ARIA attributes
- Use toast notifications for success/error feedback
- Provide bilingual error messages (Spanish/English)

## Performance & Accessibility
- Use `useActionState` for form state management
- Use `useOptimistic` for immediate UI feedback
- Implement debouncing for search/filter forms
- Ensure keyboard navigation and screen reader compatibility
- Support progressive enhancement (JavaScript-optional)

## File Organization
```
app/actions/[feature]-actions.ts     # Server Actions
app/schemas/[feature]-schema.ts      # Zod validation schemas
components/[feature]/[name]-form.tsx # Form components
```

## Common Form Types
- **Product Management**: Creation/editing with S3 image uploads
- **Authentication**: Sign-in/up, business setup, profile management
- **Business Dashboard**: Subscription management, analytics filters
- **Surveys**: Customer feedback collection and management