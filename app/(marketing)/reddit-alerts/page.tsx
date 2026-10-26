import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  BellRing,
  Check,
  Clock,
  Download,
  Filter,
  Inbox,
  KeyRound,
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

const PAGE_PATH = "/reddit-alerts";

export const metadata: Metadata = {
  ...constructMetadata({
    title: "Reddit Alerts: Keyword Monitoring on Your Desktop | Wappkit",
    description:
      "Watch a subreddit for new posts that match your keywords, checked every few minutes while the app is open. Local rules, no email subscription, no cloud account. Free version available.",
    image: "/images/blog/reddit_viewer_header.png",
  }),
  alternates: { canonical: PAGE_PATH },
};

const painPoints = [
  {
    icon: Inbox,
    title: "Most alert tools want an email subscription",
    description:
      "You sign up, confirm an address, and then get a daily digest at a fixed hour. By the time it lands, the thread has thirty comments and the window is gone.",
  },
  {
    icon: BellRing,
    title: "Cloud monitors bill monthly for a cron job",
    description:
      "A server pings Reddit every ten minutes and forwards matches to a dashboard you have to remember to open. That is a subscription for something your own machine can do.",
  },
  {
    icon: Search,
    title: "Reddit search cannot watch anything",
    description:
      "Search answers what exists now. It cannot tell you when a new post appears tomorrow that mentions your product, your competitor, or your problem.",
  },
];

const capabilities = [
  {
    icon: BellRing,
    title: "Rules, not saved searches",
    description:
      "Each rule = one subreddit plus optional keywords. Keywords must all appear (title, body, or flair), so `cold email` does not fire on every post that says cold.",
  },
  {
    icon: Clock,
    title: "A check interval you choose",
    description:
      "Five minutes on a licence, thirty on the free plan. Every check is a single `sort=new` request, which keeps you well under Reddit's rate limit.",
  },
  {
    icon: Filter,
    title: "Score floor and baseline",
    description:
      "Ignore anything below a score you set. The first check after a rule is created only records what is already there, so you never get a hundred old posts at once.",
  },
  {
    icon: KeyRound,
    title: "Stored on your machine",
    description:
      "Rules, seen post IDs, and hits live in a local file. No cloud account, no email, nothing to unsubscribe from.",
  },
];

const comparison = [
  {
    label: "Where the rule runs",
    wappkit: "Your PC",
    cloud: "Their server",
    email: "Their server",
  },
  {
    label: "Needs an account",
    wappkit: "No",
    cloud: "Yes",
    email: "Yes",
  },
  {
    label: "Typical cost",
    wappkit: "Free or one-time",
    cloud: "Monthly",
    email: "Monthly",
  },
  {
    label: "Fastest check interval",
    wappkit: "5 min",
    cloud: "1 to 15 min",
    email: "Daily digest",
  },
  {
    label: "Works when your PC is off",
    wappkit: "No",
    cloud: "Yes",
    email: "Yes",
  },
];

const freeVsPro = [
  { label: "Alert rules", free: "1", pro: "5" },
  { label: "Minimum check interval", free: "30 min", pro: "5 min" },
  { label: "Keyword matching (all terms)", free: true, pro: true },
  { label: "Minimum score filter", free: true, pro: true },
  { label: "Hit history", free: "200 latest", pro: "200 latest" },
  { label: "Open a hit in the browser", free: true, pro: true },
];

const faqs = [
  {
    question: "Will it notify me when the app is closed?",
    answer:
      "No, and this is the trade-off worth understanding before you install. The check runs inside the desktop app, so closing the app pauses all alerts until you open it again. In exchange there is no server, no subscription, and your rules never leave your machine. If you need alerts at 3am with your PC off, you want a hosted monitor instead.",
  },
  {
    question: "Is it real-time?",
    answer:
      "No. A licence can check as often as every five minutes, the free plan every thirty. Reddit's own rate limits make anything faster unreliable anyway, and a five minute delay rarely matters for a discussion that will be read over hours.",
  },
  {
    question: "Do keywords use AND or OR?",
    answer:
      "All keywords in a rule must appear. That is deliberate: a single keyword like `email` matches far too much, while `cold email` plus `deliverability` narrows it to the posts you actually want. Each keyword can be a phrase, and matching is case-insensitive across the title, body, and flair.",
  },
  {
    question: "Why did I get no hits on the first check?",
    answer:
      "The first check after creating a rule only records what is already in the subreddit. Without that baseline you would get a hundred historical posts as alerts on day one and turn the feature off. From the second check onward you only see posts newer than the previous check.",
  },
  {
    question: "Does it need a Reddit cookie?",
    answer:
      "Not for the alert list itself: new posts come back without signing in. Without a session cookie a subreddit may return fewer fields, and the app will show the checks as running in a reduced mode. The cookie is optional and stays on your machine.",
  },
  {
    question: "What happens to the hits I do not open?",
    answer:
      "They stay in the Hit list with an unread count on the Alerts tab, capped at the 200 most recent so the file cannot grow without limit. Opening a hit marks the list read; deleting a rule removes its hits with it.",
  },
];

