# Bridge Media Hub implementation plan

## Product boundary

Bridge Media Hub turns an idea into an approved package of reusable media and then puts only `ready_to_share` items in a simple public Share Center. It does not schedule or publish to social networks.

## Repository audit

The existing application provides a clean Next.js 16 shell, campaign seed, early Supabase Auth dependencies, and a tenant-aware schema. The old model conflicts with the new product in four ways: ideas are embedded in content items, workflow states are scheduling-oriented, themes and packages are absent, and all media is private. Placeholder Calendar and Results pages are outside the V1 navigation and are replaced by Ideas, Review, and Share Center.

## Proposed schema

| Table | Purpose | Important relationships |
| --- | --- | --- |
| `organizations` | Church identity | has campaigns and members |
| `profiles`, `user_roles` | Supabase users and roles | contributor, media_team, approver, admin |
| `campaigns` | Campaign facts | belongs to organization |
| `campaign_themes` | Database-driven collections | belongs to campaign; optional parent |
| `ideas` | Source concepts, notes, owner, workflow | creates packages |
| `idea_platforms` | Suggested platforms | idea ↔ platform |
| `content_packages` | Deliverables from one idea | belongs to idea |
| `content_types` | Format vocabulary | Text, Image, Video, etc. |
| `content_items` | Editable finished deliverables | belongs to package/type |
| `platforms`, `content_platforms` | Extensible suitability | content ↔ platform |
| `media_assets` | Storage metadata, never binary data | belongs to content item |
| `assignments` | Responsibility | item ↔ profile |
| `review_comments` | Review discussion | belongs to item |
| `status_history` | Workflow transitions | idea or content item |
| `share_events` | View/copy/download/share intent | belongs to ready item |

The workflow is `idea → developing → draft → review → approved → ready_to_share → archived`. Constraints and RLS prevent public access to any other state. Contributor writes are ownership-scoped; media-team and higher roles may develop; approvers/admins control approval and release.

## Routes

### Public

- `/` and `/share` — Share Center browse and filters
- `/share/[id]` — content detail and media actions
- `/api/share-events` — validated event ingestion

### Authenticated Workshop

- `/login`, `/auth/callback` — Supabase Auth
- `/dashboard` — totals, attention list, quick actions
- `/ideas`, `/ideas/new`, `/ideas/[id]` — Idea Bank and development
- `/content`, `/content/[id]` — packages and content editing
- `/review`, `/review/[id]` — review and approval
- `/campaigns`, `/campaigns/[id]` — campaigns and themes
- `/media` — upload and asset library

## Component structure

- `components/layout`: public header, workshop shell, mobile navigation
- `components/ui`: owned primitives and status badges
- `components/ideas`: filters, cards/forms, AI development panel
- `components/content`: package builder, editor, platform selector, previews
- `components/review`: comments, status actions, history timeline
- `components/share`: mobile-first filters/cards and share actions
- `lib/supabase`: clients, auth helpers, generated-compatible types
- `lib/ai`: generation guidance, schemas, server-only provider boundary

## Delivery phases

1. **Foundation:** normalized migration, RLS, Auth, campaigns/themes, Idea Bank.
2. **Packages:** idea transitions, package builder, content drafts.
3. **AI development:** editable structured suggestions; never auto-approve.
4. **Media:** Storage metadata and content editing.
5. **Review:** comments, return/approve/release, status history.
6. **Share Center:** public ready-only browse/detail experience.
7. **Actions:** copy/download/Web Share and explicit intent events.

Each phase is verified with lint, typecheck, available database tests, and production build, then committed separately. Missing local Supabase or provider credentials are reported rather than hidden behind production mocks.
