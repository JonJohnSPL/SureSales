# SureSales

Appalachia client work tracker for SPL Pittsburgh. The app is organized around
clients, projects, and project tasks.

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints, usually http://localhost:5173.

## Build

```bash
npm run build
npm run preview
```

## Structure

```text
suresales/
+-- package.json
+-- vite.config.js
+-- tailwind.config.js
+-- postcss.config.js
+-- index.html
+-- supabase/
|   +-- schema.sql
+-- src/
    +-- main.jsx
    +-- index.css
    +-- App.jsx
    +-- data/
    |   +-- seed.js
    +-- lib/
    |   +-- supabaseClient.js
    |   +-- suresalesRepository.js
    +-- components/
        +-- AuthGate.jsx
        +-- Dashboard.jsx
        +-- ProjectTracker.jsx
        +-- Sidebar.jsx
        +-- ui.jsx
```

## Data Model

- `clients`: client profile metadata from the streamlined workbook.
- `projects`: client-linked project cards with bucket, stage, owner, ask, and notes.
- `project_tasks`: first-class tasks linked to projects.

Without Supabase credentials, state is saved to `localStorage` under
`suresales_v2`. If old `suresales_v1` local data exists, the app migrates its
projects into the new shape and creates initial tasks from each next step.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
5. Confirm the `clients`, `projects`, and `project_tasks` tables are exposed in
   the Supabase Data API settings.
6. Confirm the `client-logos` Storage bucket exists; `schema.sql` creates it
   with authenticated upload policies for PNG, JPEG, WebP, and GIF logos.
7. Add the app URL to Supabase Auth redirect URLs.
8. Restart the Vite dev server.

The schema enables RLS and grants table access only to authenticated users. For
team use, keep Supabase Auth signups restricted to the people who should edit
the tracker.
