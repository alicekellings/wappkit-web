# Desktop Tool + Creem + Wappkit Release Flow

This is the reusable launch flow for small paid Windows desktop tools under
Wappkit. Use it when building the next tool so development, payment, license
activation, download, update, and promotion are handled in the same order every
time.

## 1. Decide The Product Shape

Before writing payment code, fix these decisions:

- Product name.
- Tool slug, for example `ai-ecom-visual-studio`.
- Free feature list.
- Pro feature list.
- One-time price and planned regular price.
- Windows app version, starting at `0.1.0` or similar.
- Whether the first release is signed or unsigned.
- Support email and refund/support policy.

Default commercial model:

- Free mode opens without a license.
- Pro unlocks with a license key.
- One license binds to one active device.
- User can self-unbind from Wappkit license retrieval.
- No website account, login, password reset, or subscription dashboard unless a
  future tool truly needs it.

## 2. Desktop App Requirements

Every desktop tool should ship these pieces before paid promotion:

- Free workflow that is actually useful.
- Locked Pro controls visible enough for users to understand the upgrade.
- `Buy License` button opening the Wappkit product page.
- `Retrieve License` link opening `/license/retrieve`.
- `Enter License` or `Activate Pro` dialog.
- Remote validation through `POST /api/license/validate`.
- Local storage of the signed license token.
- Clear title/header status: `Free` or `Pro Activated`.
- `Remove License From This Device` through `POST /api/license/deactivate`.
- Manual `Check for Updates`.
- Startup update check that reads Wappkit version metadata.
- Update download progress, SHA256 verification, and installer launch.

The app should not describe activation as login. Use license wording everywhere.

## 3. Creem Product Setup

Create one Creem product for each paid desktop tool.

Required setup:

- Product name matches the public Wappkit product name.
- Price matches the product page.
- License key generation is enabled in Creem.
- Success / return URL points to:
  `https://www.wappkit.com/checkout/success?tool=<toolSlug>`
- Webhook URL points to:
  `https://www.wappkit.com/api/webhook/creem`
- Metadata includes the tool slug when Creem allows it.
- Test mode product is separate from live mode product.

Vercel variables normally needed:

- `CREEM_API_KEY`
- `CREEM_WEBHOOK_SECRET`
- `CREEM_TEST_MODE`
- `CREEM_PRODUCT_<TOOL>_ID`
- `NEXT_PUBLIC_APP_URL`
- license store variables such as Upstash Redis config
- email variables such as Resend config when license email is enabled

For testing:

- Set `CREEM_TEST_MODE=true`.
- Use the test product ID.
- Redeploy Vercel.
- Complete a test checkout.
- Confirm the success page shows the key.
- Activate the desktop app with that key.
- Test retrieval and self-unbind.

For production:

- Set `CREEM_TEST_MODE=false`.
- Use the live product ID.
- Redeploy Vercel.
- Open checkout once and confirm the URL is not `/test/checkout`.
- Complete one real payment before broad promotion.

## 4. Wappkit Website Setup

Add or update these website parts for each tool:

- `lib/tools.ts`: product metadata, free/Pro copy, download link, checkout flag,
  and price labels.
- Product page `/tools/[slug]`: what it does, who it is for, Free vs Pro,
  price, download, checkout, activation, support.
- Support page `/tools/[slug]/support`: install, activation, retrieval, quality,
  troubleshooting, and support email.
- Download route `/api/desktop/<slug>/download`.
- Version route `/api/desktop/<slug>/version`.
- Release metadata file such as `lib/<slug>-release.ts`.
- Footer/product directory links.
- Success page behavior that displays the license key when Creem returns it.
- License retrieval compatibility for the tool slug.
- Admin license console compatibility for support operations.

Public product pages should avoid claims about planned features. Only advertise
features that are implemented, testable, and supportable.

## 5. License Flow

Normal customer flow:

1. Customer opens product page.
2. Customer downloads the free Windows app.
3. Customer tests the free workflow.
4. Customer clicks `Unlock Pro`.
5. Wappkit creates a Creem checkout.
6. Customer pays.
7. Creem returns to `/checkout/success`.
8. Wappkit retrieves or receives the license key.
9. Success page shows the key.
10. Customer pastes the key into the app.
11. App calls `/api/license/validate`.
12. Wappkit binds the license to the device and returns a signed token.
13. App stores the token and unlocks Pro.

