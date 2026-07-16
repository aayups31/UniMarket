# UniMarket Supabase foundation

This directory is the source of truth for the UniMarket database, authentication boundary, and listing-image bucket. Migrations are ordered and safe to apply with the Supabase CLI.

## Local development

From the repository root:

```sh
npm run supabase:start
npm run supabase:reset
```

Local API, Studio, and captured-email URLs are printed by `supabase start`. The local Auth configuration uses Supabase's default confirmation and recovery emails, requires email verification before password sign-in, and invokes `public.hook_restrict_signup` before creating a user.

Reference categories and popular pickup areas are seeded automatically. Create test users through email/password signup; `seed.sql` intentionally does not write directly to Supabase's `auth` schema.

Run database tests after the stack is healthy:

```sh
npx supabase test db
```

## Hosted project setup

After linking the correct project, review the migration list and apply it:

```sh
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

Review and push the checked-in Auth policy and callback configuration:

```sh
npx supabase config push
```

The configuration push enables the before-user-created hook, an eight-character password policy requiring uppercase, lowercase, and a number, a 900-second email-action expiry, a 60-second resend interval, and exact localhost confirmation/recovery callback URLs. It deliberately leaves Supabase's default templates unchanged. Signup confirmation returns through `/auth/callback`; password recovery returns through `/auth/recovery-callback`. Both complete a PKCE exchange, while ordinary password sign-in sends no email.

For the MVP, the hosted project can continue using Supabase's built-in email provider. That provider only sends to Supabase organization team-member addresses and has restrictive email limits, so it is appropriate for owner/team testing rather than an open student beta. Custom SMTP and branded templates are deferred until production preparation.

Before deploying:

1. Set `NEXT_PUBLIC_SITE_URL` to the deployed origin.
2. Replace the localhost Site URL and exact allowed redirect URLs in `config.toml` with the deployed origin and its exact `/auth/callback` and `/auth/recovery-callback` URLs, then push the reviewed change.
3. In **Authentication > Users**, create `aayupsuw@gmail.com` through a trusted admin path. That exact address is in the private administrative allowlist, and the profile trigger assigns it the `moderator` role. The migration never creates credentials or sends an invitation.

The previously provisioned moderator has no shared or committed password. Use the app's password-recovery flow to set one privately. When SMTP is added later, keep its credentials out of source control and enter them directly in the Supabase Dashboard.

The public signup path accepts only addresses matching the exact `@uwaterloo.ca` domain. A database trigger repeats that check for user-creation paths that do not invoke the Auth hook. Account email changes are disabled because the verified university email is an immutable identity field.

## Listing image contract

`listing-images` is a private bucket with a 5 MiB per-file limit, a maximum of six images per listing, and JPEG, PNG, or WebP MIME restrictions. Object paths must be:

```text
<seller uuid>/<listing uuid>/<random safe filename>.<jpg|jpeg|png|webp>
```

Use new object names rather than upsert/move; no Storage `UPDATE` policy is granted. The expected upload sequence is:

1. Create or save the draft listing.
2. Register the exact owner/listing-scoped path in `listing_images` with `upload_status = 'pending'`.
3. Upload the object to that reserved path. Storage rejects paths without matching pending metadata.
4. Update the metadata row to `upload_status = 'uploaded'`. The trigger verifies the real object and records authoritative MIME/size metadata.
5. Call `publish_listing(listing_id)`. Publishing locks the draft and validates all fields, contiguous image order, upload states, and Storage objects atomically.

For a published listing, register and upload a replacement before removing the old image so at least one uploaded image always remains. Delete the old metadata row first, then its Storage object; the database rejects detaching the final published image. For a draft, sold, or archived listing, delete the Storage object first and then its metadata. To permanently delete a listing, archive it first, delete its Storage objects, delete its image metadata rows, and then delete the listing row. This order avoids orphaned private objects.

## Security model

- Profiles are private to their owner. `seller_profiles` exposes only a shortened display name and approved trust facts; seller email is available one listing at a time through an explicit authenticated contact action.
- Students can manage only their own listings and images. Drafts remain owner-only.
- Moderators cannot create listings. `remove_listing` soft-removes a non-draft listing and appends an immutable moderation event.
- `publish_listing` is the only supported transition into `published`; direct client updates are rejected by a trigger.
- Secret/service credentials remain server-only. No key belongs in SQL, seeds, or client code.
