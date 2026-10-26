import Link from "next/link";
import { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Download,
  FileText,
  Filter,
  Info,
  Layers,
  Lock,
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

const PAGE_PATH = "/reddit-save";

export const metadata: Metadata = {
  ...constructMetadata({
    title: "Save Reddit Posts as Markdown, Full Text Included | Wappkit",
    description:
      "Archive a subreddit's posts as a Markdown file with the complete post text, author, score, date, and permalink. Text only, no images or video. Free version available.",
    image: "/images/blog/reddit_viewer_header.png",
  }),
  alternates: { canonical: PAGE_PATH },
};

const capabilities = [
  {
    icon: FileText,
    title: "The full post text",
    description:
      "Every post body is written out in full, not clipped at a preview length. If someone wrote 4,000 words, all 4,000 are in the file.",
  },
  {
    icon: Layers,
    title: "Metadata you cannot reconstruct later",
    description:
      "Author, score, comment count, posted time, and the permalink go with each post. Months later the numbers are gone from Reddit, but they are still in your archive.",
  },
  {
    icon: Filter,
    title: "Save what you filtered",
    description:
      "Set a score floor or a keyword filter, then save. You get the posts that matched, not the whole unfiltered list.",
  },
  {
    icon: Lock,
    title: "Readable without the app",
    description:
      "Plain Markdown, so the file opens in Obsidian, Notion, VS Code, or a text editor. Original headings, lists, and links inside a post are preserved as written.",
  },
];

const comparison = [
  {
    label: "Saves the full post text",
    wappkit: "Yes",
    screenshot: "No",
    cloudSaver: "Varies",
  },
  {
    label: "Saves author, score, date, permalink",
    wappkit: "Yes",
    screenshot: "No",
    cloudSaver: "Sometimes",
  },
  {
    label: "Saves images and video",
    wappkit: "No",
    screenshot: "As an image",
    cloudSaver: "Often",
  },
  {
    label: "Needs an account",
    wappkit: "No",
    screenshot: "No",
    cloudSaver: "Usually",
  },
  {
    label: "Readable years later",
    wappkit: "Yes",
    screenshot: "If you keep it",
    cloudSaver: "While you pay",
  },
];

const freeVsPro = [
  { label: "Save as Markdown", free: "First 100 posts", pro: "Unlimited" },
  { label: "Full post text", free: true, pro: true },
  { label: "Metadata per post", free: true, pro: true },
  { label: "Filter before saving", free: true, pro: true },
  { label: "Export CSV", free: "First 100 rows", pro: "Unlimited" },
];

const faqs = [
  {
    question: "Can it download images or video?",
    answer:
      "No. This saves the text of a post plus its metadata as a Markdown file. Images and video files are not downloaded, and gallery posts keep only their text and link. If your goal is saving media, this is the wrong tool and we would rather say so before you install.",
  },
  {
    question: "Why Markdown instead of PDF or HTML?",
    answer:
      "Markdown stays readable without the app that produced it, and it imports cleanly into note tools. A PDF locks the layout to a page size, and raw HTML from Reddit is mostly tracking wrappers.",
  },
  {
    question: "How many posts can one file hold?",
    answer:
      "As many as you collected, which is bounded by what Reddit returns per request plus paging. The free plan saves the first 100 posts of a result list; a licence removes that cap.",
  },
  {
    question: "Does it save the comments too?",
    answer:
      "No. Post text and post metadata only. Comments are a separate endpoint and are not part of the export.",
  },
  {
    question: "Is the file readable without Reddit?",
    answer:
      "Yes, that is the point. Each post becomes a heading plus a metadata block plus the body, all in plain text with UTF-8 encoding. Nothing in the file depends on Reddit still hosting the thread, though the permalink will stop working if the post is deleted.",
  },
];

const relatedReading = [
  {
    title: "Exporting Reddit data to CSV",
    href: "/blog/a-practical-guide-to-exporting-reddit-data-to-csv-for-founders-and-growth-operat",
    description: "When a spreadsheet is the better destination than Markdown.",
  },
  {
    title: "Export Reddit posts for offline analysis",
    href: "/blog/a-step-by-step-guide-to-exporting-reddit-posts-for-offline-analysis",
    description: "A workflow for keeping research after the thread is gone.",
  },
  {
    title: "The viewer these saves come from",
    href: "/reddit-viewer",
    description: "How posts get collected in the first place.",
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
          "A Windows desktop app that saves a subreddit's posts as a Markdown archive with the complete post text and metadata. Text only, no media download.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description:
            "Free plan saves the first 100 posts of a result list; a licence removes the cap.",
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

export default function RedditSavePage() {
  return (
    <MarketingPageShell containerClassName="max-w-6xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />

      <MarketingHero
        eyebrow="Reddit save"
        title="Save Reddit posts as Markdown, with the text intact"
        description="Collect a subreddit's posts, filter them, and write the result to a Markdown file with the complete post text plus author, score, date, and permalink. Text only: no images, no video, and we say that up front."
        badges={[
          { label: "Text only", tone: "warm" },
          { label: "Markdown, no lock-in", tone: "default" },
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
          { label: "Format", value: "Markdown (.md)" },
          { label: "Media files", value: "Not supported" },
          { label: "Account", value: "Not required" },
        ]}
      />

      <section className="mt-12">
        <div className="flex items-start gap-3 rounded-[1.4rem] border border-orange-200 bg-orange-50/70 p-6">
          <Info className="mt-0.5 size-5 shrink-0 text-orange-700" />
          <div>
            <p className="font-heading text-lg text-foreground">
              What this does not do
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              It does not download images or video files, and it does not save
              comment threads. If that is what you came for, a media saver is the
              right tool. This one is an archive of post text and numbers, which
              is what most research actually needs to keep.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <MarketingSectionIntro
          eyebrow="What you get"
          title="A file that still makes sense in two years"
          description="Screenshots go stale, bookmarks rot, and the numbers on a thread only go up or get deleted. A text archive survives both."
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
          eyebrow="Side by side"
          title="Compared to the usual ways of saving a post"
          description="A screenshot is faster. It also cannot be searched, quoted, or sorted a year later."
        />
        <div className="mt-8 overflow-x-auto rounded-[1.6rem] border border-border/70 bg-card">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/70 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                <th className="px-6 py-4 font-semibold"></th>
                <th className="px-6 py-4 font-semibold text-foreground">
                  Wappkit
                </th>
                <th className="px-6 py-4 font-semibold">Screenshot</th>
                <th className="px-6 py-4 font-semibold">Cloud saver</th>
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
                    {row.screenshot}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {row.cloudSaver}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
          <X className="mt-0.5 size-4 shrink-0 text-orange-700" />
          A cloud saver is better at media. This is better at text you can search
          later.
        </p>
      </section>

      <section className="mt-16">
        <MarketingSectionIntro
          eyebrow="Free and paid"
          title="Where the free plan stops"
          description="The format and the fidelity are the same on both plans. Only the row cap differs."
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
          description="When a spreadsheet beats a text archive, and how to keep research long term."
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
        title="Collect a subreddit, save the file, open it in your editor"
        description="If the archive is not useful within a week, the tool is not earning its place. The free plan is enough to decide."
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
