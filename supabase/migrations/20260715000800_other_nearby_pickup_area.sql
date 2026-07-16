-- Keep pickup locations broad without forcing students outside named hubs to
-- choose an inaccurate area.

insert into public.pickup_areas (slug, name, sort_order, is_active)
values ('other-nearby-area', 'Other nearby area', 11, true)
on conflict (slug) do update
set
  name = excluded.name,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;
