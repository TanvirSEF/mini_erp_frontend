# Mini ERP — Frontend

React + TypeScript single-page app for the Mini ERP (Inventory & Sales) system. JWT auth, role-based UI, dashboard with live updates, product CRUD with image upload, sales, and an admin section. Talks to the [Mini ERP backend](https://github.com/TanvirSEF/mini_erp_backend).

## Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui (`base-nova` style, built on `@base-ui/react`)
- React Router 7 (declarative, lazy-loaded routes)
- TanStack React Query (server state)
- Axios (typed HTTP client)
- Socket.IO client (live dashboard)
- Sonner (toasts)

## Features
- **Auth** — login, JWT stored locally, protected routes, auto-redirect on token expiry.
- **Dashboard** — stat cards (products, sales, revenue, low stock), low-stock table, **live updates via Socket.IO**.
- **Products** — list with search/sort/pagination, create/edit with image upload (Cloudinary via backend), delete. Role-gated mutations.
- **Sales** — multi-product sale builder with live grand total + sale history.
- **Admin (Users & Roles)** — manage users and edit role permissions at runtime (database-driven RBAC).

## Roles
UI is gated by role; the backend enforces real permissions on every request.

| Role | Can do |
|---|---|
| **Admin** | Everything, plus Users & Roles management |
| **Manager** | Products CRUD, sales, dashboard |
| **Employee** | View products, record sales |

## Prerequisites
- Node.js >= 18
- pnpm (`npm i -g pnpm`)
- The backend running (local or deployed)

## Setup
```bash
git clone <this-repo>
cd frontend
pnpm install
cp .env.example .env      # set VITE_API_URL to your backend origin
pnpm dev
```

App runs at `http://localhost:5173`.

> **CORS:** the backend must allow the frontend origin. For local dev set the backend's `CLIENT_URL=http://localhost:5173`. For production set it to the deployed frontend URL.

## Environment Variables
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend origin (no trailing slash). API routes are at `<VITE_API_URL>/api/v1`. |

Example: `VITE_API_URL=https://erp.tanvirmern.com`

## Scripts
| Script | Purpose |
|---|---|
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Type-check + production build to `dist/` |
| `pnpm preview` | Preview the production build locally |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier (TS/TSX) |

## Project Structure
```
src/
├── api/            HTTP functions + query-keys (one file per resource)
├── components/     ui/ (shadcn) + feature components (products/, sales/)
├── context/        AuthProvider + useAuth
├── hooks/          React Query hooks per resource
├── lib/            axios client, token storage, socket, formatters, config
├── pages/          route screens (lazy-loaded)
├── routes/         route tree + auth/role guards
└── types/          shared domain types
```

## Deployment (Vercel)
This repo includes a `vercel.json` SPA rewrite so client-side routes work on refresh.

1. Push to GitHub.
2. Vercel → New Project → import the repo (auto-detects Vite).
3. Set environment variable `VITE_API_URL` to your backend origin.
4. Deploy. Then set the backend's `CLIENT_URL` to the deployed frontend URL.

Netlify equivalent: add a `_redirects` file with `/*  /index.html  200`.

## Admin Credentials (for testing)
- Email: `admin@test.com`
- Password: `pass1234`
