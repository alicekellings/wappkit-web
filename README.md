# Wappkit Web

Wappkit is an English-first multi-tool product website built for lightweight desktop and web utilities.

This project includes:

- a platform homepage
- tool directory pages
- per-tool product pages
- a shared blog
- shared docs
- Creem checkout integration
- license retrieval by `order ID + purchase email`
- remote license validation for the desktop app
- device-bound license activation and deactivate flows
- internal admin support page for license search and manual unbind
- optional email resend support via Resend

## Stack

- Next.js 14
- React 18
- Tailwind CSS
- Contentlayer
- Creem
- Upstash Redis
- Resend
- Vercel

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in the required values.

3. Start development:

```bash
npm run dev
```

4. Run validation when needed:

```bash
npm test
npm run lint
npm run build
```

## Core Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPPORT_EMAIL=asphero@gmail.com

CREEM_API_KEY=
CREEM_TEST_MODE=true
CREEM_PRODUCT_WAPPKIT_APP_SETUP_ID=
CREEM_PRODUCT_REDDIT_TOOLBOX_ID=
CREEM_WEBHOOK_SECRET=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
CRON_SECRET=

RESEND_API_KEY=
EMAIL_FROM=

INTERNAL_ADMIN_TOKEN=
```

Current product-specific billing env keys:

- `CREEM_PRODUCT_REDDIT_TOOLBOX_ID`
- `CREEM_PRODUCT_WAPPKIT_APP_SETUP_ID`

## Current Architecture

- `Creem` issues licenses
- `Wappkit` mirrors order and license data for retrieval
- current retrieval flow shows licenses directly on the page
- the desktop app validates licenses against `/api/license/validate`
- each license key can stay bound to one active device at a time
- users can unbind through `/license/retrieve`
- internal support can search and unbind through `/ops/licenses`
- optional email resend is reserved for later enablement
- Upstash is the first persistence layer, with room to migrate later
- a Vercel cron keeps the Upstash database active with a daily keepalive write

## Deployment Notes

- deployment model: GitHub + Vercel
- GitHub repository:
  `https://github.com/alicekellings/wappkit-web`
- pushes to the main repository are expected to trigger automatic Vercel deployments
- current Vercel deployment URL:
  `https://wappkit-web.vercel.app/`
- final production domain target:
  `https://wappkit.com/`
- add the required environment variables in Vercel
- use the public webhook endpoint:
  `https://wappkit.com/api/webhook/creem`
- test payments in Creem test mode before switching the production domain

## Current Vercel Env Snapshot

As of `2026-04-24`, the Vercel project UI already shows these env variable names as present.
This is a deployment snapshot only; secret values are intentionally not stored in repo docs.

Confirmed visible in Vercel:

- `NEXT_PUBLIC_SUPPORT_EMAIL`
- `CREEM_WEBHOOK_SECRET`
- `CREEM_PRODUCT_REDDIT_TOOLBOX_ID`
- `CREEM_API_KEY`
- `CREEM_TEST_MODE`
- `INTERNAL_ADMIN_TOKEN`
- `NEXT_PUBLIC_APP_URL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `CRON_SECRET`

## Upstash Keepalive

- `vercel.json` registers a daily cron for `/api/internal/upstash-keepalive`
- Vercel Hobby cron jobs currently run at most once per day, so daily is the safe minimum
- set `CRON_SECRET` in Vercel so the cron request carries `Authorization: Bearer <CRON_SECRET>`
- the keepalive route writes a timestamped marker key into Upstash, which is enough to prevent free-tier inactivity archival as long as production keeps running
- Vercel cron jobs hit the production deployment URL, so this protects the production Upstash database; preview-only databases can still archive if left unused

Current action for `Wappkit App Setup`:

- add or confirm `CREEM_PRODUCT_WAPPKIT_APP_SETUP_ID`
- confirm `NEXT_PUBLIC_APP_URL` matches the domain being tested
- confirm the current webhook target matches the same domain

## Preview Testing

For isolated Creem test-mode work that must not affect `www.wappkit.com`, use:

- `PREVIEW_TESTING.md`
- `DEPLOYMENT_ENVIRONMENTS.md`

Current dedicated preview branch recorded there:

- `wappkit-app-setup-preview-test`

## Production Launch Checklist

- rotate `CREEM_API_KEY`, `CREEM_WEBHOOK_SECRET`, and `UPSTASH_REDIS_REST_TOKEN` before going live if the test values were exposed
- switch `CREEM_TEST_MODE` to `false` after validating the live Creem product setup
- replace the temporary Creem product naming and media with the final `Wappkit` product assets
- confirm the production webhook target is `https://wappkit.com/api/webhook/creem`

## Current Verified Result

The following flow has already been verified end to end:

1. start checkout from `https://www.wappkit.com/tools/reddit-toolbox`
2. complete Creem payment
3. receive order details on the Wappkit success page
4. retrieve the license from `https://www.wappkit.com/license/retrieve`
5. activate the desktop app with the issued license
6. confirm the device binding appears on the retrieval page
