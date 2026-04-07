# Wappkit New Web Architecture Plan

## 1. Project Positioning

`wappkit.com` will be rebuilt from a single Reddit-focused product site into a multi-tool product platform.

The new website is not an account-based SaaS app.
Its job is to act as:

- brand homepage
- tool directory
- tool landing pages
- download center
- blog/content hub
- help/docs center
- payment and license guidance site

The desktop tools themselves will handle activation through a license key.
The website will no longer rely on user registration, login, email verification, or account upgrade flows.

## 2. Core Decisions

### Decision A: Build a new web project, but not from zero

Do not continue patching `reddittools/web2` as the primary future site.

Reason:

- `web2` is deeply tied to the old Reddit-only positioning
- it contains heavy legacy baggage such as auth, Supabase account flows, pricing/account logic, admin pages, test pages, and Reddit-specific assumptions
- continuing to patch it will make every future tool launch harder

Recommended direction:

- create a new web project under the current root directory
- use an open-source website template as the base
- simplify and adapt it instead of building everything from zero
- treat the old `reddittools/web2` as migration reference only

Suggested new project folder name:

- `wappkit-web`

### Existing GitHub repository reference

Current web repository location:

- `https://github.com/alicekellings/wappkit-web`

This repository should be treated as the current web code source/history reference during migration planning.

### Deployment reference

Current deployment model:

- GitHub + Vercel
- GitHub repository: `https://github.com/alicekellings/wappkit-web`
- current Vercel URL: `https://wappkit-web.vercel.app/`
- final production domain target: `wappkit.com`

Operational note:

- future code changes should be pushed to the GitHub repository above
- Vercel is expected to deploy from that repository automatically
- domain switching to `wappkit.com` will be handled separately when ready

### Template selection update

Current local template candidates reviewed:

- `D:\软件的备份\CODE_HELP\TEST\temp\EN_Template_英文网站模板`
- `D:\软件的备份\CODE_HELP\TEST\EN-weblicensekey-英文网站模板-creem收款`

Current conclusion:

- use `EN_Template_英文网站模板` as the main site foundation
- borrow or reimplement the Creem payment flow from `EN-weblicensekey-英文网站模板-creem收款`

Reason:

- `EN_Template_英文网站模板` already has stronger structure for marketing pages, blog, docs, and content organization
- `EN-weblicensekey-英文网站模板-creem收款` is closer to the payment flow we want, but it is too thin to serve as the long-term multi-tool platform shell
- this combination keeps the architecture simpler and closer to industry-standard product-site structure

## 3. Business Model Decision

### Old model

- user signs up
- user logs in
- website tracks subscription/account state
- product availability depends on website account state

### New model

- user visits tool page
- user downloads tool
- user buys through `Creem.io`
- user receives license
- user enters license inside the tool
- tool unlocks paid version

This means the new website should not include:

- signup
- signin
- email verification
- account dashboard
- subscription dashboard
- profile/settings tied to auth
- Supabase auth-driven upgrade logic

The new website may still need:

- payment success page
- payment cancel page
- license help page
- refund/contact page
- webhook or lightweight backend logic if Creem requires it
- license retrieval endpoint and workflow

## 4. Primary Goals

- make `wappkit.com` the main brand site for multiple tools
- keep existing blog SEO value as much as possible
- make it easy to add more tools later
- remove old auth complexity
- support `Creem + license` as the default monetization model
- keep information architecture simple and repeatable

## 5. Non-Goals

- do not build a new website account system
- do not rebuild old Supabase-based user management
- do not create one independent website per tool right now
- do not split content into many subdomains at this stage

## 6. URL Strategy

### Final recommendation

Use the main domain with directories, not subdomains, as the default structure.

Use:

- `wappkit.com/tools/[slug]`
- `wappkit.com/download/[slug]` or download inside tool page
- `wappkit.com/blog`
- `wappkit.com/blog/[slug]`
- `wappkit.com/docs/[slug]`

Do not use by default:

- `toolname.wappkit.com`

### Why directories are better now

- concentrates SEO authority on one domain
- easier to maintain and deploy
- easier to share blog authority across all tools
- simpler analytics, sitemap, canonical, and navigation
- better fit for a platform with many lightweight tools

### When subdomains may be reconsidered later

Only reconsider subdomains if a tool becomes:

- an independent brand
- a separate product with its own content engine
- a separate app with distinct deployment needs
- large enough to justify its own standalone growth model

Until then, default to directories.

## 7. Blog Strategy

### Final recommendation

Keep a single platform blog under:

