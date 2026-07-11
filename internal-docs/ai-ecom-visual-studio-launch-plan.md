# AI E-commerce Visual Studio: Launch Plan

## Current Product Link

Use this page as the primary promotional landing page:

`https://www.wappkit.com/tools/ai-ecom-visual-studio`

Do not send visitors directly to a GitHub Release or a Creem checkout link in
ordinary promotional posts. The product page explains the free workflow,
download, Pro upgrade, activation, and support path in one place.

## Current Status

- [x] Windows installer release `0.1.5` is public.
- [x] The product page links to the current installer.
- [x] The checkout, license creation, recovery, activation, one-device binding,
  and update checks have been tested in the app.
- [x] The product page, support page, and footer include Image Studio links.
- [x] Vercel Analytics tracks download, checkout click, checkout redirect, and
  completed purchase events without recording email addresses, order IDs, or
  license keys.
- [x] Product page shows the current one-time Pro price.
- [ ] Complete one real paid order before paid promotion starts.
- [ ] Publish real screenshots and a short workflow video.
- [ ] Rotate any production credentials that appeared in prior screenshots or
  chat history.

## Price Positioning

Current public offer:

- Launch special: `$6` one-time Pro license.
- Planned regular price: `$9` one-time Pro license.

This is a reasonable early price for the current product. It is low enough to
reduce purchase friction while the app is unsigned and still young, but it also
sets the expectation that Pro is paid software rather than a permanently free
utility. Keep `$6` during the first promotion round. Move to `$9` after there
are real user screenshots, at least a few successful purchases, and no major
activation or installer complaints.

## Exact Free and Pro Scope

The website and app must say the same thing.

### Free

- One-image background removal.
- Preview and transparent PNG / current-size output.
- Optional EXIF and metadata cleanup while saving.
- Local temporary workspace before the user chooses the final destination.

### Pro

- Background replacement and product placement controls.
- Batch background removal and batch background replacement.
- Marketplace and social output presets.
- JPEG output, image enhancement, and Smart Product Optimize.

Never advertise AI background generation, API credits, or prompt optimization
until those features are implemented and supportable.

## Minimum Support System

Before public promotion, these are the minimum customer-facing support paths:

1. Product page: explains the free test workflow and Pro scope.
2. Download: links to the exact current installer and checksum.
3. Activation: the app can enter a key and show the active Pro state.
4. Recovery: `/license/retrieve` handles a lost key and self-service unbind.
5. Help: `/tools/ai-ecom-visual-studio/support` gives download, quality, and
   activation guidance plus the support email.
6. Internal operations: `/ops/licenses` can search, disable, enable, or unbind
   a license when self-service cannot resolve an issue.

Set a practical support promise internally before promotion: respond to paid
license, failed activation, and installer-blocking issues within one business
day.

## Marketing Assets: Do Not Use Test Images

The existing geometric test files are for QA only. They must never appear on
the product page, social posts, ads, or marketplace listings.

Prepare three real, publicly usable image examples:

1. **Cutout quality**
   - Original product photograph.
   - Transparent result and white-background result.
   - Include a close crop that shows hair, glass, straps, or another difficult
     edge when the product category allows it.
2. **Background composition**
   - Original product photograph.
   - Product on a chosen background.
   - A screenshot that visibly shows the scale and position controls.
3. **Export workflow**
   - The same finished product image exported for original size, Amazon or
     Shopify, and a vertical social placement.
   - Show the final pixel dimensions in the caption, not as a claim that a
     marketplace will automatically approve every image.

Also record one 20 to 40 second screen capture:

1. Load an image.
2. Remove the background.
3. Save a free transparent PNG.
4. Show a Pro-only control and the clear upgrade state.
5. Activate only with a disposable demonstration key or omit the activation
   step entirely.

Use photos that the business owns or has explicit marketing permission to use.
Avoid visible third-party logos, copyrighted product packaging, customer
addresses, or real order data.

## Promotion Link Convention

Every public post should use the product page with UTM parameters. Keep the
source name short and stable:

| Channel | Example URL |
| --- | --- |
| Reddit | `https://www.wappkit.com/tools/ai-ecom-visual-studio?utm_source=reddit&utm_medium=post&utm_campaign=launch` |
| X | `https://www.wappkit.com/tools/ai-ecom-visual-studio?utm_source=x&utm_medium=social&utm_campaign=launch` |
| YouTube | `https://www.wappkit.com/tools/ai-ecom-visual-studio?utm_source=youtube&utm_medium=video&utm_campaign=launch` |
| Product Hunt | `https://www.wappkit.com/tools/ai-ecom-visual-studio?utm_source=product_hunt&utm_medium=listing&utm_campaign=launch` |
| Email | `https://www.wappkit.com/tools/ai-ecom-visual-studio?utm_source=email&utm_medium=newsletter&utm_campaign=launch` |

Current Vercel Analytics events:

- `download_clicked`
- `checkout_clicked`
- `checkout_redirected`
- `purchase_completed`

Each includes the product slug and the captured `campaign_source`. Review the
events weekly by source. The first useful measures are:

- product page visits
- downloads divided by product page visits
- checkout clicks divided by downloads
- paid purchases divided by checkout clicks
- activation or recovery support requests after purchase

Do not add email, order ID, license key, or image file names to analytics
events.

## Windows Code Signing Decision

Release `0.1.5` is currently unsigned. This is acceptable for a limited,
transparent early launch, but Windows may display an unfamiliar-publisher or
SmartScreen warning.

Do not use a self-signed certificate for public distribution. It does not
provide trusted publisher status for customers.

When revenue justifies it, buy a public-trust Windows code-signing certificate
from a reputable certificate authority that can validate the business entity
being used. Sign the installer before publishing a future release and preserve
the existing checksum verification flow. Treat signing as a paid distribution
expense, not as a prerequisite for learning whether the product has demand.

## Launch Gate

Begin small, targeted promotion only after:

- the Vercel deployment containing the product-page changes is live;
- one complete real payment, key delivery, activation, recovery, and self-unbind
  flow succeeds;
- the price shown in Creem is confirmed and added to the product page;
- the three real image examples and one short demo are ready;
- exposed credentials have been rotated;
- the support inbox is monitored.

After that, publish small channel-specific posts first. Do not pay for ads
until the analytics show a healthy download-to-checkout path and the support
flow has handled real customers cleanly.