Support flow:

- Lost key: `/license/retrieve` with order ID and purchase email.
- Device changed: user self-unbinds from retrieval page or support unbinds from
  `/ops/licenses`.
- Refund or abuse: support disables the license in `/ops/licenses`.

Never log or send license keys to analytics.

## 6. Release Packaging

For each desktop release:

1. Bump the app version.
2. Verify local free and Pro flows.
3. Build the installer.
4. Generate SHA256.
5. Check whether the installer is signed.
6. Create a GitHub Release under the website repository or a dedicated release
   repository.
7. Upload installer and `.sha256`.
8. Update website release metadata:
   - version
   - release date
   - file name
   - file size
   - SHA256
   - release URL
   - installer URL
   - changelog
9. Run website lint, tests, and build.
10. Commit and push to `main`.
11. Wait for Vercel deployment.
12. Verify download and version APIs on the live domain.

Keep at least the current and previous installers available for rollback.

## 7. Auto Update Requirements

Desktop app update checks should read Wappkit metadata, not scrape GitHub.

Minimum API response:

- latest version
- minimum supported version
- installer download URL
- SHA256
- release notes or changelog
- release page URL

Desktop update behavior:

- Check on startup without blocking the main workflow.
- Let the user manually check from the UI.
- Ask before downloading.
- Show download progress.
- Verify SHA256 before launching the installer.
- Start the new installer and close the old app only after verification.

## 8. Website Verification Checklist

Before promotion, verify:

- Product page loads.
- Download button redirects to the newest installer.
- Checkout button opens Creem live checkout in production mode.
- Success page can display a license key.
- Retrieval page can find and unbind the key.
- Desktop app can activate, deactivate, and show Pro status.
- Version API returns the newest release.
- Vercel Analytics receives:
  - `download_clicked`
  - `checkout_clicked`
  - `checkout_redirected`
  - `purchase_completed`
- No public page exposes API-center, AI-credit, or future-feature copy unless the
  feature is live.

## 9. Promotion Preparation

Prepare these assets:

- One clean product-page screenshot.
- One app screenshot in Free mode.
- One app screenshot in Pro mode.
- One before/after product image.
- One background replacement example.
- One marketplace/social export example.
- One 20 to 40 second demo video.

Promotion URLs should always use the product page with UTM parameters:

`https://www.wappkit.com/tools/<slug>?utm_source=<channel>&utm_medium=<type>&utm_campaign=launch`

Start with small posts and direct outreach. Do not run paid ads until:

- at least one real payment has succeeded;
- activation support has been tested;
- download-to-checkout analytics are visible;
- there are no major installer or license complaints.

## 10. Code Signing Policy

Unsigned installers are acceptable for early testing and limited launch, but
Windows may show an unfamiliar-publisher warning.

Do not distribute a self-signed installer as if it were trusted. It is useful
for development only and does not solve customer trust.

When revenue justifies it:

- buy a public-trust Windows code-signing certificate or a suitable trusted
  signing service;
- sign the installer;
- timestamp the signature;
- upload a new release;
- update SHA256 and release metadata;
- verify SmartScreen behavior on a clean Windows machine.

## 11. New Tool Quick Checklist

- [ ] Product name and slug fixed.
- [ ] Free and Pro scope fixed.
- [ ] Price fixed.
- [ ] Desktop app has free mode.
- [ ] Desktop app has activation and deactivation.
- [ ] Desktop app has update check.
- [ ] Creem test product created.
- [ ] Creem live product created.
- [ ] Vercel env vars configured.
- [ ] Product page created.
- [ ] Support page created.
- [ ] Download and version APIs created.
- [ ] Installer uploaded to Release.
- [ ] Website metadata updated.
- [ ] Test checkout succeeds.
- [ ] Live checkout opens correctly.
- [ ] Real payment succeeds before public promotion.
- [ ] Screenshots and demo video prepared.
- [ ] Internal support can search and unbind licenses.