- `wappkit.com/blog`
- `wappkit.com/blog/[slug]`

Do not create a separate blog per tool right now.

### Why

- existing blog URLs likely already have Google indexing value
- keeping `/blog` stable is the safest SEO move
- a shared blog lets all tools benefit from one content hub
- content operations stay much simpler

### Content structure inside the shared blog

Each article should support:

- `tool`
- `topic`
- `content type`

Examples:

- tool: `reddit-toolbox`
- topic: `reddit-marketing`
- content type: `guide`

Possible future filtered pages:

- `/blog/tool/reddit-toolbox`
- `/blog/topic/reddit-marketing`

These are optional aggregation pages, not separate blog systems.

## 8. Blog Migration Rule

### Important migration principle

Existing blog URLs should remain unchanged whenever possible.

That means:

- keep `/blog`
- keep existing article slugs under `/blog/[slug]`
- migrate old markdown/content into the new site
- preserve metadata and canonical behavior

If a URL must change, use `301` redirects.
But the preferred approach is to avoid changing blog URLs at all.

## 9. Site Information Architecture

### Recommended top-level structure

- `/`
- `/tools`
- `/tools/[slug]`
- `/download`
- `/download/[slug]` if needed
- `/blog`
- `/blog/[slug]`
- `/docs`
- `/docs/[slug]`
- `/pricing` or pricing blocks directly on tool pages
- `/license`
- `/contact`
- `/privacy`
- `/terms`

### Recommended purpose of each route

#### `/`

Platform homepage.

Should communicate:

- what Wappkit is
- featured tools
- tool categories
- why trust the platform
- latest blog content
- primary CTA into tools

#### `/tools`

Directory of all tools.

Should provide:

- browse all tools
- category/filtering
- featured/new tools
- direct access to each tool page

#### `/tools/[slug]`

Primary landing page for each tool.

This should become the main product conversion page.

Recommended sections:

- hero
- what the tool does
- use cases
- screenshots
- key features
- pricing
- download CTA
- buy with Creem CTA
- license activation explanation
- FAQ
- related articles

#### `/download`

Global download center.

This page should exist, but it should not be the main conversion model.
Its role is to help users quickly find downloads across all tools.

#### `/download/[slug]`

Optional.

Use this only if a tool needs a dedicated download page separate from its main landing page.
If the product page already handles download well, this route can be skipped.

#### `/blog`

Main content hub for all tools.

#### `/docs`

Help and documentation center.

Recommended content:

- activation guide
- how license works
- how to upgrade
- installation troubleshooting
- refund/contact guidance
- FAQ per tool

#### `/license`

A focused license center.

Recommended content:

- where to enter the license
- how to recover a license
- common activation issues
- what happens after purchase

## 10. Download Page Strategy

### Final recommendation

Use both:

- one global download center
- one dedicated page or dedicated section per tool

But the main conversion should happen on the tool page, not on one giant combined download page.

### Why not a single all-in-one download page only

- poor SEO for individual tools
- poor conversion clarity
- hard to manage pricing, screenshots, OS requirements, and FAQs per tool
- becomes messy as more tools are added

### Recommended model

- `/tools/[slug]` = primary product and conversion page
- `/download` = central directory page
- optional `/download/[slug]` only when needed

## 11. New Tool Launch Pattern

Every new tool should fit the same repeatable structure:

1. Add tool metadata
2. Generate tool page at `/tools/[slug]`
3. Add download link
4. Add Creem purchase link
5. Add license/help docs
6. Publish related blog articles

This is the key reason to build the new site as a platform shell instead of a one-off product site.

## 12. Recommended Tool Data Model

The new site should eventually treat tools as structured content rather than hard-coded one-off pages.

Each tool should have fields like:

- `slug`
- `name`
- `tagline`
- `shortDescription`
- `longDescription`
- `category`
- `platform`
- `status`
- `pricingModel`
- `downloadUrl`
- `buyUrl`
- `licenseType`
- `heroImage`
- `screenshots`
- `faq`
- `relatedPosts`

This makes future expansion much easier.

## 13. Payment and License Flow

### Recommended user flow

1. user lands on tool page
2. user downloads free/trial version if available
3. user clicks buy
4. payment goes through `Creem.io`
5. user receives license
6. user activates inside desktop app

### Website responsibilities

- explain pricing clearly
- explain what the license unlocks
- explain how activation works
- provide support/help pages
- provide payment success and failure pages if needed

### Website should not do

- website-based product entitlement checks
- account-based premium gating
- subscription state UI tied to login

## 14. License Retrieval Strategy

### Final recommendation

