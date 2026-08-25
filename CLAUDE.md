# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Bridge Media Hub is a content creation, approval, and distribution platform for
promoting the Bridge Course. A small media team develops ideas into approved
social assets; church members then act as the distribution network through a
public, mobile-first Share Center.

Workflow: `idea → developing → draft → review → approved → ready_to_share →
archived`. Ideas and finished content are separate records — one idea can
produce a package containing only the assets the team actually needs. **V1
never publishes directly to a social network**; share events only measure
button use (view/copy/download/share intent), not successful posts. AI output
is always an editable suggestion and is never auto-approved, scheduled, or
published.

See `docs/IMPLEMENTATION_PLAN.md` for the full schema, route map, and phased
delivery plan this codebase was built against.

## Commands

```bash
npm install                # install dependencies
npm run dev                # start Next.js dev server (http://localhost:3000)
npm run lint                # eslint (eslint-config-next core-web-vitals + typescript)
npm run typecheck           # tsc --noEmit
npm run build                # production build
git diff --check             # whitespace check, run as part of the quality gate

supabase start                # start local Supabase (requires Docker)
supabase db reset             # apply supabase/migrations/*.sql then supabase/seed.sql
supabase test db              # run pgTAP tests in supabase/tests/
supabase test db -f supabase/tests/tenant_isolation.test.sql   # run a single test file

# Regenerate types after any migration changes public schema — never hand-edit:
npx supabase gen types typescript --local > lib/supabase/database.types.ts
```

There is no JS test runner configured; correctness of data access and RLS is
verified through the pgTAP suite in `supabase/tests/`. Every delivery phase is
expected to pass lint, typecheck, available database tests, and a production
build before it is committed.

`supabase db reset` seeds the three supported platforms, Valley Creek Church,
and the Bridge Fall 2026 campaign — it does not create a production user or
membership.

## Architecture

- **Next.js 16.3 App Router**, one deployable application. Read
  `node_modules/next/dist/docs/` before relying on prior Next.js knowledge —
  this version has breaking API/convention changes (see the block below).
- **React Server Components by default.** Client Components are limited to
  focused browser interactions (`lib/supabase/client.ts` is one of the few
  files marked `"use client"`).
- **Server Actions** handle validated, authenticated mutations. No mutation
  may trust form or URL input directly — validate with `lib/validation`
  before it touches the database.
- **Route Handlers** are reserved for HTTP boundaries only: Supabase Auth
  callback (`app/auth/callback`) and streamed AI output
  (`app/api/develop-idea`), plus event ingestion (`app/api/share-events`).
- **Supabase boundary (`lib/supabase/`):** the only place allowed to
  construct Supabase clients or hold generated database types. `client.ts` is
  the browser client, `server.ts` is the server client (reads/writes the
  Next.js cookie store, `server-only`). Application code elsewhere must go
  through this boundary, not call `createBrowserClient`/`createServerClient`
  directly.
- **AI boundary (`lib/ai/`):** provider config, durable writing rules
  (`guidance.ts`), and structured output schemas (`schema.ts`, Zod). AI
  suggestions are always editable and never auto-committed to a workflow
  state.
- **PostgreSQL RLS is the real authorization boundary**; route/UI guards are
  defense in depth only. Tenancy is enforced by joining `auth.uid()` through
  `organization_memberships`; policies apply `WITH CHECK` on insert/update as
  well as `USING`, so a row's organization can't be changed out from under
  its RLS scope. See `supabase/README.md` for the full tenant model.
- **Supabase Storage** holds media binaries; PostgreSQL holds only metadata.
  The `campaign-media` bucket is private and object names are namespaced by
  organization/content-item UUID — the app must only ever hand out
  short-lived signed URLs, never construct public URLs.

### Route groups

- `/`, `/share`, `/share/[id]` — public Share Center (Ready-to-Share content
  only; RLS blocks any other state from being publicly readable).
- `(auth)`: `/login`, `/auth/callback` — Supabase Auth entry.
- `(workspace)`: `/dashboard`, `/ideas`, `/ideas/new`, `/ideas/[id]`,
  `/content`, `/review`, `/campaigns`, `/media` — authenticated media-team
  workshop. `/calendar` and `/results` exist as placeholders outside the V1
  navigation.

### Data model (see `docs/IMPLEMENTATION_PLAN.md` for the full table)

`organizations` → `campaigns` → `campaign_themes`; `ideas` (with
`idea_platforms`) create `content_packages`, which hold `content_items`
(typed via `content_types`, tagged via `content_platforms`); `content_items`
own `media_assets`, `assignments`, `review_comments`, and `status_history`.
`share_events` attach to items once they reach `ready_to_share`. Roles are
`contributor`, `media_team`, `approver`, `admin` — contributor writes are
ownership-scoped, media-team+ may develop content, approver/admin control
approval and release.

## Environment variables

| Variable | Exposure | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser and server | RLS-constrained project key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | bypasses RLS — restrict to trusted server-only code paths |
| `OPENAI_API_KEY` | Server only | editable AI drafting |
| `AI_GATEWAY_API_KEY` | Server only | AI Gateway routing |
| `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` | Server only | stable production Server Actions encryption |

Copy `.env.example` to `.env.local` for local development; never commit
`.env.local`. Secrets never use the `NEXT_PUBLIC_` prefix.
