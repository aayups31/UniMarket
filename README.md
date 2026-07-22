# UniMarket

UniMarket is a private marketplace for verified University of Waterloo students. Students create an account with an exact `@uwaterloo.ca` address and password, verify the address once by email, then use email and password for normal sign-in. A separately provisioned moderator can remove inappropriate listings with an auditable reason.

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

The Supabase URL and publishable key are required by the web app. `NEXT_PUBLIC_SITE_URL` fixes the origin used by email callbacks; it falls back to the current request origin when omitted. Keep the secret key server-only; never prefix it with `NEXT_PUBLIC_`, expose it in client code, or commit `.env.local`.

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

Then review and push the Auth policy and local callback URLs:

```sh
npx supabase config push
```

The checked-in configuration enables the Waterloo signup hook, an eight-character password policy, 15-minute email-action links, a 60-second resend interval, and exact local confirmation and recovery callbacks. It intentionally leaves Supabase's default email templates unchanged. Signup sends one confirmation link through `/auth/callback`; after verification, normal access uses `signInWithPassword` and sends no email. Password recovery uses `/auth/recovery-callback` and a short-lived PKCE session.

Supabase's built-in sender is sufficient for owner/team MVP testing, but it only delivers to addresses belonging to members of the Supabase organization and is heavily rate-limited. This mode is not suitable for a wider Waterloo beta. Do not grant untrusted testers project access just so they can receive an email; configure custom SMTP before opening sign-in beyond the project team.

Before deploying, also:

1. Set `NEXT_PUBLIC_SITE_URL` to the deployed origin.
2. Replace the localhost Site URL and redirect URLs in [`supabase/config.toml`](supabase/config.toml) with the deployed origin and its exact `/auth/callback` and `/auth/recovery-callback` URLs, then push the reviewed change.
3. Create the moderator email documented in the product specification through a trusted admin path. The private database allowlist assigns that account the moderator role; public signup remains Waterloo-only.

Custom SMTP and branded email templates are deferred until production preparation; neither is required for team-only signup confirmation and password recovery.

See [`supabase/README.md`](supabase/README.md) for the full database, Storage, and security contract.

## Local Supabase development

With Docker running:

```sh
npm run supabase:start
npm run supabase:reset
npx supabase test db
```

`supabase start` prints the local API, Studio, and captured-email URLs. Open captured signup-confirmation or password-recovery messages in Mailpit; password sign-in itself sends no email. Seeds provide reference categories and pickup areas, and test users should be created through the normal signup flow.

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