Do not build a user center or customer dashboard.

Instead, build a simple `License Retrieval` flow.

This is the preferred model:

1. user buys a tool
2. user sees the license after purchase
3. user also receives the license by email
4. if the user forgets or loses the key later, they visit the website
5. they use an order lookup flow to retrieve or re-send the license

### Why this is the right model

- much simpler than account systems
- lower maintenance burden
- better fit for desktop tools that unlock with a license key
- fewer support issues around passwords, email verification, and account recovery
- shorter user journey

### Recommended routes

- `/license`
- `/license/retrieve`
- `/license/help`

### Responsibilities of each route

#### `/license`

Explain:

- how licenses work
- how activation works
- where users enter the license in the app
- what to do if the key is lost

#### `/license/retrieve`

This is the main key retrieval page.

Users should be able to enter purchase information and recover their license or request re-delivery.

#### `/license/help`

Explain:

- where to find order ID
- what email address must be used
- how to troubleshoot activation
- what to do if email delivery failed

### Recommended lookup model

Do not allow overly weak lookup such as email-only retrieval.

Preferred verification inputs:

- order ID + purchase email

Optional additional checks if needed:

- product name
- partial license fragment
- payment reference

### Recommended response model

The safest default flow is:

1. user submits order ID and email
2. system validates the record
3. system re-sends the full license to the original purchase email

Optional enhancement:

- show a masked license on screen after successful verification
- example: `WAAP-XXXX-XXXX-12AB`

Only show the full license directly on the page if the verification rules are strong enough and rate-limited.

### Security requirements

The retrieval flow should include:

- rate limiting
- request logging
- validation of order ID + email match
- clear error messages without leaking too much information

### What this replaces

This retrieval strategy replaces:

- customer account center
- sign in / sign up
- password reset
- user dashboard
- subscription self-management pages

### UX recommendation

The lookup flow should feel lightweight and trustworthy.

Suggested UX:

- one simple form
- two required fields: order ID and email
- clear explanation of where to find them
- success state offers re-send confirmation
- support link if lookup fails

## 15. Template Recommendation

### Preferred foundation

Use:

- `EN_Template_英文网站模板`

as the main structural foundation for the new Wappkit site.

### Why this is preferred

It already contains a strong base for:

- homepage / marketing site
- blog
- docs
- content-driven pages
- structured Next.js app architecture

These are closer to what Wappkit needs than a payment-only product page template.

### What should be removed from that template

The following systems are not aligned with the new Wappkit model and should be removed or excluded:

- Auth.js / login / register
- protected dashboard
- admin dashboard
- Prisma dependency if not otherwise needed
- Stripe billing flow
- customer portal flow
- account settings tied to auth

### What should be borrowed from the Creem template

From `EN-weblicensekey-英文网站模板-creem收款`, keep only the ideas or code patterns needed for:

- `Creem checkout`
- success page
- optional email delivery logic
- product purchase metadata handling

### Industry-standard simplification

This gives us a cleaner product-site architecture:

- content-first website
- no unnecessary account system
- payment handled through checkout
- post-purchase support handled through license retrieval
- blog and docs remain part of the main domain

## 16. Technical Architecture Direction

### Recommended stack direction

A clean new `Next.js` site is still a reasonable choice.
But it should be built as a content/product website, not as an auth-heavy SaaS dashboard.

Recommended characteristics:

- simple content-first app structure
- no auth dependency in the core architecture
- no Supabase requirement unless truly needed for another reason
- markdown or content collections for blog/docs
- structured config/data for tools
- lightweight backend routes only where needed for payment callbacks or contact forms

### Keep architecture simple

The site should mostly be:

- static pages
- dynamic content rendering from files/data
- minimal server routes

## 17. What Should Not Be Carried Forward From `web2`

Do not carry forward these systems unless later proven necessary:

- Supabase auth
- signup/signin pages
- account page
- subscription management dashboard
- premium banners tied to user session
- Reddit-only navigation and metadata assumptions
- old admin/test/debug pages
- giant tool tabs page as the central product UI

## 18. Migration Strategy

### Phase 1: Template-based new project setup

- create new project under root, likely `wappkit-web`
- start from `EN_Template_英文网站模板`
- define global layout and brand system
- create tool content model
- create blog and docs content model
- remove auth/dashboard/billing systems not needed

### Phase 2: Core platform pages

- homepage
- tools directory
- first tool detail page
- blog index
- blog post pages
- docs/help pages
- legal/contact pages

### Phase 3: Blog migration

- migrate existing `/blog` posts
- preserve slug structure
- preserve image references
- verify metadata and canonical rules
- prepare redirects only if absolutely necessary

