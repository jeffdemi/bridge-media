# Bridge Media Hub

Bridge Media Hub is a content creation, approval, and distribution platform for promoting the Bridge Course. A small media team develops ideas into approved social assets; church members then become the distribution network through a public, mobile-first Share Center.

> Idea → Develop → Draft → Review → Approved → Ready to Share → Church member shares

Ideas and finished content are separate records. One idea can create a package containing only the assets the team needs. V1 never directly publishes to a social network.

The first campaign is **Bridge Fall 2026**, a ten-week course beginning September
9, 2026. Messaging emphasizes free dinner, free childcare, welcome for questions,
and a no-pressure environment for people exploring Christianity.

See [the implementation plan](docs/IMPLEMENTATION_PLAN.md) for the repository audit, normalized schema, route map, component structure, and phased delivery plan.

## Architecture

- **Next.js 16.3 App Router** in one deployable application.
- **React Server Components by default.** Client Components are limited to
  focused browser interactions.
- **Server Actions** for validated authenticated mutations.
- **Route Handlers** only for HTTP boundaries such as Auth callbacks and streamed
  AI output.
- **Supabase boundary:** clients, generated types, and authorization-aware data
  access live in `lib/supabase`.
- **AI boundary:** providers, durable writing rules, schemas, and streaming logic
  live in `lib/ai`.
- **PostgreSQL RLS** is the authorization boundary; route guards are defense in depth.
- **Supabase Storage** holds media binaries while PostgreSQL stores metadata.

## Routes

| Route | Purpose | Delivery phase |
| --- | --- | --- |
| `/`, `/share` | Public Ready-to-Share content |
| `/dashboard` | Workshop overview and quick actions |
| `/ideas` | Idea Bank and development |
| `/content` | Packages and content items |
| `/review` | Review and approval queue |
| `/campaigns` | Campaign facts and themes |
| `/media` | Images, video, and thumbnails |
| `/login` | Supabase Auth entry point |

## Local setup

Requirements: Node.js 20.9 or newer, npm, and a Supabase project for Phase 2 and
beyond.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Never commit `.env.local`.

## Environment variables

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser and server | RLS-constrained project key |
| `OPENAI_API_KEY` | Server only | editable AI drafting |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Server only | Stable production action encryption |

## Database types

Regenerate database types after applying migrations:

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
supabase db reset
supabase test db
```

## Security principles

- Secrets never use the `NEXT_PUBLIC_` prefix.
- Server-only environment access stays out of Client Components.
- Every mutation treats form and URL data as untrusted.
- Every data operation derives identity from the verified Supabase session.
- Tenant-owned foreign keys are checked through RLS on inserts and updates.
- AI output is editable and requires deliberate human review.
- Share events measure button use, not successful social posts.
- Bridge Media never automatically approves or publishes content.