const relatedReading = [
  {
    title: "Reddit keyword monitoring, explained",
    href: "/blog/a-practical-guide-to-reddit-keyword-monitoring-for-founders-and-growth-operators",
    description:
      "What to watch, how to write terms that do not drown you in noise.",
  },
  {
    title: "Creating effective keyword alerts",
    href: "/blog/a-step-by-step-guide-to-creating-effective-reddit-keyword-alerts",
    description: "A step by step setup, from term selection to follow-up.",
  },
  {
    title: "The desktop viewer these alerts run in",
    href: "/reddit-viewer",
    description: "Where the hits open, and what the app does with posts.",
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
          "A Windows desktop app that watches subreddits for new posts matching your keywords while the app is open.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description:
            "Free plan allows one rule at a thirty minute interval; a licence raises it to five rules at five minutes.",
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

export default function RedditAlertsPage() {
  return (
    <MarketingPageShell containerClassName="max-w-6xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />

      <MarketingHero
        eyebrow="Reddit alerts"
        title="Watch a subreddit for new posts, without a cloud subscription"
        description="Write a rule, pick an interval, and the desktop app tells you when a new post matches. Rules and hits stay on your machine. It only runs while the app is open, and we say that on the box."
        badges={[
          { label: "Runs locally", tone: "warm" },
          { label: "No account", tone: "default" },
          { label: "Windows desktop", tone: "muted" },
        ]}
        actions={
          <>
            <TrackedDownloadLink href="/download" toolSlug="reddit-toolbox" size="lg">
              <Download className="mr-2 size-4" />
              Download free version
            </TrackedDownloadLink>
            <Link href="/reddit-viewer">
              <Button rounded="full" size="lg" variant="outline">
                See the viewer
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </>
        }
        stats={[
          { label: "Check interval", value: "5 min on a licence" },
          { label: "Rules", value: "1 free, 5 licensed" },
          { label: "Where it runs", value: "Your PC" },
        ]}
      />

      <section className="mt-14">
        <MarketingSectionIntro
          eyebrow="The problem"
          title="Alert tools are built for their server, not your workflow"
          description="Every hosted monitor solves the same problem by putting a cron job between you and Reddit. That is convenient and it is also a subscription."
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
          eyebrow="How it works"
          title="A rule, an interval, a list of hits"
          description="Four things to understand before you install. None of them are clever, which is the point."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
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
          eyebrow="Honest comparison"
          title="The one thing a hosted monitor does better"
          description="It keeps working when your computer is off. Everything else here is a trade we made on purpose."
        />
        <div className="mt-8 overflow-x-auto rounded-[1.6rem] border border-border/70 bg-card">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-6 py-4 font-semibold"></th>
                <th className="px-6 py-4 font-semibold text-foreground">
                  Wappkit desktop
                </th>
                <th className="px-6 py-4 font-semibold">Hosted monitor</th>
                <th className="px-6 py-4 font-semibold">Email digest</th>
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
                  <td className="px-6 py-4 text-muted-foreground">{row.cloud}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <X className="mt-0.5 size-4 shrink-0 text-orange-700" />
          If you need alerts while your PC is off, a hosted monitor is the right
          tool. We are not going to pretend otherwise.
        </p>
      </section>

      <section className="mt-16">
        <MarketingSectionIntro
          eyebrow="Free and paid"
          title="What the free plan covers"
          description="One rule is enough to find out whether alerting actually helps your workflow."
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
          Alerts are part of the same licence that unlocks the{" "}
          <Link href="/reddit-viewer" className="underline underline-offset-4">
            desktop viewer
          </Link>
          . See{" "}
          <Link href="/license" className="underline underline-offset-4">
            licensing details
          </Link>
          .
        </p>
      </section>

      <section className="mt-16">
        <MarketingSectionIntro
          eyebrow="Questions"
          title="The parts people ask about first"
        />
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
          description="How to pick terms that surface signal instead of noise."
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
        title="Create one rule and see what it finds"
        description="The first check builds a baseline, so nothing floods you. If it does not earn its place in a week, delete it."
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
