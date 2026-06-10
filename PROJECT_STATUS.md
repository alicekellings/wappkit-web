# Wappkit Project Status

## Current State

The project has been rebuilt into a lightweight multi-tool website with no login, no user center, and no account dashboard.

Deployment source of truth:

- GitHub repository: `https://github.com/alicekellings/wappkit-web`
- deployment model: GitHub push triggers Vercel deployment
- current Vercel URL: `https://wappkit-web.vercel.app/`
- final production domain: `https://wappkit.com/`

Current verified areas:

- homepage
- tools directory
- tool detail pages
- blog
- docs
- download page
- license center
- license retrieval page
- Creem checkout API route
- Creem webhook route
- license retrieval API route
- license validate API route
- license deactivate API route
- license unbind API route
- internal license admin page

## Brand / Domain Boundary

Keep the public positioning clear:

- `https://www.wappkit.com` is the main Wappkit website for SaaS products, software tools, product pages, documentation, licensing, checkout, and support.
- `https://api.wappkit.com` is the developer API platform for token-based API access, quota controls, usage logs, and model/API pricing visibility.
- In payment provider reviews, describe the API platform as developer infrastructure for legitimate app, automation, coding assistant, and internal workflow integrations.
- Avoid using risky wording in payment-provider forms or public review text, such as account sharing, recharge, unlocking, resale, unlimited credits, or proxying third-party accounts.

DNS ownership:

- Domain: `wappkit.com`
- DNS provider: Cloudflare
- Cloudflare login/account note: `asphero@gmail.com`

## Current Launch Status

The website and desktop app license flow is now working as a real end-to-end product flow.

Production status:

- production domain is live on `https://www.wappkit.com`
- root domain redirects to `www`
- GitHub push triggers Vercel deployment
- production checkout is back on the live Creem product after temporary test-mode validation
- internal admin page is available at `https://www.wappkit.com/ops/licenses`
- `Wappkit App Setup` production license validate and deactivate endpoints were re-verified on `2026-04-25`
- production Upstash Redis now points at the new `funny-guppy-84113` database after redeploy
- production `CRON_SECRET` is now configured and the Upstash keepalive route has been verified

## Waffo Pancake Review

Status as of 2026-06-10:

- `https://pancake.waffo.ai/` merchant/business submission for Wappkit has been submitted and is under review.
- Review page says Waffo will notify by email after review completion.
- Follow up in a few days if no email arrives.

Submitted positioning:

- Wappkit is an independent software and SaaS business under `wappkit.com`.
- Main website sells/supports software tools, SaaS utilities, licensing, checkout, and docs.
- API service at `api.wappkit.com` is described as a developer API platform with tokens, quotas, usage logs, and pricing visibility.

Domain verification notes:

- HTML meta tag was deployed first, but Waffo verification did not pass.
- Well-known file verification was deployed at `/.well-known/waffo-challenge.txt`; it was publicly reachable, but Waffo still failed.
- `/.well-known/` was excluded from geo-block middleware so verification files are globally reachable.
- DNS TXT verification succeeded after adding Cloudflare TXT:
  - type: `TXT`
  - name: `_waffo-challenge`
  - final name: `_waffo-challenge.wappkit.com`
  - value: `waffo-verify=4493de39f00772e08785585161a0a244`
- DNS check command:

```powershell
Resolve-DnsName -Type TXT _waffo-challenge.wappkit.com -Server 1.1.1.1
```

Important: if Waffo verification is retried later, it may generate a new challenge value. Always copy the latest value from Waffo before editing DNS or files.

## Current Vercel Environment Snapshot

The current deployment is not only local. The site is already deployed to:

- Vercel preview/primary project URL: `https://wappkit-web.vercel.app/`
- intended real domain: `https://www.wappkit.com`

Based on the current Vercel project settings screenshot reviewed on `2026-04-24`,
these env variable names are already present in the project:

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

Important note:

- this repo documents variable names and deployment state only
- secret values are intentionally not written into local docs

Current `Wappkit App Setup` status:

- `CREEM_PRODUCT_WAPPKIT_APP_SETUP_ID` has been added and confirmed in Vercel
- production activation and self-service device removal have both been verified manually

Current isolated preview test branch:

- `wappkit-app-setup-preview-test`
- reference doc: `PREVIEW_TESTING.md`
- environment split doc: `DEPLOYMENT_ENVIRONMENTS.md`

Before the next manual checkout test, verify:

1. which public domain is the active test target:
   - `https://wappkit-web.vercel.app`
   - or `https://www.wappkit.com`
2. `NEXT_PUBLIC_APP_URL` matches that target
3. Creem webhook points to the same target domain
4. `CREEM_TEST_MODE` is still `true` for the current test cycle

## End-to-End Flow Verified

The following path has been verified on the deployed site:

1. open the Reddit Toolbox product page
2. start checkout through Creem
3. complete a Creem test-mode payment on the deployed production domain
4. receive an order ID and checkout ID on the success page
5. retrieve the issued license from `/license/retrieve`
6. activate the desktop app with the retrieved license
7. confirm the license becomes device-bound on the website
8. confirm the website shows the active device and offers self-service unbind

Additional `Wappkit App Setup` verification completed on `2026-04-25`:

1. retrieve the issued production license from `/license/retrieve`
2. activate the desktop app against `https://www.wappkit.com/api/license/validate`
3. confirm desktop UI switches to `Premium active`
4. remove the license from the same desktop device through `https://www.wappkit.com/api/license/deactivate`
5. confirm desktop UI returns to `Premium locked`

## Validation Completed

- `npm test`
- `npm run lint`
- `npm run build`

## Current Commercial Flow

1. customer opens a tool page
2. customer starts checkout through Creem
3. Creem webhook sends order data to Wappkit
4. Wappkit mirrors order and license data
5. customer retrieves the license with `order ID + purchase email`
6. desktop app validates the license through `/api/license/validate`
7. one license key remains bound to one active device
8. customer can self-unbind from `/license/retrieve`
9. internal support can search and unbind from `/ops/licenses`

## Current Persistence Strategy

- first choice: Upstash Redis
- local fallback: in-memory storage for development only
- future option: migrate to a more formal third-party database if needed

## Pending Work

- expand the internal admin tools beyond search + unbind
- decide whether to add admin actions like disable license, notes, and resend support
- migrate old blog content from the previous site
- optionally enable Resend for original-email license resend
- rotate `UPSTASH_REDIS_REST_TOKEN` later as a security cleanup item
- production now has a code path ready for a daily Upstash keepalive cron at `/api/internal/upstash-keepalive`
- complete one true live production payment when convenient
- rotate the exposed Upstash token because it was visible in screenshots during manual ops
- rotate the exposed `CRON_SECRET` later because it appeared in manual setup screenshots
