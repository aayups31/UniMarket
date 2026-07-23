# UniMarket

UniMarket is a private marketplace for verified University of Waterloo students. Students create an account with an exact `@uwaterloo.ca` address and password, verify the address once with a six-digit email code, then use email and password for normal sign-in. A separately provisioned moderator can remove inappropriate listings with an auditable reason.

## What is included

- Waterloo-only verified email/password authentication and required profile onboarding
- Authenticated marketplace with search, categories, featured/recent sections, and pagination
- Listing details with seller verification, condition, pickup area, and private listing-linked chat
- Draft, live preview, publish, edit, archive, and permanent-delete workflows
- Private resumable image uploads with progress, reordering, validation, and signed delivery
- Moderator-only removal flow backed by an append-only moderation log
- Realtime participant-only messaging with unread counts and durable listing context
- Row-level security, private Storage policies, database constraints, and pgTAP tests

## Prerequisites

- Node.js 22.13 or newer (`.nvmrc` pins the expected version)
- npm
- A Supabase project
- Docker only if you want to run the complete Supabase stack locally

## App setup

Install dependencies and create the local environment file:

```sh
nvm use
npm install
cp .env.example .env.local
```

Set these values in `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SECRET_KEY=sb_secret_your_server_only_key
```

The Supabase URL and publishable key are required by the web app. `NEXT_PUBLIC_SITE_URL` fixes the origin used by password-recovery callbacks; it falls back to the current request origin when omitted. Keep the secret key server-only; never prefix it with `NEXT_PUBLIC_`, expose it in client code, or commit `.env.local`.

Start the application:

```sh
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Connect the hosted Supabase project

Authenticate the Supabase CLI locally, link the intended project, and apply the migrations:

```sh
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

The checked-in local configuration enables the Waterloo signup hook, an eight-character password policy, six-digit signup codes that expire after 15 minutes, a 60-second resend interval, and exact local recovery callbacks. Signup codes use `{{ .Token }}` and never include a confirmation link, so email-security scanners cannot verify an account by opening a URL. After verification, normal access uses `signInWithPassword` and sends no email. Password recovery remains a separate short-lived PKCE link through `/auth/recovery-callback`.

Do not run `supabase config push` against the hosted project without first replacing every localhost URL and reviewing the rate limits in [`supabase/config.toml`](supabase/config.toml). The local two-emails-per-hour limit is intentionally conservative and is not a production setting.

For a public Waterloo beta, configure custom SMTP in the hosted Supabase project. Supabase's built-in sender is heavily restricted and is suitable only for owner/team testing.

Before deploying, also:

1. Set `NEXT_PUBLIC_SITE_URL` to the canonical deployed origin.
2. In **Supabase Dashboard → Authentication → Email Templates → Confirm signup**, set the subject to `Your UniMarket verification code` and paste [`supabase/templates/confirmation.html`](supabase/templates/confirmation.html). The hosted template must contain `{{ .Token }}` and no `{{ .ConfirmationURL }}`.
3. In the hosted email Auth settings, keep **Confirm email** enabled and set the OTP length to `6`, expiry to `900` seconds, and minimum resend interval to `60` seconds.
4. Keep only the canonical deployed recovery callback in the hosted redirect allowlist, plus localhost callbacks needed for development.
5. Create the moderator email documented in the product specification through a trusted admin path. The private database allowlist assigns that account the moderator role; public signup remains Waterloo-only.

Deploy the OTP-capable app before changing the hosted confirmation template. Disable new signups during that short rollout window, change the template and hosted OTP settings, and wait out the previous hosted confirmation-link expiry so every already-issued link is dead. Then complete one end-to-end test and re-enable signups. Delete and recreate any test accounts that an email scanner previously auto-confirmed.

See [`supabase/README.md`](supabase/README.md) for the full database, Storage, and security contract.

## Local Supabase development

With Docker running:

```sh
npm run supabase:start
npm run supabase:reset
npx supabase test db
```

`supabase start` prints the local API, Studio, and captured-email URLs. Open captured signup-code or password-recovery messages in Mailpit; password sign-in itself sends no email. Seeds provide reference categories and pickup areas, and test users should be created through the normal signup flow.

## Quality checks

```sh
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
```

The browser suite exercises desktop and mobile Chrome. Playwright starts the development server automatically when one is not already running.

## Project map

- `src/app` — Next.js App Router pages, layouts, loading, and error states
- `src/features/auth` and `src/features/onboarding` — email/password, recovery, and profile flows
- `src/features/marketplace` — discovery queries, filters, cards, and listing details
- `src/features/listings` — editor, uploads, ownership actions, and moderation UI
- `src/features/messages` — listing conversations, Realtime inbox UI, and message validation
- `src/lib/supabase` — typed browser/server Supabase clients
- `supabase/migrations` — schema, workflows, RLS, and Storage policies
- `supabase/tests` — database security and workflow tests
- `tests/e2e` — Playwright smoke coverage

The implementation decisions and product scope are recorded in [`unimarket.md`](unimarket.md) and [`listing.md`](listing.md).
