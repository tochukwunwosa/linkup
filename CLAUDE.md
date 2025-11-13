# Tech Linkup - Claude Code Documentation

> Comprehensive architecture and development guide for Claude Code instances working on Tech Linkup

## Project Overview

Tech Linkup is a Next.js 15 application for discovering and managing tech events in Nigeria. It provides a public-facing event discovery platform and an admin dashboard for event management.

**Live Site**: https://techup-linkup.vercel.app
**Tech Stack**: Next.js 15, React 19, TypeScript, Supabase, Tailwind CSS 4

## Technology Stack

### Core Framework
- **Next.js 15.5.6** (App Router with React Server Components)
- **React 19** with React DOM 19
- **TypeScript 5**
- **Node.js 18+** (recommended)

### Database & Authentication
- **Supabase** (PostgreSQL with Row Level Security)
  - @supabase/ssr for SSR support
  - @supabase/supabase-js 2.49.9
- Authentication: Supabase Auth (email/password for admins only)
- Database client functions in lib/supabase/

### UI & Styling
- **Tailwind CSS 4** (latest version)
- **shadcn/ui** components (Radix UI primitives)
- **Lucide React** for icons
- **next-themes** for dark mode support (configured but not fully implemented)
- **Sonner** for toast notifications
- **Recharts** for data visualization

### Forms & Validation
- **React Hook Form** 7.58.1
- **Zod** 3.25.67 (schema validation)
- **@hookform/resolvers** for Zod integration

### Other Key Libraries
- **axios** 1.12.0+ (HTTP client, recently updated for security)
- **date-fns** 4.1.0 (date manipulation)
- **luxon** 3.6.1 (timezone handling)
- **react-intersection-observer** (infinite scroll)
- **@tanstack/react-table** (data tables in admin)

### External APIs
- **OpenCage Geocoding API** - Convert addresses to lat/lng and city/country
- **Google Maps API** - For location features (configured but usage TBD)
- **Umami Analytics** - Privacy-focused analytics

### Development Tools
- **ESLint** with Next.js config
- **Supabase CLI** 2.26.9 (for migrations)
- Turbopack for dev server (next dev --turbopack)


## Project Structure

linkup/
├── app/                          # Next.js App Router
│   ├── actions/                  # Server Actions
│   │   ├── admin/               # Admin auth & management
│   │   ├── event/               # Event CRUD operations
│   │   ├── user/                # User management (future)
│   │   └── cron/                # Cron job actions
│   ├── admin/                    # Admin routes
│   │   ├── login/               # Admin login page
│   │   └── dashboard/           # Protected admin dashboard
│   │       ├── layout.tsx       # Dashboard layout with sidebar
│   │       ├── page.tsx         # Dashboard home (charts & stats)
│   │       ├── events/          # Event management
│   │       ├── admins/          # Admin user management
│   │       ├── profile/         # Admin profile
│   │       └── settings/        # App settings
│   ├── api/                      # API Routes
│   │   ├── admin/               # Admin creation endpoint
│   │   ├── events/              # Event listing API
│   │   ├── geocode/             # Geocoding API
│   │   └── cron/                # Cron job endpoints
│   ├── constants/                # App constants (categories, etc.)
│   ├── client-layout.tsx         # Client-side layout wrapper
│   ├── layout.tsx                # Root layout (server)
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── ui/                       # shadcn/ui components (31 components)
│   ├── admin/                    # Admin-specific components
│   ├── dashboard/                # Dashboard layout components
│   ├── event/                    # Event-related components
│   ├── location/                 # Location & geolocation
│   ├── filters.tsx               # Event filtering UI
│   ├── events-grid.tsx           # Event listing with infinite scroll
│   ├── event-card.tsx            # Individual event card
│   └── navbar.tsx                # Main site navbar
│
├── context/                      # React Context providers
│   ├── EventContext.tsx          # Global event filters & state
│   ├── EventUrlSync.tsx          # Sync filters with URL params
│   └── AdminContext.tsx          # Admin user context
│
├── hooks/                        # Custom React hooks
│   ├── useInfinteScrollEvent.ts  # Infinite scroll for events
│   ├── useInViewAnimation.ts     # Intersection observer animations
│   ├── use-debounce.ts           # Debouncing utility
│   └── use-mobile.ts             # Mobile detection
│
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase client setup
│   ├── validations/              # Zod schemas
│   ├── geocode/                  # Geocoding utilities
│   ├── rate-limit.ts             # In-memory rate limiting
│   ├── filter-helper.ts          # Event filtering logic
│   ├── format-currency.ts        # Currency formatting
│   ├── metadata.ts               # SEO metadata config
│   └── utils.ts                  # General utilities
│
├── types/                        # TypeScript type definitions
├── sql/                          # SQL schemas
├── supabase/migrations/          # Database migrations
├── public/assets/                # Static assets
├── middleware.ts                 # Next.js middleware (auth)
├── next.config.ts                # Next.js configuration
├── components.json               # shadcn/ui configuration
└── package.json                  # Dependencies


