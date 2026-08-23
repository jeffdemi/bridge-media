insert into public.platforms (id, key, name, sort_order)
values
  (1, 'instagram', 'Instagram', 1),
  (2, 'facebook', 'Facebook', 2),
  (3, 'x', 'X', 3),
  (4, 'tiktok', 'TikTok', 4)
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

insert into public.content_types (id, key, name, sort_order)
values
  (1, 'text', 'Text', 1), (2, 'image', 'Image', 2),
  (3, 'video', 'Video', 3), (4, 'testimony', 'Testimony', 4),
  (5, 'question', 'Question', 5), (6, 'invitation', 'Invitation', 6),
  (7, 'quote', 'Quote', 7)
on conflict (id) do update set key = excluded.key, name = excluded.name, sort_order = excluded.sort_order;

insert into public.campaign_themes (id, campaign_id, name, description, sort_order)
values
  ('b0000000-0000-4000-8000-000000000101', 'b0000000-0000-4000-8000-000000000002', 'Questions', 'Honest questions about God and Christianity.', 1),
  ('b0000000-0000-4000-8000-000000000102', 'b0000000-0000-4000-8000-000000000002', 'Testimonies', 'Personal Bridge stories.', 2),
  ('b0000000-0000-4000-8000-000000000103', 'b0000000-0000-4000-8000-000000000002', 'Invitations', 'Simple invitations to explore Bridge.', 3),
  ('b0000000-0000-4000-8000-000000000104', 'b0000000-0000-4000-8000-000000000002', 'Countdown', 'Timely reminders before the course begins.', 4)
on conflict (id) do update set name = excluded.name, description = excluded.description, sort_order = excluded.sort_order;
