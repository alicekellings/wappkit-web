# Preview Testing

## Purpose

This file records the dedicated preview workflow for testing new paid desktop products without affecting the live `www.wappkit.com` production checkout setup.

## Active Preview Branch

- branch name: `wappkit-app-setup-preview-test`
- created from: `main`
- base commit at branch creation: `c55d4ff`
- purpose: test `Wappkit App Setup` Creem checkout and license flow in Vercel Preview using Creem test mode

## Why This Branch Exists

The main production site currently serves:

- production domain: `https://www.wappkit.com`
- live commercial traffic
- existing `reddit-toolbox` production flow

Because `CREEM_TEST_MODE` is a project-level environment switch, changing the current production project to test mode would affect the live site.

This branch exists so we can:

1. trigger a Vercel Preview deployment
2. use Creem test mode only in Preview
3. keep production checkout behavior unchanged

## Required Vercel Preview Env

For this branch's Preview deployment, set these values in the `Preview` environment:

```env
NEXT_PUBLIC_APP_URL=https://<preview-url>.vercel.app
CREEM_TEST_MODE=true
CREEM_API_KEY=<creem test api key>
CREEM_WEBHOOK_SECRET=<creem test webhook secret>
CREEM_PRODUCT_WAPPKIT_APP_SETUP_ID=prod_6wN9wGJ08OY9y75J2s1gDZ
```

Keep production unchanged:

```env
CREEM_TEST_MODE=false
CREEM_API_KEY=<live key>
CREEM_PRODUCT_REDDIT_TOOLBOX_ID=<live product id>
```

## Webhook Rule

When this branch is under test, the Creem test webhook should point to the matching Preview deployment:

```text
https://<preview-url>.vercel.app/api/webhook/creem
```

Do not point the test webhook at `https://www.wappkit.com/api/webhook/creem` during preview-only testing.

## Success URL Rule

This project currently builds checkout success URLs from:

- `NEXT_PUBLIC_APP_URL`

That means the Preview deployment must use its own Preview URL in `NEXT_PUBLIC_APP_URL`, otherwise checkout success will jump back to the production domain.

## Test Flow For This Branch

1. push this branch to GitHub
2. wait for Vercel to generate a Preview deployment URL
3. set Preview-only env values for this branch
4. redeploy Preview if env values change
5. open `/tools/wappkit-app-setup` on the Preview URL
6. test checkout
7. test `/checkout/success`
8. test `/license/retrieve`
9. test desktop activation and deactivate

## Cleanup Rule

After the `Wappkit App Setup` test cycle is complete:

1. keep production env values unchanged
2. decide whether to merge the product work back into `main`
3. remove or archive this branch when it is no longer needed

## Reuse Rule

For future products, create a separate Preview branch with the same pattern:

```text
<tool-slug>-preview-test
```

Examples:

- `keyword-radar-preview-test`
- `clip-exporter-preview-test`

This keeps test commerce isolated from live commerce.