## Database Architecture

### Database: Supabase (PostgreSQL)

#### Tables

**1. admins table**
- id: uuid (primary key)
- email: text (unique, not null)
- name: text (not null)
- role: text ('admin' | 'super_admin')
- invited_by: text
- created_at: timestamptz
- last_login: timestamptz (updated by middleware)

**2. events table**
- id: serial (primary key)
- title: text (not null)
- start_date: date (not null)
- end_date: date (nullable)
- location: text (not null)
- time: text (not null)
- type: text ('Online' | 'In-person' | 'In-person & Online')
- category: text[] (array of strings)
- price: text (nullable)
- currency: text (default: 'NGN')
- price_amount: text (nullable)
- description: text (not null)
- publish_status: text ('Published' | 'Draft')
- link: text (nullable)
- city: text (nullable, from geocoding)
- country: text (nullable, from geocoding)
- lat: numeric (nullable, from geocoding)
- lng: numeric (nullable, from geocoding)
- created_by: uuid (references admins.id)
- created_at: timestamptz

**3. public_events (view)**
- Filters events to only show published events
- Used for public-facing queries

#### Row Level Security (RLS)
- All tables have RLS enabled
- Admins can only access data when authenticated
- Super admins have additional privileges (e.g., admin management)
- Public can read from public_events view

#### Database Functions
- search_events_by_categories(keywords text[]) - Full-text search for events by categories

### Supabase Client Setup

**Server-side** (lib/supabase/server.ts):
```typescript
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll, setAll } }
  )
}
```

**Usage in Server Actions**:
```typescript
"use server"
const supabase = await createClient()
const { data, error } = await supabase.from('events').select('*')
```


## Authentication & Authorization

### Authentication Flow

1. **Admin Login** (app/admin/login/page.tsx):
   - Email/password authentication via Supabase Auth
   - Server action: adminLogin() in app/actions/admin/authAdmin.ts
   - Rate limited: 5 attempts per email per minute
   - Sets HTTP-only cookie for session

2. **Session Management**:
   - Middleware (middleware.ts) validates session on every request
   - Updates last_login timestamp in admins table
   - Refreshes auth cookie via lib/supabase/middleware.ts

