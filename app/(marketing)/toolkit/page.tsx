import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Download,
  FileSpreadsheet,
  FileText,
  Search,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";
import { constructMetadata } from "@/lib/utils";

const TOOLKIT_CHECKOUT_URL =
  process.env.NEXT_PUBLIC_TOOLKIT_CHECKOUT_URL ?? "https://payhip.com/b/oPJp6";

export const metadata = constructMetadata({
  title: "The Anonymous Reddit Toolkit | Wappkit",
  description:
    "A $5 PDF + CSV for reading Reddit without an account: six viewing methods, 60 subreddits that usually accept new accounts, a privacy checklist, search operators, and a seven-day research plan.",
});

const contents = [
  {
    title: "6 viewing methods",
    description:
      "Incognito + direct post URLs, Redlib-style mirrors, RSS, a desktop reader, VPN + privacy browser, and Reddit's public JSON endpoints. Each with steps, pros, cons, and when to use it.",
    icon: Search,
  },
  {
    title: "60 subreddits",
    description:
      "General, Tech, Business, Creative, Health, Finance and Hobbies. Every row has a realistic karma note: usually none, check rules, or around 50 karma.",
    icon: FileSpreadsheet,
  },
  {
    title: "Privacy checklist",
    description:
      "IP, DNS and WebRTC leaks, cookies, browser profiles, extension permissions, and the limits of each method.",
    icon: ShieldCheck,
  },
  {
    title: "Search operators",
    description:
      "The exact Google and Reddit queries for finding pain points, alternatives, recommendations, and fresh threads.",
    icon: Search,
  },
  {
    title: "Export workflow",
    description:
      "Keep the post, the useful comments, the URL and the date as a Markdown file you will actually reread.",
    icon: FileText,
  },
  {
    title: "7-day plan",
    description:
      "From picking five subreddits to writing a one-page research memo, with a clear output for each day.",
    icon: Download,
  },
];

const faqs = [
  {
    question: "Is this a Reddit account or a proxy?",
    answer:
      "No. It is a PDF + CSV guide. It explains how to read public Reddit pages without logging in, and how to find communities that usually accept new accounts. It does not create accounts, bypass bans, or provide a proxy.",
  },
  {
    question: "Will every subreddit on the list accept my post?",
    answer:
      "No. Karma thresholds and rules change constantly. The list gives you a starting point and an honest note for each community; always check the sidebar and the current rules before posting.",
  },
  {
    question: "What format do I get?",
    answer:
      "An 11-page A4 PDF and a CSV with 60 communities and a blank notes column. Both are delivered immediately after checkout.",
  },
  {
    question: "Can I use this for marketing research?",
    answer:
      "Yes. The seven-day plan and the export workflow are built for founders, marketers and researchers who collect threads and keep them as notes. Just follow each subreddit's rules and Reddit's User Agreement.",
  },
];

export default function ToolkitPage() {
  const buyHref = TOOLKIT_CHECKOUT_URL || "/contact";
  const buyLabel = TOOLKIT_CHECKOUT_URL
    ? "Get the toolkit — $5"
    : "Ask about the toolkit";

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Digital toolkit · PDF + CSV"
        title="Read Reddit without an account — and keep what you find."
        description="A $5 working toolkit: six anonymous viewing methods, 60 subreddits that usually accept new accounts, a privacy checklist, search operators, and a seven-day research plan."
        badges={[
          { label: "PDF + CSV", tone: "warm" },
          {
            label: TOOLKIT_CHECKOUT_URL ? "Instant download" : "Available on request",
            tone: "muted",
          },
          { label: "$5 one-time" },
        ]}
        actions={
          <>
            <a
              href={buyHref}
              target={TOOLKIT_CHECKOUT_URL ? "_blank" : undefined}
              rel="noopener"
              data-umami-event="toolkit_buy_clicked"
            >
              <Button rounded="full" size="lg">
                {buyLabel}
              </Button>
            </a>
            <Link href="/tools/reddit-viewer-extension">
              <Button rounded="full" size="lg" variant="outline">
                See the browser extension
              </Button>
            </Link>
          </>
        }
        stats={[
          { label: "Format", value: "11-page PDF + CSV" },
          { label: "Subreddits", value: "60 with karma notes" },
          { label: "Price", value: "$5 one-time" },
        ]}
        rightContent={
          <div className="overflow-hidden rounded-[1.8rem] border border-slate-800 bg-slate-950 shadow-[0_32px_80px_-24px_rgba(15,23,42,0.55)]">
            <Image
              src="/toolkit/cover-1200x800.png"
              alt="The Anonymous Reddit Toolkit cover"
              width={1200}
              height={800}
              className="h-auto w-full"
              priority
            />
          </div>
        }
      />

      <section className="mt-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            What is inside
          </p>
          <h2 className="mt-3 font-heading text-3xl text-foreground">
            One file for the whole anonymous-Reddit workflow.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            The PDF is written to be read on screen or printed. The CSV is the
            working copy: add the rules you verify, the subreddits that worked,
            and the ones that rejected a post.
          </p>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {contents.map((item) => {
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
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <MarketingCard tone="warm" className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
            Who it is for
          </p>
          <h2 className="mt-3 font-heading text-3xl text-foreground">
            People who read Reddit for a reason.
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-foreground">
            {[
              "You want to read Reddit without creating an account.",
              "You collect threads for notes, research or a product idea.",
              "You are tired of login walls, app banners and losing a good thread in a tab.",
              "You want a repeatable workflow, not a list of tricks.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check className="mt-1 size-4 text-orange-700" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </MarketingCard>

        <MarketingCard tone="dark" className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            What it is not
          </p>
          <h2 className="mt-3 font-heading text-3xl text-white">
            Honest limits, up front.
          </h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-200">
            {[
              "Not a Reddit proxy, vote bot or ban-evasion guide.",
              "Not a guarantee that a subreddit will accept your post.",
              "Not affiliated with, endorsed by, or sponsored by Reddit.",
              "Rules and karma thresholds change; verify before posting.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-orange-300" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </MarketingCard>
      </section>

      <section className="mt-10">
        <div className="rounded-[1.8rem] border bg-card p-8 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Get the toolkit
              </p>
              <h2 className="mt-3 font-heading text-3xl text-foreground">
                $5 once. PDF + CSV. Instant download.
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                If the files do not open or the download is broken, reply to the
                receipt within 7 days and I will fix it or refund you.
              </p>
            </div>
            <a
              href={buyHref}
              target={TOOLKIT_CHECKOUT_URL ? "_blank" : undefined}
              rel="noopener"
              data-umami-event="toolkit_buy_clicked"
            >
              <Button rounded="full" size="lg">
                {buyLabel}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            FAQ
          </p>
          <h2 className="mt-3 font-heading text-3xl text-foreground">
            Questions before you buy.
          </h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <MarketingCard key={faq.question} tone="soft" className="p-6">
              <h3 className="font-heading text-lg text-foreground">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {faq.answer}
              </p>
            </MarketingCard>
          ))}
        </div>
      </section>
    </MarketingPageShell>
  );
}
