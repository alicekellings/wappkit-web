import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Download,
  EyeOff,
  Filter,
  Gauge,
  KeyRound,
  LayoutList,
  ShieldCheck,
  Sparkles,
  Table2,
  UserSearch,
} from "lucide-react";

import {
  MarketingCard,
  MarketingCtaBand,
  MarketingHero,
  MarketingPageShell,
  MarketingSectionIntro,
} from "@/components/marketing/page-shell";
import { TrackedDownloadLink } from "@/components/analytics/tracked-download-link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/utils";

const PAGE_PATH = "/reddit-viewer";

export const metadata: Metadata = {
  ...constructMetadata({
    title: "Reddit Viewer: Browse Subreddits Without an Account | Wappkit",
    description:
      "A Windows Reddit viewer that turns a subreddit into eight columns you can filter before reading. No account, no feed, no ads. Free version available.",
    image: "/images/blog/reddit_viewer_header.png",
  }),
  alternates: { canonical: PAGE_PATH },
};

const painPoints = [
  {
    icon: Gauge,
    title: "Every tap sells you the app",
    description:
      "The mobile web version keeps interrupting with a banner asking you to install the app or sign in. Reading five threads becomes a fight with the page.",
  },
  {
    icon: EyeOff,
    title: "Search results hit a login wall",
    description:
      "You follow a link from Google and the discussion is behind a sign-up form. Creating an account to read one thread is a bad trade.",
  },
  {
    icon: Filter,
    title: "You cannot sort what you are reading",
    description:
      "Infinite scroll gives you whatever the ranking decides. Try to find the highest-scoring post in a subreddit last week and you are scrolling and guessing.",
  },
];

const capabilities = [
  {
    icon: LayoutList,
    title: "Eight columns, one subreddit",
    description:
      "Each post becomes a row with subreddit, title, author, score, comment count, date, permalink, and source. Everything you would otherwise scroll past three times.",
  },
  {
    icon: Filter,
    title: "Filter before you read",
    description:
      "Set a minimum score, a comment floor, a date window, or required keywords. The list shrinks to the posts that actually match your question.",
  },
  {
    icon: Table2,
    title: "The permalink is on the row",
    description:
      "When you want the discussion and the replies, copy the link and open it in your browser. We do not pretend to replace the thread view.",
  },
  {
    icon: UserSearch,
    title: "What an author has been posting",
    description:
      "Open an account and see its recent submissions. Useful when a post makes a claim and you want to know who is making it.",
  },
  {
    icon: Sparkles,
    title: "Optional AI pass",
    description:
      "Bring your own AI key and get a short digest of a post list: which threads are worth reading and why. The key stays on your machine.",
  },
  {
    icon: KeyRound,
    title: "No account to create",
    description:
      "There is no Wappkit login, no dashboard, no email verification. If you buy a licence later, the key activates inside the app.",
  },
];

const comparison = [
  {
    label: "Read a post list without signing in",
    wappkit: "Yes",
    browser: "Sometimes",
    official: "No",
  },
  {
    label: "Sort order chosen when fetching",
    wappkit: "Yes",
    browser: "Yes",
    official: "Yes",
  },
  {
    label: "Comment threads in the app",
    wappkit: "No",
    browser: "Yes",
    official: "Yes",
  },
  {
    label: "Filter by score, comments, keywords",
    wappkit: "Yes",
    browser: "No",
    official: "No",
  },
  {
    label: "Export what you found to CSV",
    wappkit: "Yes",
    browser: "No",
    official: "No",
  },
  {
    label: "Home feed and ads",
    wappkit: "None",
    browser: "Yes",
    official: "Yes",
  },
];

const freeVsPro = [
  { label: "Browse a subreddit's post list", free: true, pro: true },
  { label: "Subreddit search", free: "Unlimited", pro: "Unlimited" },
  { label: "Post collection runs per day", free: "20", pro: "Unlimited" },
  { label: "Subreddits per run", free: "2", pro: "Unlimited" },
  { label: "Posts per run", free: "100", pro: "Unlimited" },
  { label: "Filter by score / comments / keywords", free: true, pro: true },
  { label: "Author activity lookups per day", free: "5", pro: "Unlimited" },
  { label: "AI digest of a post list per day", free: "5", pro: "Unlimited" },
  { label: "Post body and Post Analysis", free: false, pro: true },
  { label: "Subreddit analysis", free: false, pro: true },
  { label: "CSV export", free: "Preview", pro: "Full" },
];

