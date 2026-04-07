# Wappkit Tool Launch SOP

## Purpose

This document fixes the standard workflow for launching future Wappkit tools.

The goal is not to make every tool unique.
The goal is to make every launch repeatable, low-friction, and easy to support.

Every future small tool should reuse the same commercial model:

- free functionality is available immediately
- paid functionality unlocks with a license key
- the website explains the product, handles checkout, and supports retrieval
- the desktop app handles activation and upgrade UX

This is the default model unless a future tool has a strong reason to break it.

## Core Product Model

Every Wappkit tool should follow this baseline:

- `Free`
  - user can install and use a meaningful subset of the tool
  - no account is required
  - no login is required
  - no license key is required
- `Pro`
  - user buys once through the website
  - user receives a license key
  - user pastes the key into the app
  - app validates remotely and unlocks paid features

Important rule:

- do not build a normal `login page` or `account system`
- build an `activation page` or `enter license` page inside the tool

For Wappkit, the correct mental model is:

- website = storefront + docs + download + support
- desktop app = free mode + activation + paid unlock

## Standard User Journey

The standard user path should be:

1. user lands on `/tools/[slug]`
2. user understands the tool and what is free vs paid
3. user downloads the app from `/download` or the product page
4. user uses the free mode first
5. user clicks upgrade
6. user buys through Creem
7. website shows success page with order details
8. user retrieves or copies the license key
9. user opens the app and enters the license key
10. app validates the key against Wappkit
11. paid features unlock

This flow should remain stable across tools.

## Standard Responsibilities

### Website responsibilities

The website should do these jobs:

- tool landing page
- global download center
- checkout entry
- success page
- license center
- license retrieval
- help docs
- blog content
- internal license operations
- version metadata for desktop updates

The website should not do these jobs:

- user signup
- user login
- password reset
- account center
- subscription dashboard
- web-side entitlement UI tied to sessions

### Desktop app responsibilities

The desktop app should do these jobs:

- allow free usage
- clearly show what is locked
- provide `Buy License`
- provide `Retrieve License`
- provide `Enter License`
- validate the license remotely
- persist local activation state
- provide `Remove License From This Device`
- support update checks

The desktop app should not pretend the license is an account login.

## Standard License Rules

### License shape

Each tool should have:

- `toolSlug`
- product name
- free tier
- pro tier
- remote validation endpoint

### Standard endpoints

Future tools should reuse the same Wappkit routes whenever possible:

- `POST /api/license/validate`
- `POST /api/license/deactivate`
- `POST /api/license/unbind`
- `POST /api/license/retrieve`
- `POST /api/license/email`

### Validation request

Desktop app sends:

- `licenseKey`
- `toolSlug`
- device information when needed

### Validation response

Response should include enough information for the app to render status:

- `valid`
- `message`
- `data.productName`
- `data.tier`
- `data.status`
- `data.licenseKey`
- optional device information

### Device policy

Current operating rule:

- one active device per license key
- user can self-unbind from `/license/retrieve`
- internal admin can search and unbind from `/ops/licenses`

Default recommendation for future tools:

- keep the same single-device policy first
- only expand to multi-device after a real business need appears

## Standard Desktop UX

### 1. Free mode first

Every desktop tool should start in free mode.

That means:

- app opens without a license
- a meaningful free workflow is available
- locked features remain visible but clearly marked
- upgrade prompts should be direct and product-like

### 2. Activation page, not login page

Inside the app, the old `login` wording should be replaced with:

- `Enter License`
- `Activate Pro`
- `Remove License From This Device`

Do not use:

- `Sign In`
- `Register`
- `Account`

If the app needs a dedicated activation dialog, the minimum options are:

- `Buy License`
- `Retrieve License`
- `Enter License`

### 3. Upgrade prompts

Every locked feature should explain:

- what the user can do in free mode
- what Pro unlocks
- where to buy
- where to retrieve a lost license

### 4. Update system

Every desktop app should support:

- background update check
- manual `Check for Updates`
- download URL from `https://www.wappkit.com/api/desktop/version`
- SHA256 verification before install

### 5. Standard desktop menu/help items

Recommended menu entries:

- `Visit Website`
- `Check for Updates`
- `Enter License`
- `Remove License From This Device`
- `Contact Us`

## Standard Website Structure For Every Tool

### Required routes

These routes should stay shared across all tools:

- `/`
- `/tools`
- `/tools/[slug]`
- `/download`
- `/license`
- `/license/retrieve`
- `/blog`
- `/docs/[slug]`
- `/ops/licenses`

### Product page: `/tools/[slug]`

This is the main conversion page.

Each tool page should include:

- what the tool does
- who it is for
- what is free
- what is Pro
- screenshots or product state mockup
- how activation works
- primary CTA to buy
- secondary CTA to download
- support links

### Download page

The global `/download` page should:

- link to the newest installer
- show the exact file name
- show file size
- show SHA256
- link to the GitHub Release
- link back to the product page

If needed later, a tool can also have a dedicated download page, but default to the shared `/download` center first.

### License center

`/license` explains the model.

It should always answer:

- what a license is
- how to activate
- how to retrieve a lost key
- how one-device binding works

### License retrieval page

`/license/retrieve` should remain the main self-service support page.

Standard input:

- order ID
- purchase email

Standard result:

- show current license key
- show current binding status
- allow self-unbind if currently bound
- optionally resend the key to the original email

## Standard Data Needed For Every New Tool

Before building a new tool page, define these fields:

- `slug`
- `name`
- `tagline`
- `shortDescription`
- `longDescription`
- `category`
- `platform`
- `status`
- `downloadLabel`
- `buyLabel`
- `downloadHref`
- `buyHref`
- `docsHref`
- `availabilityNote`
- `checkoutEnabled`

Desktop release metadata also needs:

- version
- release date
- file name
- file size
- SHA256
- release URL
- direct download URL

## Standard Release Process

### Website release

The standard website release flow is:

1. update pages, docs, APIs, or release metadata
2. run:
   - `npm run lint`
   - `npm run build`
3. commit to `wappkit-web`
4. push to GitHub
5. let Vercel deploy from `main`
6. verify the live domain

### Desktop release

The standard desktop release flow is:

1. bump desktop version
2. update any hardcoded user-agent/version strings
3. verify remote update metadata compatibility
4. run:
   - `python -m compileall ui updater reddit`
5. build the installer
6. generate `.sha256`
7. upload `.exe` and `.sha256` to GitHub Release
8. update `wappkit-web/lib/desktop-release.ts`
9. push website metadata update
10. verify:
   - `/download`
   - `/api/desktop/version`
   - GitHub Release assets

### Mandatory verification after release

After any desktop release, check:

- website download page returns the new version
- desktop version API returns the new version
- desktop package SHA256 matches the uploaded file
- release tag exists
- download link redirects correctly

## Standard Launch Checklist For A New Tool

### Before launch

- tool name finalized
- free vs Pro scope finalized
- `toolSlug` finalized
- checkout product prepared in Creem
- license retrieval compatible with tool slug
- validation endpoint accepts the tool slug
- product copy written
- screenshots prepared
- docs written
- release metadata ready

### At launch

- product page live
- download page points to correct build
- success page works
- retrieval page works
- desktop activation works
- self-unbind works
- sitemap includes tool page
- blog support content published if available

### After launch

- verify Search Console indexing
- verify Vercel Analytics page views
- watch license retrieval errors
- watch activation failures
- watch release download counts

## Standard Naming Rules

Keep labels stable across all tools.

Use:

- `Free`
- `Pro`
- `Buy License`
- `Retrieve License`
- `Enter License`
- `Remove License From This Device`
- `Check for Updates`

Avoid mixing in:

- `trial`
- `subscription`
- `login`
- `account`
- `premium membership`

unless a tool truly has a different commercial model.

## Documentation Policy

Yes, this process should live in a dedicated document.

Recommended docs split:

- this SOP file for the permanent launch standard
- tool-specific docs for exceptions
- `PROJECT_STATUS.md` for current operational state

This document is the reusable standard.
Future tool launches should link back to it rather than re-explaining the whole business model every time.

## Old Releases And Old Deployments Policy

### GitHub Releases

Do not delete the previous release immediately.

Recommended minimum retention:

- keep current release
- keep previous release

Reason:

- rollback safety
- support old customers if a new build breaks
- preserve a known-good installer

Recommended rule:

- do not delete `v1.0.0` right after `v1.0.1`
- only delete truly obsolete releases when there are multiple newer stable releases

### Vercel

Do not delete the current `wappkit-web` project.

You may delete truly old and unused Vercel projects only if:

- the domain is no longer attached there
- no production traffic depends on them
- no environment variables need to be preserved
- no one needs their rollback history

Safe recommendation:

- keep the current production project
- remove only abandoned old projects after manual verification

## Default Decision Rule

If a future tool creates uncertainty, default to these choices:

- one shared Wappkit website
- one shared license system
- one shared retrieval flow
- one shared visual pattern
- free mode first
- paid unlock by license key
- no account system
- no dashboard
- no unnecessary new route families

This keeps Wappkit simple enough to launch many small tools without rebuilding the commercial system every time.
