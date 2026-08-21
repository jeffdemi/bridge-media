begin;
select plan(12);

-- Fixtures are installed as the database owner; test assertions switch to API roles.
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'a@example.test', '', now(), '{}', '{"display_name":"Member A"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', 'a0000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'b@example.test', '', now(), '{}', '{"display_name":"Member B"}', now(), now());

insert into public.organizations (id, name, slug) values
  ('a1000000-0000-4000-8000-000000000001', 'Organization A', 'organization-a'),
  ('a1000000-0000-4000-8000-000000000002', 'Organization B', 'organization-b');
insert into public.organization_memberships (organization_id, profile_id, role) values
  ('a1000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'owner'),
  ('a1000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002', 'owner');
insert into public.campaigns (id, organization_id, name, location, starts_on, message) values
  ('a2000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001', 'Campaign A', 'Malvern, PA', current_date, 'Message A'),
  ('a2000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000002', 'Campaign B', 'Elsewhere', current_date, 'Message B');
insert into public.content_items (id, campaign_id, title, idea, created_by) values
  ('a3000000-0000-4000-8000-000000000001', 'a2000000-0000-4000-8000-000000000001', 'Content A', 'Idea A', 'a0000000-0000-4000-8000-000000000001'),
  ('a3000000-0000-4000-8000-000000000002', 'a2000000-0000-4000-8000-000000000002', 'Content B', 'Idea B', 'a0000000-0000-4000-8000-000000000002');
insert into public.platforms (id, key, name, sort_order) values (99, 'test_platform', 'Test platform', 99) on conflict do nothing;
insert into public.content_platforms (id, content_item_id, platform_id, copy) values
  ('a4000000-0000-4000-8000-000000000001', 'a3000000-0000-4000-8000-000000000001', 99, 'Copy A'),
  ('a4000000-0000-4000-8000-000000000002', 'a3000000-0000-4000-8000-000000000002', 99, 'Copy B');

set local role anon;
select is_empty('select id from public.organizations', 'anonymous users cannot read organizations');
select is_empty('select id from public.campaigns', 'anonymous users cannot read campaigns');
select throws_ok($$insert into public.campaigns (organization_id, name, location, starts_on, message) values ('a1000000-0000-4000-8000-000000000001', 'Bad', 'Bad', current_date, 'Bad')$$, '42501', null, 'anonymous users cannot create campaigns');
select is_empty($$select id from storage.objects where bucket_id = 'campaign-media'$$, 'anonymous users cannot read private media');
reset role;

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"a0000000-0000-4000-8000-000000000001","role":"authenticated"}', true);
select results_eq('select count(*)::bigint from public.organizations', array[1::bigint], 'members see only their organization');
select results_eq('select count(*)::bigint from public.campaigns', array[1::bigint], 'members see only their campaigns');
select results_eq('select count(*)::bigint from public.content_items', array[1::bigint], 'members see only their content');
select results_eq('select count(*)::bigint from public.content_platforms', array[1::bigint], 'members see only their platform variants');
select is_empty($$update public.campaigns set message = 'Cross tenant update' where id = 'a2000000-0000-4000-8000-000000000002' returning id$$, 'cross-organization campaign updates affect no visible row');
select throws_ok($$insert into public.content_items (campaign_id, title, idea, created_by) values ('a2000000-0000-4000-8000-000000000002', 'Forbidden', 'Forbidden', 'a0000000-0000-4000-8000-000000000001')$$, '42501', null, 'members cannot insert content into another organization');
select throws_ok($$insert into public.assignments (content_item_id, profile_id, assigned_by) values ('a3000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001')$$, '42501', null, 'members cannot assign a profile from another organization');
select lives_ok($$insert into storage.objects (bucket_id, name, owner_id) values ('campaign-media', 'a1000000-0000-4000-8000-000000000001/a3000000-0000-4000-8000-000000000001/a5000000-0000-4000-8000-000000000001/image.jpg', 'a0000000-0000-4000-8000-000000000001')$$, 'members can create an authorized private media object');

select * from finish();
rollback;
