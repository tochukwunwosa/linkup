# Admin Dashboard

A modern admin dashboard built with Next.js, Tailwind CSS, and Supabase.

## Features

- 🔐 Authentication with Supabase
- 👥 Role-based access control (Admin & Super Admin)
- 📅 Event management
- 👤 Admin invitation system
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 🚀 Built with Next.js App Router
- 📱 Responsive design

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- shadcn/ui
- Supabase
- TypeScript
- React Hook Form + Zod
- Sonner (Toast notifications)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

1. Create a new Supabase project
2. Run the migration in `supabase/migrations/20240318000000_init.sql`
3. Enable Email authentication in Supabase Auth settings

## Project Structure

```
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── events/
│   │   └── invite/
│   └── layout.tsx
├── components/
│   ├── admin/
│   │   ├── EventForm.tsx
│   │   ├── EventsTable.tsx
│   │   └── Sidebar.tsx
│   └── ui/
├── lib/
│   └── supabase.ts
└── types/
```

## Features

### Authentication

- Email/Password authentication with Supabase
- Protected routes for admin users
- Role-based access control

### Event Management

- Create, read, update, and delete events
- Event details include title, description, date, and location
- Table view with sorting and loading states

### Admin Management

- Create new admin

### UI/UX

- Modern and clean design
- Responsive layout
- Toast notifications for user feedback
- Loading states and skeletons
- Form validation with React Hook Form and Zod

## License

MIT
