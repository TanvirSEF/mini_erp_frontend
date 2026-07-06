# Mini ERP — Frontend

The web app for the Mini ERP inventory and sales system, built with React and TypeScript. It covers login, a dashboard with live updates, product management with image upload, sales, and an admin section for users and roles. It talks to the [Mini ERP backend](https://github.com/TanvirSEF/mini_erp_backend).

## Test login
- Email: `admin@test.com`
- Password: `pass1234`

## Live links
- Frontend: https://erpfe.tanvirmern.com
- Backend API: https://erp.tanvirmern.com
- Swagger docs: https://erp.tanvirmern.com/api/v1/docs
- Backend repo: https://github.com/TanvirSEF/mini_erp_backend

## Run locally
Needs Node.js 18+ and pnpm. The backend should be running, local or deployed.

```bash
git clone https://github.com/TanvirSEF/mini_erp_frontend.git
cd mini_erp_frontend
pnpm install
cp .env.example .env   # set VITE_API_URL to your backend
pnpm dev
```

The app runs on http://localhost:5173.

For the app to reach the backend, the backend's `CLIENT_URL` must allow the frontend origin. For local dev set it to `http://localhost:5173`.

## Tech stack
React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, React Router 7, TanStack React Query, Axios, Socket.IO client, Sonner.

## Environment
Set `VITE_API_URL` in `.env` to your backend origin (no trailing slash). The app calls `<VITE_API_URL>/api/v1`. Example: `VITE_API_URL=https://erp.tanvirmern.com`.

## Features
- Login with JWT, protected routes, auto logout when the token expires.
- Dashboard with stat cards and a low-stock table, updated live over Socket.IO.
- Products: list with search, sort, and pagination; create, edit, and delete with image upload.
- Sales: build an order from multiple products, watch the total update, and review sale history.
- Admin section: create users, change roles, and edit what each role can do.

## Roles
The UI is gated by role. The backend enforces the real permissions on every request.

| Role | Can do |
|---|---|
| Admin | Everything, plus the Users and Roles pages |
| Manager | Manage products, record sales, view dashboard |
| Employee | View products, record sales |