3. **Route Protection**:
   - /admin/* routes redirect to /admin/login if unauthenticated
   - If authenticated but not admin → redirect to home
   - If admin at /admin/login → redirect to /admin/dashboard

4. **Logout**:
   - Server action: logoutAdmin() performs global sign-out
   - Clears all sessions across devices
   - Redirects to login page

### Authorization Levels

- **Super Admin** (role: 'super_admin'):
  - Full access to all features
  - Can create/edit/delete other admins
  - Can manage all events
  
- **Admin** (role: 'admin'):
  - Can manage events
  - Can view own profile
  - Cannot manage other admins

### Protected Server Actions Pattern

All server actions follow this pattern:

```typescript
export async function protectedAction(data) {
  const supabase = await createClient()
  
  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }
  
  // 2. Verify admin status
  const { data: admin } = await supabase
    .from("admins")
    .select("*")
    .eq("id", user.id)
    .single()
  
  if (!admin) return { error: "Unauthorized" }
  
  // 3. Check role if needed
  if (admin.role !== 'super_admin') {
    return { error: "Requires super admin" }
  }
  
  // 4. Perform action
  // ...
}
```


## Event Management System

### Event Data Flow

**Public Event Discovery**:
1. User lands on home page (app/page.tsx)
2. Filters component (components/filters.tsx) manages filter state
3. State stored in EventContext (category, format, location, date)
4. EventUrlSync syncs filters with URL query params
5. useInfiniteScrollEvents hook fetches paginated events
6. API route /api/events calls server action
7. Server action getPaginatedFilteredEvents queries database
8. Events displayed in EventsGrid component with infinite scroll

**Admin Event Management**:
1. Admin navigates to /admin/dashboard/events
2. Table displays all events (published + drafts)
3. Create/Edit forms use React Hook Form + Zod validation
4. Server actions: createEventAction, updateEventAction, deleteEventAction
5. Geocoding happens on create/update (address → lat/lng/city/country)
6. revalidatePath() triggers cache invalidation

### Event Filtering Logic

Located in app/actions/event/getPaginatedFilteredEvents.ts:

1. **Category Filter** (uses RPC function):
   - If categories selected, calls search_events_by_categories RPC
   - Otherwise fetches all events from public_events view

2. **In-Memory Filters** (format, location, date, city, country):
   - Applied after category filter to reduce dataset
   - More flexible than SQL for complex logic

3. **User Proximity Sorting**:
   - Events grouped: Same city > Same country > Nearby (≤1000km) > Others
   - Uses haversine distance formula (lib/utils.ts)
   - Requires user location from browser geolocation

4. **Pagination**:
   - Default: 9 events per page
   - Returns { data, hasMore, total }

### Infinite Scroll Implementation

Hook: hooks/useInfinteScrollEvent.ts

**Key Features**:
- Uses react-intersection-observer for scroll detection
- Aggressive prefetching (rootMargin: 1500px)
- Automatic page 2 prefetch after page 1 loads
- Observer placed 6 items from end of list
- Filters reset triggers new fetch from page 1

**Usage Pattern**:
```typescript
const { events, observerRef, hasMore, loading } = useInfiniteScrollEvents({ filters })

// In component:
{events.map((event, index) => {
  const shouldPlaceObserver = hasMore && index === Math.max(0, events.length - 6)
  return (
    <>
      <EventCard event={event} />
      {shouldPlaceObserver && <div ref={observerRef} />}
    </>
  )
})}
```

### Geocoding System

**Location**: lib/geocode/

**Flow**:
1. Admin enters address in event form
2. On save, serverGeocodeAddress() calls OpenCage API
3. Returns: { city, country, lat, lng }
4. Stored in database with event
5. Used for proximity sorting and location filtering

**Rate Limiting**:
- Geocoding API: 20 requests per IP per minute
- Implemented in app/api/geocode/route.ts


## State Management

### Global State (React Context)

**1. EventContext** (context/EventContext.tsx):
```typescript
{
  filters: {
    category: string[]
    format: "all" | "online" | "in-person"
    location: string  // Nigerian state or "all"
    date: "all" | "today" | "week" | "month"
    city: string
    country: string
  }
  setFilters: (update: Partial<Filters>) => void
  totalEventsFound: number
  userLocation: { city, country, lat, lng } | null
}
```

**2. AdminContext** (context/AdminContext.tsx):
```typescript
{
  id: string
  email: string
  name: string
  role: "admin" | "super_admin"
  invited_by: string
  last_login: string
}
```

**3. EventUrlSync** (context/EventUrlSync.tsx):
- Syncs EventContext filters with URL query parameters
- Enables shareable filtered views
- Uses useSearchParams and useRouter

### Local Component State

- Forms: React Hook Form state
- UI toggles: useState (modals, dropdowns, etc.)
- Data fetching: useState + useEffect pattern
- Admin dashboard: Local state for charts data


## API Routes & Server Actions

### API Routes (app/api/*)

**GET /api/events**:
- Public endpoint for paginated event listing
- Query params: page, limit, category[], format, location, date, city, country
- Calls getPaginatedFilteredEvents server action

**POST /api/geocode**:
- Geocodes address or lat/lng to city/country
- Rate limited: 20 req/IP/min
- Uses OpenCage API

**POST /api/admin**:
- Creates initial super admin
- Protected by INITIAL_SETUP_TOKEN env variable
- Disabled after setup (token = "CHANGE_THIS_TO_ENABLE")

**POST /api/cron/update-geolocations**:
- Backfills geocoding for existing events
- Protected by CRON_SECRET Bearer token

**POST /api/cron/backfill-events**:
- Future use for event data imports
- Protected by CRON_SECRET Bearer token

### Server Actions (app/actions/*)

**Admin Actions**:
- authAdmin.ts: Login/logout
- createAdmin.ts: Create new admin (super admin only)
- updateAdmin.ts: Update admin details, password (with re-auth)
- deleteAdmin.ts: Delete admin (super admin only)
- getCurrentAdmin.ts: Get logged-in admin
- getAllActiveAdmin.ts: List all admins (super admin only)

**Event Actions**:
- createEvent.ts: Create event with geocoding
- updateEvent.ts: Update event with geocoding
- deleteEvent.ts: Delete event
- getAllActiveEvents.ts: Get all events (admin view)
- getPaginatedFilteredEvents.ts: Paginated filtered events (public + admin)

**Cron Actions**:
- updateEventGeolocations.ts: Batch geocode events


## Security Implementation

> See SECURITY_FIXES.md for detailed security documentation

### Security Features

1. **Content Security Policy** (CSP):
   - Configured in next.config.ts
   - Prevents XSS attacks
   - Allows: self, Supabase, OpenCage, Umami analytics

2. **Rate Limiting** (lib/rate-limit.ts):
   - In-memory store (suitable for single-instance deployments)
   - Admin login: 5 attempts/email/min
   - Geocoding: 20 requests/IP/min
   - TODO: Migrate to Redis for multi-instance production

3. **Strong Password Validation**:
   - Min 12 characters
   - 1 uppercase, 1 lowercase, 1 number, 1 special char
   - Enforced in lib/validations/auth.ts and admin.ts

4. **Protected Endpoints**:
   - Admin creation: Requires INITIAL_SETUP_TOKEN
   - Cron jobs: Require CRON_SECRET Bearer token
   - All admin routes: Require authentication + admin role

5. **Re-authentication for Sensitive Operations**:
   - Password changes require current password
   - Prevents session hijacking attacks

6. **Dependency Security**:
   - All dependencies updated (0 vulnerabilities)
   - Regular npm audit checks

7. **Security Headers**:
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Referrer-Policy: strict-origin-when-cross-origin

### Environment Variables

Required (see .env.example):
```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Security
INITIAL_SETUP_TOKEN=  # Set to "CHANGE_THIS_TO_ENABLE" after setup
CRON_SECRET=

# Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=

# Site
NEXT_PUBLIC_SITE_URL=

# Geocoding
OPENCAGE_API_KEY=

# Future use
GOOGLE_MAPS_API_KEY=
```


## UI/UX Patterns

### Component Library: shadcn/ui

**Installed Components** (31 total):
- Forms: Button, Input, Textarea, Label, Select, Checkbox, Radio, Switch
- Layout: Card, Separator, Tabs, Sheet, Drawer, Sidebar
- Feedback: Toast (Sonner), Alert, AlertDialog, Dialog, Skeleton
- Data: Table, Calendar, DatePicker, Popover, Command
- Misc: Avatar, Badge, Tooltip, DropdownMenu, Chart
- Custom: MultiTagInput, LoadingTable

**Configuration**: components.json
- Style: "new-york"
- Base color: "neutral"
- Icons: Lucide React
- CSS variables: Enabled
- Aliases: @/components, @/lib, @/hooks

### Styling Conventions

**Tailwind Classes**:
- Container max-width: max-w-7xl
- Padding: px-4 sm:px-6 lg:px-8
- Text hierarchy: text-2xl md:text-3xl (responsive)
- Color palette: Neutral grays + blue accents
- Animations: Framer Motion (via tw-animate-css)

**Dark Mode**:
- Configured with next-themes
- Theme provider in client-layout.tsx
- CSS variables in globals.css
- Not fully implemented across all pages

### Responsive Design

**Breakpoints** (Tailwind defaults):
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

**Mobile-First Patterns**:
- Filters: Collapsible on mobile, inline on desktop
- Grid layouts: 1 col → 2 col → 3 col
- Navigation: Hamburger menu (future) → full navbar
- Sidebar: Collapsible icon mode on smaller screens

### Key UI Components

**EventCard** (components/event-card.tsx):
- Displays event info with badges, date, location, price
- "Add to Calendar" and "Read More" actions
- Currency conversion display
- Animated on scroll (via AnimatedCard)

**Filters** (components/filters.tsx):
- Sticky header (desktop)
- Multi-tag input for categories with autocomplete
- Nigerian states combobox
- Clear all filters button

**EventsGrid** (components/events-grid.tsx):
- Infinite scroll container
- Skeleton loading states
- Empty state with icon + message

**Admin Dashboard** (app/admin/dashboard/page.tsx):
- Stats cards (total events, published, online, in-person)
- Recharts: Line chart (trends), Pie chart (distribution), Bar chart (categories)
- Recent activity feed
- Tabs: Overview / Analytics


## Common Development Tasks

### Running the App

```bash
# Development
npm run dev  # Uses Turbopack

# Production build
npm run build
npm start

# Linting
npm run lint
```

### Adding a New Event Category

1. Update app/constants/categories.ts:
   ```typescript
   export const SUGGESTED_CATEGORIES = [
     "AI/ML",
     "Web Development",
     // Add new category
   ]
   ```
2. Category is now available in multi-tag input autocomplete

### Creating a New Server Action

1. Create file in app/actions/[domain]/[actionName].ts:
   ```typescript
   "use server"
   
   import { createClient } from "@/lib/supabase/server"
   import { revalidatePath } from "next/cache"
   
   export async function myAction(data: MyData) {
     const supabase = await createClient()
     
     // Auth check
     const { data: { user } } = await supabase.auth.getUser()
     if (!user) return { error: "Not authenticated" }
     
     // Action logic
     const { data, error } = await supabase.from('table').insert(data)
     
     if (error) return { error: error.message }
     
     revalidatePath('/relevant/path')
     return { success: true, data }
   }
   ```

2. Call from client component:
   ```typescript
   import { myAction } from "@/app/actions/domain/myAction"
   
   async function handleClick() {
     const result = await myAction(data)
     if (result.error) {
       toast.error(result.error)
     } else {
       toast.success("Success!")
     }
   }
   ```

### Adding a New Admin Dashboard Page

1. Create app/admin/dashboard/[page-name]/page.tsx:
   ```typescript
   "use client"
   
   import { DashboardHeader } from "@/components/dashboard/dashboard-header"
   
   export default function MyPage() {
     return (
       <div className="flex flex-col gap-6">
         <DashboardHeader title="My Page" description="Description" />
         {/* Content */}
       </div>
     )
   }
   ```

2. Add to sidebar navigation in components/dashboard/dashboard-nav.tsx

### Adding a New Validation Schema

1. Create schema in lib/validations/[name].ts:
   ```typescript
   import { z } from "zod"
   
   export const mySchema = z.object({
     field: z.string().min(1, "Required"),
   })
   
   export type MyData = z.infer<typeof mySchema>
   ```

2. Use in forms with React Hook Form:
   ```typescript
   import { useForm } from "react-hook-form"
   import { zodResolver } from "@hookform/resolvers/zod"
   
   const form = useForm<MyData>({
     resolver: zodResolver(mySchema),
   })
   ```

### Database Migrations

```bash
# Login to Supabase
npx supabase login

