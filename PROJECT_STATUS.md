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

## Current Persistence Strategy

- first choice: Upstash Redis
- local fallback: in-memory storage for development only
- future option: migrate to a more formal third-party database if needed

## Pending Work

- verify each new GitHub push has deployed correctly on Vercel
- add real production environment variables
- switch the final domain from the old site to `wappkit.com` when ready
- test Creem checkout end to end on the deployed site
- migrate old blog content from the previous site
- optionally enable Resend for original-email license resend
