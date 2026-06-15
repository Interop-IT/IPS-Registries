# IPS Registries

A web application for navigating and validating International Patient Summary (IPS) implementations and interoperability testing results worldwide.

The registry supports the ongoing work of the **Joint Initiative Council for Global Health Informatics Standardization (JIC)** regarding the International Patient Summary (IPS). It is built for **healthcare software vendors, implementers, and IHE/HL7 Connectathon participants**, giving these stakeholders a centralized platform to navigate IPS standards, align their systems with global interoperability requirements, and validate their technical implementations.

The application has two main areas:

- **Implementation Registry** (landing page) — jurisdictions and projects implementing the IPS, organized by country and project, with reveal-on-demand primary contacts.
- **Vendor Results** — vendors that have tested IPS at healthcare interoperability events, searchable across company, IHE profile, actor, year, and event.

## Live App

🔗 **[https://ips.interop.it/](https://ips.interop.it/)**

## Features

- Two registries: IPS Implementation Registry and Vendor Testing Results
- Dual view modes — **List View** (compact table) and **Item View** (cards)
- Multi-select cascading filters — each filter shows only the options still available given your other selections
- Global text search across all fields (jurisdiction, project, company, product, contacts, and more)
- Group by Continent toggle in Item View for organizing implementations geographically
- Reveal-on-demand contact details (primary contact and email)
- Light / dark mode
- Fully responsive, mobile-optimized layout with touch-friendly controls

## Tech Stack

**Client:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix UI), TanStack React Query, Wouter

**Server:** Node.js, Express, TypeScript

**Data Source:** Google Sheets (public CSV export) as the source of truth for both registries

## Installation

Requires Node.js 20+.

```bash
# Install dependencies
npm install

# Start the development server (client + server on one port)
npm run dev
```

The app runs at `http://localhost:5000` by default.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server with hot reloading |
| `npm run build` | Build the client (Vite) and server (esbuild) for production |
| `npm run start` | Run the production build |
| `npm run check` | Type-check the project with TypeScript |
| `npm run db:push` | Push the Drizzle schema to the database |

## Environment Variables

Configure the following environment variables (for example, in a `.env` file). Do not commit real values.

| Variable | Required | Description |
|----------|----------|-------------|
| `IPS_IMPLEMENTATIONS_SHEETS_URL` | Yes | Google Sheets URL/ID for the Implementation Registry data |
| `VENDOR_RESULTS_SHEETS_URL` | Yes | Google Sheets URL/ID for the Vendor Results data |
| `GOOGLE_SHEETS_URL` | Optional | Fallback sheet URL/ID used when either of the above is not set |
| `SESSION_SECRET` | Recommended | Secret used to sign server sessions |
| `PORT` | Optional | Port the server listens on (defaults to `5000`) |

## Data & API

Data is fetched server-side from public Google Sheets CSV exports and served to the client as JSON via these endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /api/implementations` | IPS implementation records (jurisdictions and projects) |
| `GET /api/vendor-results` | Vendor interoperability testing results |

Sheets are chosen as the data store so non-technical contributors can update the registries directly. The client caches responses with React Query and treats the data as relatively static.
