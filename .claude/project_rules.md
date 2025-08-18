# Bike Kitchen App - Development Rules

## Tech Stack
- Next.js 15 with App Router and TypeScript
- Turbopack for development builds
- Mantine UI components + Tailwind CSS (mobile-first)
- TanStack Query + Zustand for state management
- Supabase (PostgreSQL) + Drizzle ORM
- tRPC for type-safe APIs
- Supabase Auth for authentication

## Code Patterns

### Components
- Use arrow functions: `const Component = () => {}`
- Default export for all components
- TypeScript interfaces for all props
- Mobile-first Tailwind classes
- Mantine components over custom UI

### File Naming
- Components: PascalCase (e.g., `NavigationCard.tsx`)
- Hooks: camelCase with "use" prefix (e.g., `useBookings.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)
- Pages: lowercase with hyphens (e.g., `booking-form/page.tsx`)

### Mobile-First Design
- Always start with mobile layout (min-width approach)
- Touch targets minimum 44px
- Use Mantine responsive props: `size={{ base: 'sm', md: 'lg' }}`
- Bottom sheets for modals on mobile

### State Management
- TanStack Query for all server state
- Zustand for UI state (modals, navigation)
- Local useState for component-only state
- No prop drilling - use context sparingly

### Database & API
- Drizzle schema in `src/lib/db/schema.ts`
- tRPC routers in `src/lib/trpc/routers/`
- Supabase RLS for authorization
- Type-safe queries with Drizzle

## Color System
- Primary: Purple (#8b5cf6)
- Success: Green (#10b981)
- Error: Red/Pink (#ef4444)
- Neutral: Gray scale

## User Roles
- Guest: Can book appointments only
- Member: Booking + events + membership management
- Host: Member + daily operations + walk-ins + shifts
- Admin: Full system access + user management + events