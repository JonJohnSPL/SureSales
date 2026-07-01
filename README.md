# SureSales

Appalachia sales funnel + project tracker for SPL Pittsburgh.
Mirrors the Excel workbook 1:1 (Dashboard, Project Tracker, Funnel, Target Accounts)
with inline editing and local persistence via `localStorage`.

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Structure

```
suresales/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── data/
    │   └── seed.js
    └── components/
        ├── Dashboard.jsx
        ├── ProjectTracker.jsx
        ├── Funnel.jsx
        ├── TargetAccounts.jsx
        ├── Sidebar.jsx
        └── ui.jsx
```

## Data sources (seeded)

- Email thread: RE: Appalachia Pending and Current Work (June 23/24, 2026)
- Master_Client_List_step3_linked 1.xlsx
- SPL_Pittsburgh_2026_Market_Analysis.docx
- Pittsburgh Business Model 2026 Energy+Environmental.pptx

## Persistence

Without Supabase credentials, state is saved to `localStorage` under the key
`suresales_v1`. Use the **Export JSON** button in the sidebar to download a
snapshot.

With Supabase configured, signed-in users share the same Postgres-backed
projects and target accounts. The app still keeps a local backup in
`localStorage` if a sync attempt fails.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local`.
4. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
5. Confirm the `projects` and `target_accounts` tables are exposed in the
   Supabase Data API settings.
6. Add the app URL to Supabase Auth redirect URLs.
7. Restart the Vite dev server.

The schema enables RLS and grants table access only to authenticated users.
For team use, keep Supabase Auth signups restricted to the people who should
edit the tracker.