### Phase 4: Commercial flow

- integrate `Creem` links/flow
- add payment result pages if needed
- add license guidance pages
- add license retrieval flow

### Phase 5: Old site sunset

- stop using old `web2` as the main live codebase
- redirect obsolete pages where appropriate
- keep only SEO-safe routes and references during transition

## 19. Recommended Initial Navigation

Top nav should likely be:

- Home
- Tools
- Blog
- Docs
- Contact

Optional:

- Download

Do not include:

- Sign In
- Sign Up
- Account

## 20. Recommended Homepage Messaging

The homepage should no longer sell one Reddit tool only.

It should present Wappkit as:

- a platform for useful desktop/web tools
- a place to discover and download focused productivity/utilities
- a content hub with practical guides and comparisons

The homepage should feature selected tools, not hide everything behind one single product pitch.

## 21. SEO Rules For The New Site

- preserve `/blog` and existing post slugs whenever possible
- keep canonical URLs stable
- use one main domain, not many subdomains
- create unique metadata per tool page
- create unique metadata per blog post
- add sitemap entries for tools, blog, and docs
- avoid duplicate content between tool pages and blog posts

## 22. Immediate Next Steps

The next implementation planning round should produce:

1. final folder name for the new project
2. exact route map for the new site
3. homepage wireframe/content blocks
4. tool detail page template
5. blog migration checklist
6. docs/license page structure
7. Creem integration touchpoints
8. license retrieval flow details
9. old-to-new redirect map

## 23. Summary

The new Wappkit web strategy is:

- build a clean multi-tool platform site
- keep the blog under `/blog`
- preserve old blog slugs where possible
- use directory-based URLs, not subdomains
- remove auth and account complexity
- use `Creem + license` as the product monetization model
- use license retrieval instead of a user center
- treat each tool as a structured product page under `/tools/[slug]`
- keep one shared content hub for all tools
- use `EN_Template_英文网站模板` as the preferred site foundation
- borrow only the needed Creem payment flow from `EN-weblicensekey-英文网站模板-creem收款`

This is the cleanest long-term base for launching more tools without carrying the old Reddit-only site architecture forward.

## 24. Current Implementation Direction

The current implementation phase should follow these practical rules:

- `Creem` is the license issuer
- `Wappkit` is the storefront and license retrieval experience
- no customer dashboard is being added
- direct on-page license retrieval is the primary recovery flow for now
- email resend is optional and should only be enabled when `Resend` is configured
- lightweight persistence should use `Upstash Redis` first
- future migration to a more formal third-party database should stay possible without changing the public flow

### Current retrieval model

1. customer buys through `Creem`
2. `Creem webhook` sends checkout/order data to `Wappkit`
3. `Wappkit` mirrors `order + customer email + license key + product info`
4. customer visits `/license/retrieve`
5. customer enters `order ID + purchase email`
6. website shows the license directly on the page
7. if email delivery is configured later, the same lookup can also trigger re-send to the original purchase email

### Current storage rule

Do not use local website filesystem storage as the long-term production database.

Current preferred order:

1. `Upstash Redis / Vercel KV style persistence`
2. later migration to formal database if needed

This keeps the first production version simple while preserving a clear upgrade path.

## 25. Current Creem Test Configuration

Current test product information confirmed for implementation:

- product name in Creem test mode: `Past Life Reading`
- test payment URL: `https://www.creem.io/test/payment/prod_4eLDTLz1uNCWz3yMQTBrX0`
- test product ID: `prod_4eLDTLz1uNCWz3yMQTBrX0`

### API key handling rule

The Creem API key must not be stored in repository docs or committed files.

Use local environment variables only:

- `CREEM_API_KEY`
- `CREEM_TEST_MODE=true`
- `CREEM_PRODUCT_REDDIT_TOOLBOX_ID=prod_4eLDTLz1uNCWz3yMQTBrX0`

### Webhook endpoint

Current Wappkit webhook route:

- `/api/webhook/creem`

Production webhook URL should therefore be:

- `https://wappkit.com/api/webhook/creem`

If you are temporarily testing on a Vercel preview deployment, use that preview domain instead:

- `https://<your-vercel-domain>/api/webhook/creem`

### Recommended initial webhook event selection

For the current lightweight license mirror flow, the most important event is:

- `checkout.completed`

That event is enough for the current architecture because it lets Wappkit mirror:

- order ID
- purchase email
- product metadata
- license key data returned by Creem

Additional events can be added later if needed, but they are not required for the first working version.
