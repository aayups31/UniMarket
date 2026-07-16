-- Safe, environment-independent reference data only.
-- Auth users are deliberately not inserted with SQL: Supabase Auth owns that
-- schema, and local users should be created through email/password signup.

insert into public.categories (slug, name, icon, sort_order, is_active)
values
  ('electronics', 'Electronics', 'laptop', 1, true),
  ('books', 'Books', 'book-open', 2, true),
  ('household-items', 'Household Items', 'armchair', 3, true),
  ('clothing', 'Clothing', 'shirt', 4, true)
on conflict (slug) do update
set
  name = excluded.name,
  icon = excluded.icon,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.pickup_areas (slug, name, sort_order, is_active)
values
  ('icon', 'ICON', 1, true),
  ('uwp', 'UWP', 2, true),
  ('rev', 'REV', 3, true),
  ('cmh', 'CMH', 4, true),
  ('v1', 'V1', 5, true),
  ('lester-street', 'Lester Street', 6, true),
  ('university-plaza', 'University Plaza', 7, true),
  ('waterloo-campus', 'Waterloo Campus', 8, true),
  ('columbia-street', 'Columbia Street', 9, true),
  ('phillip-street', 'Phillip Street', 10, true),
  ('other-nearby-area', 'Other nearby area', 11, true)
on conflict (slug) do update
set
  name = excluded.name,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;
