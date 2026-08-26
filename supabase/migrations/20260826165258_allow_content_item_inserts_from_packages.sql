-- Split the broad write policy by operation. New items must be authorized
-- through their existing package because content_items.id cannot resolve an
-- organization until after the insert succeeds.
drop policy items_member_read on public.content_items;
drop policy items_team_write on public.content_items;

create policy items_member_read_from_package
on public.content_items
for select
to authenticated
using (
  exists (
    select 1
    from public.content_packages as cp
    where cp.id = content_items.package_id
      and public.is_organization_member(public.idea_organization(cp.idea_id))
  )
);

create policy items_team_insert_from_package
on public.content_items
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and exists (
    select 1
    from public.content_packages as cp
    where cp.id = content_items.package_id
      and public.has_app_role(
        public.idea_organization(cp.idea_id),
        array['media_team', 'approver', 'admin']::public.app_role[]
      )
  )
);

create policy items_team_update
on public.content_items
for update
to authenticated
using (
  public.has_app_role(
    public.item_organization(id),
    array['media_team', 'approver', 'admin']::public.app_role[]
  )
)
with check (
  public.has_app_role(
    public.item_organization(id),
    array['media_team', 'approver', 'admin']::public.app_role[]
  )
);

create policy items_team_delete
on public.content_items
for delete
to authenticated
using (
  public.has_app_role(
    public.item_organization(id),
    array['media_team', 'approver', 'admin']::public.app_role[]
  )
);
