import Link from "next/link";
import {
  Check,
  Highlighter,
  LockKeyhole,
  MonitorSmartphone,
} from "lucide-react";

import { getFaq } from "@/lib/faq";
import { REDDIT_READER } from "@/lib/store-links";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaqBlock } from "@/components/content/faq-block";
import { CheckoutButton } from "@/components/forms/checkout-button";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";
import { RedditReaderInstallLinks } from "@/components/marketing/reddit-reader-install-links";

export const metadata = constructMetadata({
  title: "Reddit Viewer Extension for Chrome, Edge & Firefox | Reddit Reader",
  description:
    "A cleaner view for public Reddit threads. Highlight keywords and export the post and comments to Markdown in Chrome, Edge, or Firefox. Three free exports; Pro is $4.99 once.",
});

const freeFeatures = [
  "Clean reader mode: hides login prompts, sidebars, app banners and promoted posts",
  "One keyword highlighted across the post and comments",
  "Three Markdown exports",
  "Works on reddit.com, including direct thread URLs",
  "No installer and no Wappkit account",
];

const proFeatures = [
  "Unlimited keyword highlighting",
  "Unlimited Markdown exports",
  "Same reader mode, same browser extension",
  "One-time license, no subscription",
  "Activate inside the extension with a Wappkit key",
];

export default function RedditReaderExtensionPage() {
  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Browser extension · Chrome / Edge / Firefox"
        title="A cleaner way to read Reddit threads."
        description="Highlight the words you care about and save the post and comments as Markdown. Reddit Reader reformats threads your browser can already load; it does not unlock hidden or login-only content."
        badges={[
          { label: "Free to install", tone: "warm" },
          { label: "3 free exports", tone: "muted" },
        ]}
        actions={
          <div className="w-full space-y-5">
            <RedditReaderInstallLinks source="tool_hero" includeFirefox />
            <div
              id="reddit-reader-pro"
              className="flex scroll-mt-24 flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4"
            >
              <CheckoutButton
                toolSlug={REDDIT_READER.slug}
                label="Get Pro — $4.99"
                variant="outline"
              />
              <p className="max-w-60 text-sm text-muted-foreground">
                Unlimited keywords and exports. Pay once, no subscription.
              </p>
            </div>
          </div>
        }
        rightContent={
          <MarketingCard tone="dark" className="space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Reddit Reader
                </p>
                <h2 className="mt-2 font-heading text-2xl text-white">
                  A cleaner thread
                </h2>
              </div>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Free trial
              </span>
            </div>
            <div className="space-y-3">
              {[
                [
                  "Clean reader",
                  "Login prompts, sidebars and promoted posts are hidden.",
                ],
                [
                  "Keyword highlight",
                  "Mark the words that matter in the post and comments.",
                ],
                [
                  "Export",
                  "Download the post and comments as one Markdown file.",
                ],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {description}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs leading-5 text-slate-400">
              The extension only runs when you click its toolbar icon. It does
              not read other tabs or other websites.
            </p>
          </MarketingCard>
        }
      />

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <MarketingCard tone="soft" className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Free
          </p>
          <h2 className="mt-3 font-heading text-3xl text-foreground">
            Enough to read and try.
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-foreground">
            {freeFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="mt-1 size-4 text-orange-700" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </MarketingCard>

        <MarketingCard tone="dark" className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-200">
            Pro — $4.99 one-time
          </p>
          <h2 className="mt-3 font-heading text-3xl text-white">
            For repeat research.
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-200">
            {proFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="mt-1 size-4 text-orange-300" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </MarketingCard>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: LockKeyhole,
            title: "No host permissions on every site",
            description:
              "The extension uses the active tab only when you click the toolbar icon. It does not run on other websites.",
          },
          {
            icon: Highlighter,
            title: "Works on the current Reddit",
            description:
              "The reader and Markdown exporter handle the current Reddit interface, including nested comments and long threads.",
          },
          {
            icon: MonitorSmartphone,
            title: "No installer",
            description:
              "Install it from the browser store, then click the toolbar icon on a Reddit thread. There is no 48 MB setup.",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <MarketingCard key={item.title} tone="soft" className="p-6">
              <span className="rounded-full bg-orange-100 p-2 text-orange-700">
                <Icon className="size-4" />
              </span>
              <h3 className="mt-4 font-heading text-xl text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </MarketingCard>
          );
        })}
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-3xl text-foreground">
          What is a Reddit viewer?
        </h2>
        <div className="mt-4 max-w-3xl space-y-4 text-base leading-7 text-muted-foreground">
          <p>
            A Reddit viewer is a different way to read Reddit. Instead of the
            logged-out homepage with its app banners, sidebars and promoted
            posts, a viewer renders the thread itself — the post, its comments
            and the nested replies — in a layout built for reading.
          </p>
          <p>
            There are three common shapes. Web frontends such as old.reddit.com
            serve a separate page. Proxy sites such as Teddit fetch threads on
            your behalf, which is why most of them stopped working after the
            2023 API changes. A browser extension is the third shape: it redraws
            the tab you already have open, so there is no extra site to trust
            and no server in the middle.
          </p>
          <p>
            Reddit Reader is the third kind. You install it from the browser
            store, click the toolbar icon on a Reddit thread, and get reader
            mode, keyword highlighting and a Markdown export of the post and its
            comments. It is useful when you read public threads without an
            account; it does not help with private communities, voting or
            posting.
          </p>
        </div>
      </section>

      <FaqBlock items={getFaq("tools/reddit-viewer-extension") ?? []} />

      <section className="mt-10">
        <MarketingCard tone="warm" className="p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
                Android
              </p>
              <h2 className="mt-3 font-heading text-3xl text-foreground">
                Reading on your phone?
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                The same reader is available as a free 105 KB Android app. It
                opens Reddit from your phone&apos;s own connection, with no
                account and no Wappkit server.
              </p>
            </div>
            <Link href="/tools/reddit-reader-android">
              <Button rounded="full" size="lg">
                Get the Android app
              </Button>
            </Link>
          </div>
        </MarketingCard>
      </section>

      <section className="mt-10 rounded-[1.8rem] border bg-card p-8 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Before you install
            </p>
            <h2 className="mt-3 font-heading text-3xl text-foreground">
              Not affiliated with Reddit. No login bypass.
            </h2>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              The extension reads the page you already opened and hides visual
              clutter. It does not create accounts, bypass bans, vote, or scrape
              at scale. Follow Reddit’s User Agreement and each subreddit’s
              rules.
            </p>
          </div>
          <Link href="/toolkit" data-umami-event="toolkit_clicked">
            <Button rounded="full" size="lg" variant="outline">
              Get the $5 Reddit toolkit
            </Button>
          </Link>
        </div>
      </section>
    </MarketingPageShell>
  );
}
