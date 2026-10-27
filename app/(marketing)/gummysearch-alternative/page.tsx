import Link from "next/link";
import { Metadata } from "next";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Download,
  FileText,
  Filter,
  HardDrive,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  X,
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

const PAGE_PATH = "/gummysearch-alternative";

export const metadata: Metadata = {
  ...constructMetadata({
    title: "GummySearch Alternative for Windows: Desktop Reddit Research | Wappkit",
    description:
      "GummySearch shut down. Reddit Toolbox is a desktop alternative for Windows: watch subreddits for new posts by keyword, sort and filter results, export to CSV or Markdown, and download post images. Free version available.",
    image: "/images/blog/reddit_viewer_header.png",
  }),
  alternates: { canonical: PAGE_PATH },
};

const whatChanged = [
  {
    icon: HardDrive,
    title: "Desktop instead of a hosted dashboard",
    description:
      "Rules, collected posts and exports live on your machine. There is no account to keep paying for, and nothing to lose when a vendor shuts down.",
  },
  {
    icon: MonitorSmartphone,
    title: "One-time purchase instead of a subscription",
    description:
      "A licence unlocks the full workflow permanently. No monthly fee, no seat count, no plan tier to be moved out of.",
  },
  {
    icon: Search,
    title: "Built for reading lists, not social browsing",
    description:
      "A subreddit becomes eight columns you can sort and filter. The permalink sits on every row, so opening the real thread is one click.",
  },
];

const comparison = [
  {
    label: "Still available",
    wappkit: "Yes",
    gummy: "Shut down",
    other: "Varies",
  },
  {
    label: "Where it runs",
    wappkit: "Your PC",
    gummy: "Their cloud",
    other: "Their cloud",
  },
  {
    label: "Pricing model",
    wappkit: "One-time",
    gummy: "Monthly",
    other: "Monthly",
  },
  {
    label: "Needs an account",
    wappkit: "No",
    gummy: "Yes",
    other: "Yes",
  },
  {
    label: "Keyword monitoring",
    wappkit: "Yes",
    gummy: "Yes",
    other: "Usually",
  },
  {
    label: "Export to CSV / Markdown",
    wappkit: "Yes",
    gummy: "CSV",
    other: "Sometimes",
  },
  {
    label: "Download post images",
    wappkit: "Yes",
    gummy: "No",
    other: "Rarely",
  },
  {
    label: "Alerts while your PC is off",
    wappkit: "No",
    gummy: "Yes",
    other: "Yes",
  },
];

const mapping = [
  {
    from: "Saved searches",
    to: "Alert rules",
    detail:
      "One rule = one subreddit plus optional keywords. Keywords use AND, so `cold, email` only fires when both appear.",
  },
  {
    from: "Daily digest email",
    to: "Hits list while the app is open",
    detail:
      "New matches collect in the Alerts tab with an unread count. This is the honest difference: we do not run while your PC is off.",
  },
  {
    from: "Results grid with filters",
    to: "Scrape Posts table",
    detail:
      "Score floor, comment floor, date window and required keywords. Filtered results are what gets exported.",
  },
  {
    from: "CSV export",
    to: "CSV or Markdown",
    detail:
      "CSV keeps the familiar shape. Markdown keeps the full post body and reads well in Obsidian or Notion.",
  },
];

const faqs = [
  {
    question: "Is this a drop-in replacement for GummySearch?",
    answer:
      "No, and the main gap is intentional to mention up front: GummySearch was a hosted service, so it kept collecting while you were offline. Reddit Toolbox is a desktop app, so alerts only run while the app is open. What you get in exchange is no subscription, no account, and your data staying on your machine.",
  },
  {
    question: "Can I import my GummySearch data?",
    answer:
      "No. GummySearch's export files use their own schema, and we do not parse them. What people usually do is re-create their most important saved searches as alert rules, which takes a few minutes per rule. The subreddits and keywords are the same, so the re-creation is mechanical.",
  },
  {
    question: "Do I need a Reddit account or API key?",
    answer:
      "Neither is required to start. Without a Reddit cookie the app reads the public RSS feed, which gives titles, full post text, authors and links (about 25 posts per check). Adding a cookie, copied from your browser once per day, adds scores, comment counts and paging.",
  },
  {
    question: "Is there a Mac version?",
    answer:
      "Not yet. The current release is a Windows executable. On Mac the closest option is browsing with an ad blocker plus a spreadsheet, which is exactly the workflow this tool replaces.",
  },
  {
    question: "What happens if you shut down?",
    answer:
      "Nothing stops working. The app runs locally, the licence is verified offline with a signed token, and your exports are plain CSV and Markdown files. There is no server dependency to break.",
  },
];

const relatedReading = [
  {
    title: "Reddit research tools after GummySearch",
    href: "/blog/best-reddit-research-tools-2026-patterns-from-founder-reviews-after-gummysearch",
    description: "What founders actually switched to, and why.",
  },
  {
    title: "Practical alternatives compared",
    href: "/blog/gummysearch-alternative-reddit-toolbox-2025",
    description: "A longer comparison of the options still running.",
  },
  {
    title: "How the viewer works",
    href: "/reddit-viewer",
    description: "The table, the filters, and what it deliberately does not do.",
  },
];