# Link project
npx supabase link --project-ref [project-ref]

# Create migration
npx supabase migration new [migration-name]

# Edit migration file in supabase/migrations/

# Apply migration
npx supabase db push
```

### Deploying to Vercel

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   - Build command: npm run build
   - Output directory: .next
   - Install command: npm install
4. Add cron jobs in vercel.json (if needed)


## Known Issues & TODOs

### Current Limitations

1. **Rate Limiting**: In-memory store not suitable for multi-instance deployments
   - Solution: Migrate to Redis (Upstash/Vercel KV)

2. **Dark Mode**: Theme provider installed but not fully implemented
   - Many components need dark mode color classes

3. **Mobile Navigation**: No hamburger menu yet
   - Current navbar may overflow on small screens

4. **Event Submission**: No public event submission flow
   - All events created by admins only

5. **User Accounts**: No public user accounts or profiles
   - No saved events, RSVPs, or personalization

### Roadmap (from README.md)

- [ ] Event submission flow for organizers
- [ ] User authentication / profiles
- [ ] Social sharing & embeds
- [ ] Advanced filtering (tags, speakers, sponsors)
- [ ] Notifications & email reminders
- [ ] Analytics dashboard (views, clicks, attendance)
- [ ] Multilingual / localization support
- [ ] Mobile app or PWA

### Technical Debt

1. **Type Safety**: Some any types in filter logic
2. **Error Boundaries**: No global error boundary
3. **Logging**: Console logs should use proper logging service (Sentry, LogRocket)
4. **Testing**: No unit or E2E tests
5. **Accessibility**: ARIA labels and keyboard nav need audit
6. **Performance**: No image optimization for event images (Cloudinary configured but not used)

## Coding Conventions

### File Naming
- Components: PascalCase (e.g., EventCard.tsx)
- Utilities: kebab-case (e.g., filter-helper.ts)
- Server actions: camelCase (e.g., createEvent.ts)

### Component Patterns
- Use "use client" directive for client components
- Use "use server" directive for server actions
- Server Components by default (no directive needed)
- Prefer named exports for utilities, default export for pages/components

### Import Order
1. React / Next.js imports
2. Third-party libraries
3. Local components
4. Local utilities / actions
5. Types
6. Styles

### Error Handling
- Server actions: Return { error: string } or { success: true, data }
- Client: Display errors with toast.error()
- Log errors to console (TODO: use error tracking service)

### Async Patterns
- Server actions: Use async/await
- Client fetching: Use useEffect + useState or React Query (future)
- Always handle loading and error states

## Useful Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Production build
npm run start            # Start production server
npm run lint             # Run ESLint

# Supabase
npx supabase login       # Login to Supabase CLI
npx supabase link        # Link to remote project
npx supabase db push     # Push migrations
npx supabase db pull     # Pull remote schema

# Dependency Management
npm audit                # Check for vulnerabilities (should be 0)
npm outdated             # Check for outdated packages
npm update               # Update packages
```

## Resources

### Documentation
- Next.js 15 Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- shadcn/ui: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com
- Zod: https://zod.dev
- React Hook Form: https://react-hook-form.com

### Internal Docs
- README.md - User-facing documentation
- SECURITY_FIXES.md - Security implementation details
- .env.example - Environment variables reference

### External APIs
- OpenCage Geocoding: https://opencagedata.com/api
- Google Maps: https://developers.google.com/maps
- Umami Analytics: https://umami.is

## Contact & Support

- Repository: https://github.com/tochukwunwosa/tech-linkup
- Issues: GitHub Issues
- Primary Developer: Tochukwu Nwosa

---

**Last Updated**: 2025-11-13
**Document Version**: 1.0
**Maintained By**: Claude Code instances working on Tech Linkup
