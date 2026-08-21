# Supabase local development

Phase 2 defines the Bridge Media relational schema, seed data, row-level security,
and private Storage policies.

## Prerequisites

Install the Supabase CLI and a Docker-compatible container runtime. Then run:

```bash
supabase start
supabase db reset
supabase test db
```

`db reset` applies every file in `migrations/` and then `seed.sql`. The seed creates
the three supported platforms, Valley Creek Church, and Bridge Fall 2026. It does
not create a production user or membership.

## Generate application types

With the local stack running:

```bash
supabase gen types typescript --local > lib/supabase/database.types.ts
```

Generated types must be refreshed whenever a migration changes the public schema.
Do not edit database row types by hand.

## Tenant model

The authenticated user's `auth.uid()` is joined through
`organization_memberships`. RLS follows each child row back to its organization.
Policies apply `WITH CHECK` to inserts and updates as well as `USING` to existing
rows, preventing references from being moved across tenants.

The `campaign-media` bucket is private. Object names begin with organization and
content-item UUIDs. Storage policies validate both membership and that ownership
chain. Application code must issue short-lived signed URLs only after authorization.
