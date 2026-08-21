insert into public.platforms (id, key, name, sort_order)
values
  (1, 'facebook', 'Facebook', 1),
  (2, 'instagram', 'Instagram', 2),
  (3, 'facebook_community_group', 'Local Facebook community groups', 3)
on conflict (id) do update set key = excluded.key, name = excluded.name, sort_order = excluded.sort_order;

insert into public.organizations (id, name, slug)
values ('b0000000-0000-4000-8000-000000000001', 'Valley Creek Church', 'valley-creek-church')
on conflict (id) do update set name = excluded.name, slug = excluded.slug;

insert into public.campaigns (id, organization_id, name, location, starts_on, ends_on, message, selling_points, ai_guidance)
values (
  'b0000000-0000-4000-8000-000000000002',
  'b0000000-0000-4000-8000-000000000001',
  'Bridge Fall 2026',
  'Malvern, Pennsylvania',
  '2026-09-09',
  '2026-11-11',
  'A welcoming ten-week place to explore Christianity, ask honest questions, and share a meal without pressure.',
  array['Free dinner', 'Free childcare', 'Questions are welcome', 'No pressure', 'Ten-week course'],
  'Write primarily for people who do not regularly attend church. Welcome questions, doubt, skepticism, and exploration. Avoid Christian jargon and corporate advertising language. Use natural conversation without assuming belief. Remain consistent with historic evangelical Christianity and prefer authentic testimony and personal invitation.'
)
on conflict (id) do update set
  name = excluded.name,
  location = excluded.location,
  starts_on = excluded.starts_on,
  ends_on = excluded.ends_on,
  message = excluded.message,
  selling_points = excluded.selling_points,
  ai_guidance = excluded.ai_guidance;
