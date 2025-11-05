# .NET Mock Interview Quiz App

## Overview

A gamified quiz application for .NET developers to practice interview questions. Users select a topic (C# Basics, ASP.NET Core, Entity Framework, LINQ, .NET 9 Features), choose the number of questions (5-50), and take a timed quiz with instant feedback and explanations. The application features a clean, Material Design-inspired interface with dark mode support, progress tracking, and celebratory animations for perfect scores.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for client-side routing with three main routes:
- `/` - Home page for quiz configuration
- `/quiz` - Active quiz interface
- `/results` - Results display with review functionality

**UI Component System**: Shadcn/ui (New York variant) providing a comprehensive set of pre-built, accessible components built on Radix UI primitives. Components use Tailwind CSS with custom design tokens for consistent theming.

**Design Philosophy**: Material Design principles adapted for a quiz/productivity application, inspired by Duolingo's gamified learning interface and Linear's clean typography. The interface balances focus during quiz-taking with celebration after completion.

**State Management**: 
- React Query (@tanstack/react-query) for server state and API data fetching
- SessionStorage for persisting quiz configuration and results across page navigation
- Local component state (useState) for UI interactions
- Theme context for dark/light mode persistence

**Styling Approach**:
- Tailwind CSS with custom configuration for spacing, colors, and design tokens
- CSS variables for theme-aware color system supporting both light and dark modes
- Custom utility classes for elevation effects (`hover-elevate`, `active-elevate-2`)
- Typography system using Inter for UI and JetBrains Mono for code snippets
- Responsive design with mobile-first breakpoints

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript, serving both API endpoints and static assets.

**API Design**: RESTful endpoint pattern:
- `GET /api/questions?topic={topic}&count={count}` - Fetches randomized questions for a specific topic

**Data Storage**: File-based JSON storage located at `server/data/questions.json` containing 100+ questions organized by topic. Questions are shuffled server-side to provide variety across quiz sessions.

**Development vs Production**:
- Development: Vite dev server in middleware mode with HMR support
- Production: Pre-built static assets served from `dist/public`

**Middleware Stack**:
- JSON body parsing with raw body preservation
- URL-encoded form data parsing
- Custom request logging for API routes with response capture
- Vite middleware (development only)

### Database & Schema

**Current Implementation**: In-memory storage with a `MemStorage` class implementing the `IStorage` interface. User-related functionality exists but is not actively used in the quiz flow.

**Schema Definition**: Zod schemas in `shared/schema.ts` define:
- Quiz topics as a const array with type inference
- Question structure (question text, 4 options, answer index, explanation)
- Quiz configuration (topic selection, question count validation)
- Quiz results (answers, timing, scoring)

**Database Preparation**: Drizzle ORM configured for PostgreSQL via `@neondatabase/serverless` driver. Configuration exists in `drizzle.config.ts` with schema migrations directory set up, though not currently utilized for quiz data.

### Design System

**Color System**: HSL-based with CSS variable tokens supporting light/dark modes. Semantic color tokens include primary, secondary, destructive, accent, and muted variants, each with foreground and border sub-tokens.

**Typography Scale**:
- Hero/Page Titles: text-4xl to text-5xl, bold weight
- Section Headers: text-2xl to text-3xl, semibold
- Question Text: text-xl to text-2xl, medium weight
- Body/Options: text-base to text-lg
- Metadata/Timer: text-sm, uppercase with tracking

**Spacing System**: Based on Tailwind's spacing scale with emphasis on units 3, 4, 6, 8, 12, and 16 for consistent vertical rhythm and component padding.

**Container Strategy**:
- Home page: max-w-2xl (focused experience)
- Quiz page: max-w-4xl (comfortable question reading)
- Results page: max-w-5xl (accommodates review grid)

## External Dependencies

### UI Component Libraries
- **Radix UI**: Complete set of unstyled, accessible component primitives (@radix-ui/react-*)
- **Shadcn/ui**: Pre-configured component library built on Radix UI
- **Lucide React**: Icon library for UI elements
- **CMDK**: Command palette component

### Frontend Utilities
- **React Hook Form** with Zod resolvers for form validation
- **TanStack Query**: Server state management and data fetching
- **Wouter**: Lightweight client-side routing
- **class-variance-authority**: Type-safe component variant creation
- **clsx** & **tailwind-merge**: Conditional className composition
- **date-fns**: Date manipulation utilities
- **embla-carousel-react**: Carousel/slider functionality
- **react-confetti**: Celebration effects for perfect scores

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS** with Autoprefixer: CSS processing

### Development Tools
- **Vite**: Build tool and dev server with React plugin
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Backend bundling for production
- **TSX**: TypeScript execution for development server

### Backend Libraries
- **Express**: Web server framework
- **Drizzle ORM**: Type-safe database toolkit (configured but not actively used)
- **Zod**: Runtime schema validation
- **nanoid**: Unique ID generation

### Database (Prepared)
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **connect-pg-simple**: PostgreSQL session store (available but unused)

### Replit Integration
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development environment integration
- **@replit/vite-plugin-dev-banner**: Development mode indicator

### SEO & Meta
- Comprehensive Open Graph and Twitter Card meta tags configured in `index.html`
- Google Fonts CDN integration for Inter and JetBrains Mono
- AdSense placeholder components ready for monetization integration