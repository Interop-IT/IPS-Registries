# IPS Results Registry

## Overview

The IPS Results Registry is a web application for searching and exploring vendors that have tested International Patient Summary (IPS) at various healthcare interoperability events worldwide. This is a data-intensive utility application focused on providing a clean, professional search and filter experience for healthcare testing results.

The application displays vendor testing results in both table and card views, with multi-select filtering capabilities across five dimensions: Company, IHE Profile, Actor, Year, and Event. Additionally, a global text search allows users to search across all fields including company information, products, and contact details.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**Routing**: Wouter for client-side routing (lightweight alternative to React Router).

**State Management**: 
- React Query (TanStack Query) for server state management and API data fetching
- Local React state (useState) for UI state like filters and view modes
- Query client configured with infinite stale time and disabled refetching to treat Google Sheets data as relatively static

**UI Components**: 
- shadcn/ui component library (New York style variant) with Radix UI primitives
- Tailwind CSS for styling with custom design system
- Component-based architecture with reusable UI elements in `client/src/components/ui/`

**Design System**:
- Material Design principles adapted for healthcare professionalism
- Custom color system using HSL values with CSS variables for theming
- Light/dark mode support via class-based theme switching
- Typography using Open Sans (or similar sans-serif) from Google Fonts
- Spacing based on Tailwind's utility scale (2, 3, 4, 6, 8, 12, 16, 20, 24)

**Key Design Decisions**:
- Search-first experience: filtering is the primary user interaction
- Global text search across all fields (company, product, contact, etc.) combined with multi-select filters
- Cascading filters: each filter dynamically shows only options available based on other active filter selections
- No large hero images - compact utility-focused interface
- Dual view modes (table/cards) for different user preferences
- Multi-select filters with search-within-dropdown capability
- Card view includes optional "Group by Company" toggle for organizing results by vendor
- Clickable company names in card view that link to company websites (when available)
- Responsive design from mobile to desktop with mobile-optimized navigation and interactions

**Mobile Experience**:
- Hamburger menu navigation using Sheet component (slides in from right)
- Compact header with smaller logo and responsive text on mobile
- Filter drawer slides up from bottom on mobile (replaces inline filters)
- All interactive buttons meet 44px minimum touch target on mobile
- View toggle buttons show text labels on mobile for clarity
- Responsive padding and spacing optimized for touch interactions
- Single-column card layout on mobile devices

### Backend Architecture

**Server**: Express.js with TypeScript running in Node.js.

**Build Process**: 
- Frontend: Vite bundles React application
- Backend: esbuild bundles Express server
- Development mode uses Vite dev server with HMR

**API Design**:
- RESTful endpoints under `/api` prefix
- Single endpoint `/api/vendor-results` fetches data from Google Sheets
- Express middleware for request logging with duration tracking

**Data Flow**:
- Google Sheets acts as the source of truth for vendor results
- Server fetches CSV export from Google Sheets (public access)
- Multiple URL formats attempted for robustness
- Data parsed and returned as JSON to frontend
- Frontend caches data using React Query

**Development Features**:
- Replit-specific plugins for development banner, cartographer, and runtime error overlay
- Hot module replacement in development
- Request/response logging middleware

### Data Storage

**Primary Data Source**: Google Sheets accessed via public CSV export URL.

**Data Schema**:
```typescript
interface VendorResult {
  company: string;
  profile: string;
  actor: string;
  year: string;
  event: string;
  website?: string;           // Link to company website (optional)
  product?: string;           // Product name (optional)
  primaryContact?: string;    // Primary contact name (optional)
  contactInfo?: string;       // Contact information (optional)
}
```

**Database Setup** (Configured but not actively used):
- Drizzle ORM configured with PostgreSQL dialect
- Schema defined in `shared/schema.ts` with users table
- Neon Database serverless driver configured
- Database migrations output to `./migrations`

**Rationale**: Google Sheets chosen for easy data entry and updates by non-technical users. Database infrastructure is configured for potential future features (authentication, caching, etc.) but current implementation fetches directly from sheets.

**Storage Interface**: In-memory storage class for user data (currently unused but scaffolded for future auth features).

### External Dependencies

**Data Sources**:
- Google Sheets (public CSV export) - primary data source for vendor results
- Environment variable `GOOGLE_SHEETS_URL` contains the sheet identifier

**Third-Party Services**:
- Google Fonts API for Open Sans typography
- Neon Database (configured via `@neondatabase/serverless`)

**Key NPM Packages**:
- **UI Framework**: React 18+ with TypeScript
- **Build Tools**: Vite, esbuild, tsx for development
- **Styling**: Tailwind CSS with PostCSS
- **Component Libraries**: Radix UI primitives (@radix-ui/*), shadcn/ui
- **Data Fetching**: TanStack React Query
- **ORM**: Drizzle ORM with Drizzle Kit
- **Validation**: Zod for schema validation
- **Utilities**: clsx, class-variance-authority for className management
- **Icons**: Lucide React
- **Routing**: Wouter
- **Date Handling**: date-fns

**Design Assets**:
- IPS logo stored in `attached_assets/` directory
- Favicon served from `/public`

**Development Dependencies**:
- Replit-specific plugins for enhanced development experience
- TypeScript for type safety
- ESLint/Prettier configurations (implicit via tooling)