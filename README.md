# Dexter — Task Management System

A full-stack task & project management app built for the Full Stack Developer (Fresher) technical assessment.

**Stack:** Next.js (App Router) + Tailwind CSS · NestJS + TypeORM + PostgreSQL · JWT auth

---

## 1. Project structure

```
dexter/
├── backend/     NestJS API (auth, users, workspaces, projects, tasks, comments)
└── frontend/    Next.js app (App Router, Tailwind)
```

## 2. Features implemented

- **Auth**
  - Guest login (instant, no signup — creates a temporary user + JWT)
  - Google OAuth login (Passport strategy; needs `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`, see below)
  - JWT-protected API routes
- **Tasks**
  - Create / update / delete tasks
  - Status: Backlog, To Do, Doing, Completed, On Hold
  - Priority: No priority, Urgent, High, Medium, Low
  - Members (many-to-many), due dates, subtasks, comments/updates thread
  - **List view** (grouped by status, collapsible, inline priority editing, Fields column toggle) and **Board (kanban) view**
  - Search, Add Task modal, task detail drawer
- **Projects**
  - CRUD, priority, lead, due date, linked tasks (project detail page reuses the task board/list)
- **Theme**
  - Light / Dark mode
  - 6 accent color modes (Amber, Blue, Pink, Rose, Emerald, Black)
  - Both persist in `localStorage` **and** on the user record in Postgres, so preferences survive refresh and login on another device
- **Settings**
  - Profile (name, title, username), Theme, Color — matches the Figma settings panel structure

## 3. Local setup

### Backend
```bash
cd backend
cp .env.example .env      # fill in DATABASE_URL, JWT_SECRET, Google OAuth keys (optional)
npm install
npm run start:dev         # http://localhost:4000/api
```

### Frontend
```bash
cd frontend
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL
npm install
npm run dev                # http://localhost:3000
```

`synchronize: true` is enabled on the TypeORM connection so tables are created automatically on first run against an empty Postgres database — no manual migration step needed for this assessment.

## 4. Deployment

- **Backend → Render**: New Web Service → point at `backend/`, build command `npm install && npm run build`, start command `npm run start:prod`. Add a Render PostgreSQL instance and set `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, and (optionally) the Google OAuth env vars.
- **Frontend → Vercel**: Import the repo, set root directory to `frontend/`, add `NEXT_PUBLIC_API_URL` pointing at the deployed Render API.

## 5. Google OAuth setup (optional)

Google login is fully wired (strategy, controller, callback flow, and a `/login/callback` page on the frontend that exchanges the token). To activate it:
1. Create OAuth credentials in Google Cloud Console.
2. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` on the backend.
3. Add the authorized redirect URI: `<backend-url>/api/auth/google/callback`.

Without these env vars set, the "Login with Google" button will redirect to Google and fail — **Guest login always works out of the box** and is the fastest way to demo the app.

## 6. Known deviations from the Figma design

The Figma file itself was not directly accessible in the build environment (the shared link required a Figma login), so the UI was built from the seven screenshots provided rather than the live file. This means fidelity to the source is approximate, not pixel-perfect, and there is a visible gap between this implementation and the original Figma in areas like exact spacing, shadow/elevation, font weights, and some micro-interactions.

Specific known gaps:
- Overall layout structure, navigation, and core components (sidebar, tasks list/board, task drawer, settings panels) follow the Figma screenshots, but exact spacing units, font sizes, and shadow values were approximated rather than measured from the design file.
- Drag-and-drop reordering between kanban columns is not implemented — status is changed via the priority-style dropdown / task detail drawer instead.
- Filters (the funnel icon in the Tasks header) is present in the UI but not yet wired to actual filtering logic — only search and the Fields column-visibility toggle are functional.
- "Labels", "Teams", and "Reporter" fields shown in some Figma dropdowns are not modeled in the database; only Status, Priority, Members, and Due Date are implemented end-to-end.
- Real-time collaboration (e.g. the floating cursor/avatar seen in the Figma board view) is not implemented.

Given more time (or direct Figma access), the next step would be to go screen-by-screen and tighten spacing/typography/color values against the actual design tokens rather than screenshots.

## 7. Part 2 — Product Understanding

See `PART_2_PRODUCT_UNDERSTANDING.md` for the AbleSpace "Take Data" workflow write-up and UX/UI improvement suggestions.
