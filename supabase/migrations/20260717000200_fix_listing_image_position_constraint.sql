-- The original contract created the position uniqueness as an index while the
-- reorder workflow correctly treated it as a deferrable constraint. Replace it
-- with the intended constraint and normalize any positions left by interrupted
-- uploads before restoring the uniqueness guarantee.

alter table public.listing_images
  drop constraint if exists listing_images_listing_position_key;

drop index if exists public.listing_images_listing_position_key;

with ranked_images as (
  select
    image.id,
    row_number() over (
      partition by image.listing_id
      order by image.position, image.created_at, image.id
    ) - 1 as next_position
  from public.listing_images as image
)
update public.listing_images as image
set position = ranked_images.next_position
from ranked_images
where image.id = ranked_images.id
  and image.position is distinct from ranked_images.next_position;

alter table public.listing_images
  add constraint listing_images_listing_position_key
  unique (listing_id, position)
  deferrable initially immediate;

comment on constraint listing_images_listing_position_key on public.listing_images is
  'Keeps each listing image position unique while allowing atomic image reordering.';
