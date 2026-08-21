# Bridge Media

Bridge Media is a focused social-media campaign manager for the Bridge Course at
Valley Creek Church in Malvern, Pennsylvania. V1 supports internal planning and
manual posting; it will not publish to Facebook or Instagram automatically.

The first campaign is **Bridge Fall 2026**, a ten-week course beginning September
9, 2026. Messaging emphasizes free dinner, free childcare, welcome for questions,
and a no-pressure environment for people exploring Christianity.

## Current status

Phase 1 establishes the Next.js App Router workspace, route groups, design
foundation, configuration boundaries, and documentation. Routes beyond the
dashboard are intentionally non-functional placeholders until their designated
phase. Supabase authentication and tenancy begin in Phase 2.

## Architecture

- **Next.js 16.3 App Router** in one deployable application.
- **React Server Components by default.** Client Components are limited to
  focused browser interactions.
- **Server Actions** for authenticated application mutations. Each action must
  validate input and independently verify authentication and authorization.
- **Route Handlers** only for HTTP boundaries such as Auth callbacks and streamed
  AI output.
- **Supabase boundary:** clients, generated types, and authorization-aware data
  access live in `lib/supabase`.
- **AI boundary:** providers, durable writing rules, schemas, and streaming logic
  live in `lib/ai`.
- **PostgreSQL RLS** is the organization-isolation boundary. UI or route guards
  are defense in depth, not substitutes for RLS.
- **Private media:** later phases will use a private Supabase Storage bucket and
  short-lived signed URLs after authorization.

## Routes

| Route | Purpose | Delivery phase |
| --- | --- | --- |
| `/dashboard` | Campaign overview | Foundation in Phase 1, data in Phase 7 |
| `/campaigns` | Campaign facts and guidance | Phase 3 |
| `/calendar` | Internal planned-post calendar | Phase 4 |
| `/content` | Queue, variants, and assignments | Phase 3 |
| `/media` | Private campaign media | Phase 5 |
| `/results` | Manual cumulative results | Phase 7 |
| `/login` | Supabase Auth entry point | Phase 2 |

## Local setup

Requirements: Node.js 20.9 or newer, npm, and a Supabase project for Phase 2 and
beyond.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Empty credentials are enough
to review the Phase 1 shell; never commit `.env.local`.

## Environment variables

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser and server | RLS-constrained project key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Exceptional administrative setup; never application UI |
| `OPENAI_API_KEY` | Server only | Phase 6 drafting |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Server only | Stable production action encryption |

## Database types

Do not hand-maintain database row types. After applying the reviewed Phase 2
schema, regenerate them from the local Supabase schema:

```bash
npx supabase gen types typescript --local > lib/supabase/database.types.ts
```

The checked-in Phase 1 type file is an explicit non-functional marker until that
schema exists.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

## Security principles

- Secrets never use the `NEXT_PUBLIC_` prefix.
- Server-only environment access stays out of Client Components.
- Every mutation treats form and URL data as untrusted.
- Every data operation derives identity from the verified Supabase session.
- Tenant-owned foreign keys are checked through RLS on inserts and updates.
- AI output is an editable suggestion requiring deliberate human review and save.
- Bridge Media never automatically approves, schedules, or publishes content.
