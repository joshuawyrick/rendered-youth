# Rendered Youth

**Kids Draw It. We Render It. You Wear It.**

A marketplace where children's black-marker artwork becomes real T-shirts. Kids upload their drawings, the Rendered Youth team creates professional mockups, designs go live in the store, and young creators share in the profits. Originally conceived as "Tucker's Tees" — Tucker's designs live on as a special co-founder collection.

## Tech Stack

- **Vite + React 18 + TypeScript** — the web app
- **Tailwind CSS + shadcn/ui** — styling (brand tokens live in `src/index.css`; black `#000` / yellow `#FFD400`)
- **Supabase** — database, auth, file storage, and edge functions (`supabase/`)
- **React Router** — page routing (all routes are in `src/App.tsx`)
- **TanStack Query** — data fetching/caching
- Built and editable with [Lovable](https://lovable.dev/projects/2d2ea40d-6318-4043-bc01-04a8f8bc4faf)

## Project Layout

```
src/
  pages/          One file per page (Store, Creators, AdminDashboard, ...)
  components/     UI building blocks, grouped by feature (admin/, store/, onboarding/, ...)
    ui/           Generic shadcn components + RY-branded ones (ry-button, ry-card)
  hooks/          Reusable logic (useAuth, useStoreData, ...)
  services/       All Supabase database calls, grouped by feature
  integrations/   Supabase client + generated database types
supabase/
  functions/      Server-side edge functions (parent verification email, notifications)
  migrations/     Database schema history
```

## Key Flows

- **Creator signup**: age gate → under-13 requires parent email consent (COPPA) → parent clicks link in email → `/parent-verify`
- **Design upload**: creator uploads artwork → `/creator/submitted` confirmation → admin reviews → mockups → creator picks → live in store
- **Admin**: `/admin` — design review, product/collection management, discount codes

## Local Development

```sh
npm install
npm run dev      # starts dev server at http://localhost:8080
npm run build    # production build
npm run lint     # check code quality
```

## Notes

- The parent-verification email builds its link from the `SITE_URL` secret in Supabase Edge Function settings — set it to the real site address when using a custom domain.
- Changes pushed to this repo sync automatically with Lovable, and vice versa.