const faqs = [
  {
    question: "Is this a website or a desktop app?",
    answer:
      "A desktop app for Windows 10 and 11. You download an installer, run it, and browse inside the app window. There is no web version and no account dashboard to log into.",
  },
  {
    question: "Can I read the comment threads in it?",
    answer:
      "No. The app shows the post list; post bodies appear in the Post Analysis view, which is part of the licence. Replies are never rendered in the app, so when you want the discussion you open the permalink in your browser. We would rather say this up front than have you find out after installing.",
  },
  {
    question: "Do I need a Reddit account?",
    answer:
      "Not to install it, and not to search subreddits. Some subreddits only return scores and post bodies when a Reddit session cookie is present, so the app offers a one-step import for that cookie. The cookie stays on your machine and is never uploaded to us.",
  },
  {
    question: "What does the free version actually allow?",
    answer:
      "Unlimited subreddit search, post collection up to 20 runs a day with 2 subreddits and 100 posts per run, 5 author lookups a day, and 5 AI digests a day. The licence removes the caps and unlocks the analysis tabs and full CSV export.",
  },
  {
    question: "Is there a Mac or Linux build?",
    answer:
      "Not yet. The current release is a Windows executable. On Mac, the browser version of Reddit plus an ad blocker is the closest thing we can point you to.",
  },
  {
    question: "Does this break Reddit's rules?",
    answer:
      "The app reads public pages the way a browser does, at a human pace. It does not post, vote, message, or create accounts, and the free tier caps keep request volume low by design.",
  },
];

const relatedReading = [
  {
    title: "Best Reddit viewers in 2025",
    href: "/blog/best-reddit-viewers-2025",
    description:
      "Seven viewers compared on speed, ads, and whether they still work.",
  },
  {
    title: "Browse Reddit without an account",
    href: "/blog/browse-reddit-without-account-2025",
    description:
      "Five anonymous viewing methods, from quick tricks to a desktop reader.",
  },
  {
    title: "Reddit Toolbox full feature list",
    href: "/tools/reddit-toolbox",
    description:
      "The research workflow behind the viewer: analysis, exports, and licensing.",
  },
];

function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Reddit Toolbox",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Windows 10, Windows 11",
        url: `${siteConfig.url}${PAGE_PATH}`,
        description:
          "A Windows desktop viewer that turns a subreddit's posts into eight filterable columns, without creating an account.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description:
            "Free version available, a licence unlocks the analysis tabs and removes the caps.",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

