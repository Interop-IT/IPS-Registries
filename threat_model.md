# Threat Model

## Project Overview

Public React + Express application for browsing IPS vendor testing results and IPS implementation registry data. Production traffic goes to a Node/Express server (`server/index.ts`) that exposes public read-only JSON APIs and fetches registry content from Google Sheets at request time. The deployment is public, runs behind platform TLS, and currently has no authenticated or admin-only application surface.

## Assets

- **Registry data integrity** — users rely on the returned vendor and implementation data to make decisions and follow outbound links. Tampered data can mislead users or drive them to malicious destinations.
- **Service availability** — the public API is the only way the frontend gets registry data. If the API or its upstream Google Sheets fetch path is exhausted or stalled, the application becomes unavailable.
- **Contact information in registry data** — the application intentionally displays contact names, emails, and related metadata from the source sheets. Even if publication is expected, those fields still require care to avoid accidental overexposure through logs or unrelated responses.
- **Deployment configuration** — sheet URLs and runtime return URLs come from environment variables. Incorrect or malicious values can affect what data is served or where users are sent.

## Trust Boundaries

- **Browser to Express API** — all `/api/*` routes are public and must treat every request as untrusted.
- **Express server to Google Sheets** — the backend fetches CSV from third-party Google endpoints using environment-configured sheet identifiers. This is the primary external-data trust boundary.
- **Server data to browser rendering** — data fetched from Google Sheets is rendered into the UI, including text, contact fields, and outbound links.
- **Development-only tooling to production app** — Vite middleware in `server/vite.ts`, mock/example components, and attached assets are out of scope unless production reachability is demonstrated. In production, static assets are served from the built client bundle only.

## Scan Anchors

- Production server entry: `server/index.ts`; public routes: `server/routes.ts`.
- Highest-risk code area: `server/googleSheets.ts` because it fetches and parses untrusted external content on demand.
- Highest-risk client renderers: `client/src/components/ResultsCards.tsx`, `ResultsTable.tsx`, `ImplementationsCards.tsx`, `ImplementationsTable.tsx`, and `ContactPanel.tsx` because they turn sheet data into links and visible content.
- Public surfaces: `/api/config`, `/api/vendor-results`, `/api/implementations`, plus the two React pages in `client/src/pages/`.
- Dev-only areas usually ignored: `server/vite.ts` development middleware, `client/src/components/examples/`, `client/src/lib/mockData.ts`, `attached_assets/`, and build/config scripts.

## Threat Categories

### Tampering

This project trusts Google Sheets as its content source, but the fetched CSV must still be treated as untrusted at the application boundary. The system must only transform sheet content into safe, expected data types and must not let sheet-controlled values alter browser behavior beyond intended navigation. Outbound links derived from registry data must be constrained to safe URL schemes.

### Information Disclosure

The public APIs return registry content directly to any internet user. The application must avoid leaking unrelated internal details through errors, logs, or configuration responses. Error responses should stay generic enough that failures in upstream fetches do not reveal unnecessary operational detail.

### Denial of Service

Because the public endpoints trigger network fetches and CSV parsing, an attacker can try to exhaust server or upstream resources with repeated requests or slow upstream behavior. Public API handlers must bound the cost of each request using caching, timeouts, and/or rate limiting so unauthenticated traffic cannot repeatedly force expensive upstream work.

### Elevation of Privilege

There is no active user/admin privilege model in the current production app, so classic account-level privilege escalation is not the main concern. The relevant privilege boundary is between passive content display and active browser behavior: untrusted registry data must not be able to execute script, trigger unsafe navigation, or gain more influence in the browser than plain content should have.
