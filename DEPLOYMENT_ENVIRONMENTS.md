# Deployment Environments

## Purpose

This file records the current `wappkit-web` environment split so future checkout, webhook, license, and desktop activation work does not mix Preview and Production by accident.

Secrets are intentionally not stored here. Only variable names, URLs, branch names, and operational rules are recorded.

## Current Branches

- production branch: `main`
- dedicated preview test branch: `wappkit-app-setup-preview-test`

## Production Environment

Use this for the live public site and real customer traffic.

- public production domain: `https://www.wappkit.com`
- root domain behavior: `https://wappkit.com` redirects to `https://www.wappkit.com`
- DNS provider: Cloudflare
- Cloudflare account note: `asphero@gmail.com`
- Vercel project URL: `https://wappkit-web.vercel.app`
- production webhook target: `https://www.wappkit.com/api/webhook/creem`
- production license validate endpoint: `https://www.wappkit.com/api/license/validate`
- production license deactivate endpoint: `https://www.wappkit.com/api/license/deactivate`
- production license retrieval page: `https://www.wappkit.com/license/retrieve`

Production domain boundary:

- `www.wappkit.com` / `wappkit.com`: main SaaS and software website, checkout, docs, licensing, and support.
- `api.wappkit.com`: separate developer API platform. Do not describe the main site as an AI API resale site in payment-provider reviews.

Production Vercel variables should represent live values:

- `NEXT_PUBLIC_APP_URL=https://www.wappkit.com`
- `CREEM_TEST_MODE=false`
- `CREEM_API_KEY=<live key>`
- `CREEM_WEBHOOK_SECRET=<live webhook secret>`
- `CREEM_PRODUCT_REDDIT_TOOLBOX_ID=<live product id>`
- `CREEM_PRODUCT_WAPPKIT_APP_SETUP_ID=<live product id when this tool goes live>`
- `UPSTASH_REDIS_REST_URL=<production license store>`
- `UPSTASH_REDIS_REST_TOKEN=<production license store token>`
- `CRON_SECRET=<production keepalive auth>`
- `INTERNAL_ADMIN_TOKEN=<support admin token>`

## Preview Environment

Use this for isolated test-mode checkout work that must not change the live production site.

- preview branch: `wappkit-app-setup-preview-test`
- observed branch preview URL on 2026-04-24:
  `https://wappkit-web-git-wappkit-app-set-bd9e4b-alices-projects-22f3fd00.vercel.app`
- observed deployment-specific preview URL on 2026-04-24:
  `https://wappkit-phebtmg75-alices-projects-22f3fd00.vercel.app`
- preview webhook target pattern:
  `https://<preview-url>.vercel.app/api/webhook/creem`

Preview Vercel variables should represent test values:

- `NEXT_PUBLIC_APP_URL=https://<preview-url>.vercel.app`
- `CREEM_TEST_MODE=true`
- `CREEM_API_KEY=<Creem test key>`
- `CREEM_WEBHOOK_SECRET=<Creem test webhook secret>`
- `CREEM_PRODUCT_WAPPKIT_APP_SETUP_ID=prod_6wN9wGJ08OY9y75J2s1gDZ`
- `UPSTASH_REDIS_REST_URL=<preview test license store>`
- `UPSTASH_REDIS_REST_TOKEN=<preview test license store token>`

Preview rules:

- the webhook must point to the same Preview URL that `NEXT_PUBLIC_APP_URL` uses
- do not point test webhook traffic to `https://www.wappkit.com/api/webhook/creem`
- if Preview env values change, redeploy the Preview deployment

## Current Operational Difference

The important split is:

- Production = live domain + live Creem mode + live webhook + production API
- Preview = preview domain + Creem test mode + preview webhook + preview API

If one piece crosses environments, the flow breaks. The most common mistakes are:

- page opens on Preview but checkout success returns to Production
- Preview webhook is created, but `NEXT_PUBLIC_APP_URL` still points to Production
- desktop app opens Preview pages, but license activation still calls Production APIs
- Production still points at an old or invalid Upstash Redis database

## Desktop App Environment Rules

`WappkitAppSetup` now supports these environment variables:

- `WAPPKIT_APP_URL`
- `WAPPKIT_LICENSE_VALIDATE_URL`
- `WAPPKIT_LICENSE_DEACTIVATE_URL`

Behavior after the 2026-04-25 desktop patch:

1. If `WAPPKIT_LICENSE_VALIDATE_URL` or `WAPPKIT_LICENSE_DEACTIVATE_URL` is set, those exact URLs are used.
2. Otherwise, if `WAPPKIT_APP_URL` is set, the desktop app derives:
   - `${WAPPKIT_APP_URL}/api/license/validate`
   - `${WAPPKIT_APP_URL}/api/license/deactivate`
3. If nothing is set, it falls back to `https://www.wappkit.com`.

This keeps the desktop app on the same environment as the web pages during testing.

## Known Observations

Observed from terminal tests on 2026-04-25:

- `POST https://www.wappkit.com/api/license/validate` returned `500 {"valid":false,"message":"fetch failed"}`
- this indicates the production license API was reachable, but its own backend dependency failed during validation
- a likely cause is Production still using an outdated or broken `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
- direct terminal access to the Preview validate endpoint returned `401`, which suggests Vercel preview protection or auth is enabled for that preview deployment

Observed after Production env correction and redeploy on 2026-04-25:

- `POST https://www.wappkit.com/api/license/validate` returned a normal `404` for a fake key instead of `500`
- the real `Wappkit App Setup` license activated successfully in the desktop app
- the same license was removed successfully through the desktop app deactivate flow
- this confirms Production is now using the corrected Upstash Redis configuration
- unauthenticated `GET https://www.wappkit.com/api/internal/upstash-keepalive` returned `401`
- authenticated keepalive execution returned `200` and wrote the keepalive marker successfully
- this confirms Production `CRON_SECRET` is configured and the keepalive route is operational

Current implication:

- Production desktop activation against `https://www.wappkit.com` is working again after the Upstash fix and Production redeploy
- Preview desktop activation may still fail unless the preview deployment is publicly reachable to the desktop app

Observed during Waffo Pancake onboarding on 2026-06-10:

- Waffo/Pancake URL: `https://pancake.waffo.ai/`
- Business submission status: under review.
- Domain verification eventually succeeded with Cloudflare DNS TXT for `wappkit.com`.
- TXT record:
  - final name: `_waffo-challenge.wappkit.com`
  - value: `waffo-verify=4493de39f00772e08785585161a0a244`
- HTML meta and well-known file approaches were deployed but did not complete verification reliably.
- `/.well-known/` is excluded from geo-block middleware to keep future verification files publicly reachable.
- If Waffo is retried later, confirm the current challenge value because Waffo may rotate it.

## Minimum Checklist Before Future Testing

Before any new paid desktop product test:

1. confirm the active test branch
2. confirm the exact public URL being tested
3. confirm `NEXT_PUBLIC_APP_URL` matches that same URL
4. confirm webhook target matches that same URL
5. confirm which Creem mode is active
6. confirm which Upstash database that environment points to
7. confirm whether the desktop app is using:
   - production defaults
   - `WAPPKIT_APP_URL`
   - or explicit override URLs

## Related Files

- `PREVIEW_TESTING.md`
- `PROJECT_STATUS.md`
- `README.md`
