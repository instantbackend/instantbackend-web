# AGENTS.md - Developer Guidelines

This file provides guidelines for agents working on this codebase.

## Project Overview

- **Project**: InstantBackend Web (Next.js landing page + dashboard)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query) + Context API
- **Path Alias**: `@/*` maps to project root

## Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production build
npm run build        # Build for production (static export)
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

**Note**: No test framework is currently configured. Do not add tests unless explicitly requested.

## Code Style Guidelines

### TypeScript

- Use explicit types for function parameters and return values when not obvious
- Enable strict mode (`strict: true` in tsconfig.json)
- Use `any` sparingly - prefer `unknown` or proper type guards
- Use `as` type assertions only when absolutely necessary

### React & Components

- Use functional components with hooks
- Use `"use client"` directive for client-side components
- Use `React.forwardRef` for components that need ref forwarding
- Use `class-variance-authority` for component variants (see button.tsx)
- Use `cn()` utility from `@/lib/utils` for conditional className merging

Example component structure:
```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const componentVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", outline: "..." },
    size: { default: "...", sm: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
});

export interface ComponentProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof componentVariants> {}

export const Component = React.forwardRef<HTMLDivElement, ComponentProps>(({ className, variant, size, ...props }, ref) => {
  return <div ref={ref} className={cn(componentVariants({ variant, size }), className)} {...props} />;
});
Component.displayName = "Component";
```

### Imports

- Use path alias `@/` for internal imports
- Group imports in this order: external libs, internal libs, components
- Use named exports for components
- Prefer separate imports over namespace imports

```tsx
// Good
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Avoid
import * as React from "react";
import { Button, Card, CardContent } from "@/components/ui";
```

### Naming Conventions

- **Components**: PascalCase (e.g., `SiteHeader`, `Button`)
- **Hooks**: camelCase starting with `use` (e.g., `useCollections`, `useRequireAuth`)
- **Utilities**: camelCase (e.g., `cn`, `formatPrice`)
- **Constants**: PascalCase for component-related, SCREAMING_SNAKE for config (e.g., `COLLECTION_LIMITS`)
- **Files**: kebab-case for pages, PascalCase for components

### Error Handling

- Use try/catch blocks for async operations
- Log errors with `console.error` including descriptive message
- Set user-facing error state in UI components
- Use meaningful error messages (not just "Error occurred")

```tsx
try {
  const data = await fetchData();
} catch (error) {
  console.error("Failed to fetch data:", error);
  setError("Unable to load data. Please try again.");
}
```

### Tailwind CSS

- Use Tailwind's utility classes directly in components
- Follow existing color scheme (slate for neutrals, brand for primary)
- Use semantic class names for custom styles when possible
- Define custom colors in `tailwind.config.ts`

### File Organization

```
app/                  # Next.js App Router pages
  app/               # Authenticated dashboard routes
  login/             # Auth pages
  layout.tsx         # Root layout
components/
  ui/                # Reusable UI components (Button, Card, Input, etc.)
  *.tsx              # Feature-specific components
lib/                  # Utilities and shared logic
hooks/                # Custom React hooks
contexts/             # React Context providers
```

### Next.js Specific

- Use Server Components by default (no "use client" directive)
- Add "use client" only when using hooks or browser APIs
- Use Next.js built-in components and routing
- Place shared types in `lib/` with `.ts` extension

### Environment Variables

- Never commit secrets to repository
- Use `.env.local` for local development
- Reference env vars with `process.env.NEXT_PUBLIC_*` for client-side access
- Use `env.sample` as template for required variables

## Common Patterns

### React Query Usage
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["resource", id],
  queryFn: async () => {
    if (!bf) throw new Error("Missing instance");
    return fetchResource(bf, id);
  },
  enabled: Boolean(bf && id),
});
```

### Conditional Rendering
```tsx
{isLoading && <LoadingSpinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}
```

### State with Derived Values
Use `useMemo` for expensive calculations:
```tsx
const effectiveValue = useMemo(() => {
  if (!data) return defaultValue;
  return processData(data);
}, [data]);
```