export default function RedditViewerPage() {
  return (
    <MarketingPageShell containerClassName="max-w-6xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />

      <MarketingHero
        eyebrow="Reddit viewer"
        title="A Reddit viewer that treats a subreddit like a table"
        description="Open a public subreddit and get its posts as eight columns you can filter before reading, without an account and without the feed. When you want the replies, the permalink is already on the row."
        badges={[
          { label: "No account required", tone: "warm" },
          { label: "Free version", tone: "default" },
          { label: "Windows desktop", tone: "muted" },
        ]}
        actions={
          <>
            <TrackedDownloadLink href="/download" toolSlug="reddit-toolbox" size="lg">
              <Download className="mr-2 size-4" />
              Download free version
            </TrackedDownloadLink>
            <Link href="/tools/reddit-toolbox">
              <Button rounded="full" size="lg" variant="outline">
                Full feature list
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </>
        }
        stats={[
          { label: "Platform", value: "Windows 10 / 11" },
          { label: "Price", value: "Free to start" },
          { label: "Account", value: "Not required" },
        ]}
        rightContent={
          <div className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-background/80 shadow-sm">
            <Image
              src="/images/blog/reddit_viewer_header.png"
              alt="Reddit Toolbox showing a subreddit's posts as a table"
              width={880}
              height={560}
              className="h-auto w-full"
              priority
            />
          </div>
        }
      />

      <section className="mt-14">
        <MarketingSectionIntro
          eyebrow="The problem"
          title="Why browsing a subreddit feels like work"
          description="If you are reading for a reason, the web version is built against you: it pushes an app, blocks search traffic, and refuses to sort."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {painPoints.map((item) => (
            <MarketingCard key={item.title} tone="soft">
              <item.icon className="size-6 text-orange-700" />
              <h3 className="mt-4 font-heading text-xl text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </MarketingCard>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <MarketingSectionIntro
          eyebrow="What you get"
          title="A table, a filter, and the permalink"
          description="Everything here is aimed at answering a question about a subreddit quickly. Nothing is designed to keep you scrolling."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {capabilities.map((item) => (
            <div
              key={item.title}
              className="rounded-[1.6rem] border border-border/70 bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-orange-100 p-2 text-orange-700">
                  <item.icon className="size-4" />
                </span>
                <h3 className="font-heading text-lg text-foreground">
                  {item.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <MarketingSectionIntro
          eyebrow="Side by side"
          title="What it does not do"
          description="The honest version. If comment threads are the main thing you want, stay in the browser and save your money."
        />
        <div className="mt-8 overflow-x-auto rounded-[1.6rem] border border-border/70 bg-card">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-6 py-4 font-semibold"></th>
                <th className="px-6 py-4 font-semibold text-foreground">
                  Wappkit viewer
                </th>
                <th className="px-6 py-4 font-semibold">reddit.com in a tab</th>
                <th className="px-6 py-4 font-semibold">Official app</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, index) => (
                <tr
                  key={row.label}
                  className={
                    index === comparison.length - 1
                      ? ""
                      : "border-b border-border/60"
                  }
                >
                  <th className="px-6 py-4 font-medium text-foreground">
                    {row.label}
                  </th>
                  <td className="px-6 py-4 font-semibold text-orange-800">
                    {row.wappkit}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {row.browser}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {row.official}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16">
        <MarketingSectionIntro
          eyebrow="Free and paid"
          title="Where the free version stops"
          description="The free tier is a working tool, not a countdown timer. The licence is for volume and for the analysis tabs."
        />
        <div className="mt-8 overflow-x-auto rounded-[1.6rem] border border-border/70 bg-card">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-6 py-4 font-semibold">Capability</th>
                <th className="px-6 py-4 font-semibold">Free</th>
                <th className="px-6 py-4 font-semibold text-foreground">
                  Licence
                </th>
              </tr>
            </thead>
            <tbody>
              {freeVsPro.map((row, index) => (
                <tr
                  key={row.label}
                  className={
                    index === freeVsPro.length - 1
                      ? ""
                      : "border-b border-border/60"
                  }
                >
                  <th className="px-6 py-4 font-medium text-foreground">
                    {row.label}
                  </th>
                  <td className="px-6 py-4 text-muted-foreground">
                    {row.free === true ? (
                      <Check className="size-4 text-orange-700" />
                    ) : row.free === false ? (
                      <span className="text-muted-foreground/70">No</span>
                    ) : (
                      row.free
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {row.pro === true ? (
                      <Check className="size-4 text-orange-700" />
                    ) : (
                      row.pro
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          The licence is a one-time purchase, activated with a key inside the
          app. See{" "}
          <Link href="/license" className="underline underline-offset-4">
            licensing details
          </Link>
          .
        </p>
      </section>

      <section className="mt-16">
        <MarketingSectionIntro
          eyebrow="Getting started"
          title="Three steps, about two minutes"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Download the installer",
              description:
                "One Windows executable, no account and no email required. The download page also lists the SHA256 checksum.",
            },
            {
              step: "02",
              title: "Type a subreddit name",
              description:
                "Pick a sort order, set a score or date filter, and the list fills in. Every row keeps its permalink for when you want the thread.",
            },
            {
              step: "03",
              title: "Import a cookie only if you need it",
              description:
                "Public listings load immediately. For scores and post bodies on some subreddits, the app walks you through a one-step cookie import.",
            },
          ].map((item) => (
            <MarketingCard key={item.step} tone="soft">
              <span className="font-heading text-3xl text-orange-700">
                {item.step}
              </span>
              <h3 className="mt-3 font-heading text-lg text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </MarketingCard>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <MarketingSectionIntro eyebrow="Questions" title="Before you install" />
        <div className="mt-8 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-[1.4rem] border border-border/70 bg-card p-6"
            >
              <summary className="cursor-pointer list-none font-heading text-lg text-foreground">
                <span className="flex items-start justify-between gap-4">
                  {faq.question}
                  <span className="mt-1 text-orange-700 transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <MarketingSectionIntro
          eyebrow="Keep reading"
          title="Related guides"
          description="These two articles cover the alternatives in detail, including the ones we do not build."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {relatedReading.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[1.4rem] border border-border/70 bg-card p-6 transition-colors hover:border-orange-300"
            >
              <h3 className="font-heading text-lg text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-orange-800">
                Read
                <ArrowRight className="ml-1 size-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <MarketingCtaBand
        className="mt-16"
        eyebrow="Try it"
        title="Install it, open a subreddit, decide from there"
        description="The free version is enough to judge it. No account, no card, no email."
      >
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <TrackedDownloadLink href="/download" toolSlug="reddit-toolbox" size="lg">
            <Download className="mr-2 size-4" />
            Download for Windows
          </TrackedDownloadLink>
          <Link href="/license">
            <Button rounded="full" size="lg" variant="outline">
              <ShieldCheck className="mr-2 size-4" />
              Compare licence options
            </Button>
          </Link>
        </div>
      </MarketingCtaBand>
    </MarketingPageShell>
  );
}