function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Reddit Toolbox",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Windows 10, Windows 11",
        url: `${siteConfig.url}${PAGE_PATH}`,
        description:
          "A Windows desktop alternative to GummySearch: keyword alerts for subreddits, filterable post lists, CSV and Markdown export, and post image download.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description:
            "Free plan available; a one-time licence unlocks unlimited collection, analysis tabs and media download.",
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

export default function GummySearchAlternativePage() {
  return (
    <MarketingPageShell containerClassName="max-w-6xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />

      <MarketingHero
        eyebrow="GummySearch alternative"
        title="GummySearch is gone. Here is the desktop replacement."
        description="Reddit Toolbox runs on your Windows machine: watch subreddits for new posts matching your keywords, sort and filter the results, then export to CSV or Markdown. No account, no monthly fee, and your collected data never leaves the PC."
        badges={[
          { label: "One-time licence", tone: "warm" },
          { label: "No account", tone: "default" },
          { label: "Windows desktop", tone: "muted" },
        ]}
        actions={
          <>
            <TrackedDownloadLink href="/download" toolSlug="reddit-toolbox" size="lg">
              <Download className="mr-2 size-4" />
              Download free version
            </TrackedDownloadLink>
            <Link href="/license">
              <Button rounded="full" size="lg" variant="outline">
                See pricing
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </>
        }
        stats={[
          { label: "Platform", value: "Windows 10 / 11" },
          { label: "Pricing", value: "One-time" },
          { label: "Data lives", value: "On your PC" },
        ]}
      />

      <section className="mt-12">
        <div className="flex items-start gap-3 rounded-[1.4rem] border border-orange-200 bg-orange-50/70 p-6">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-orange-700" />
          <div>
            <p className="font-heading text-lg text-foreground">
              The one thing we do not replace
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              GummySearch was hosted, so it monitored Reddit while you were asleep.
              This app runs on your machine, so alerts only fire while the window is
              open. If unattended 24/7 monitoring is the whole reason you used
              GummySearch, a hosted tool is still the right answer and we would
              rather tell you that now.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <MarketingSectionIntro
          eyebrow="What changed"
          title="Why a desktop app instead of another subscription"
          description="The last three Reddit research tools people relied on were all cloud services that eventually closed. That is the failure mode this design avoids."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {whatChanged.map((item) => (
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
          eyebrow="Side by side"
          title="How it compares"
          description="Including the row where we lose."
        />
        <div className="mt-8 overflow-x-auto rounded-[1.6rem] border border-border/70 bg-card">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-6 py-4 font-semibold"></th>
                <th className="px-6 py-4 font-semibold text-foreground">
                  Reddit Toolbox
                </th>
                <th className="px-6 py-4 font-semibold">GummySearch</th>
                <th className="px-6 py-4 font-semibold">Hosted tools</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row, index) => {
                const losing = row.wappkit === "No";
                return (
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
                    <td
                      className={
                        losing
                          ? "px-6 py-4 font-semibold text-muted-foreground"
                          : "px-6 py-4 font-semibold text-orange-800"
                      }
                    >
                      {row.wappkit}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {row.gummy}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{row.other}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16">
        <MarketingSectionIntro
          eyebrow="Migration"
          title="Where your old workflow maps to"
          description="Nothing imports automatically, but the pieces line up one to one."
        />
        <div className="mt-8 space-y-4">
          {mapping.map((item) => (
            <div
              key={item.from}
              className="rounded-[1.4rem] border border-border/70 bg-card p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {item.from}
                </span>
                <ArrowRight className="size-4 text-muted-foreground" />
                <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-800">
                  {item.to}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <MarketingSectionIntro
          eyebrow="What you get"
          title="The parts that matter day to day"
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Filter,
              title: "Filter before you read",
              text: "Minimum score, comment floor, date window, required keywords. The list shrinks to posts that actually match.",
            },
            {
              icon: FileText,
              title: "Export that survives",
              text: "CSV for spreadsheets, Markdown for notes. Markdown keeps the full post body, not a truncated preview.",
            },
            {
              icon: ShieldCheck,
              title: "Works offline after activation",
              text: "The licence is a signed token verified locally, valid for 7 days without a network call.",
            },
            {
              icon: Check,
              title: "Free version to judge it",
              text: "20 collection runs a day, two subreddits and 100 posts per run. Enough to decide without talking to sales.",
            },
          ].map((item) => (
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
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <MarketingSectionIntro eyebrow="Questions" title="Before you switch" />
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
          title="More on the switch"
          description="Honest comparisons, including the tools we do not build."
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
        title="Install it, rebuild one saved search, see if it holds up"
        description="The free version is enough for that. No account, no card, no call."
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
