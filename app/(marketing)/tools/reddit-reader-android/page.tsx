import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Download,
  FileText,
  Highlighter,
  Rss,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import {
  MarketingCard,
  MarketingCtaBand,
  MarketingHero,
  MarketingPageShell,
  MarketingSectionIntro,
} from "@/components/marketing/page-shell";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/utils";

const PAGE_PATH = "/tools/reddit-reader-android";
const DOWNLOAD_HREF =
  "/api/downloads/reddit-reader-android?source=android_page";
const APK_SHA256 =
  "fceb8b7f719adf653d30fe5683cc45a0ba1b843594b6d07d0aefd5a17543fd70";

export const metadata = constructMetadata({
  title: "Reddit Reader for Android — Free APK, No Account | Wappkit",
  description:
    "A free Android app that browses subreddits through Reddit's public RSS, opens threads in a clean reader, highlights keywords, and exports them to Markdown. No account and no Wappkit server. 105 KB APK.",
  image: "/images/reddit-reader-android/reader-panel.png",
});

const features = [
  {
    icon: ShieldCheck,
    title: "No account, no Wappkit server",
    description:
      "The app requests reddit.com directly from your phone. Nothing is proxied through us, so there is no shared IP to get blocked and no account to create.",
  },
  {
    icon: Rss,
    title: "Browse without Reddit's page",
    description:
      "Hot, New, and Top load as a plain post list from Reddit's public RSS, then open in the same reader. No account, no app banner, no Reddit HTML.",
  },
  {
    icon: Highlighter,
    title: "Clean reader plus keyword highlight",
    description:
      "Login prompts, app banners, sidebars, and promoted posts are hidden. Add a keyword and every match in the post and comments is marked.",
  },
  {
    icon: FileText,
    title: "Export the thread to Markdown",
    description:
      "Save the post and its comment tree as one .md file in Downloads/RedditReader. Three free exports per install.",
  },
];

const installSteps = [
  {
    title: "Download the APK",
    description:
      "Tap the download button. The file is 105 KB and arrives as Wappkit-Reddit-Reader-0.2.apk.",
  },
  {
    title: "Allow installs from this source",
    description:
      "Android will warn that the file comes from outside the Play Store. Open Settings, allow your browser or file manager to install unknown apps, then tap Install.",
  },
  {
    title: "Open the app and read",
    description:
      "Tap Demo to see the reader on a sample thread, or tap Browse to load a subreddit's Hot, New, or Top feed. You can also paste a Reddit link and tap Open, or share one from another app.",
  },
];

const faqs = [
  {
    question: "Why is this an APK instead of a Play Store app?",
    answer:
      "The app is new and free. Direct APK delivery lets us ship fixes without waiting for store review. If it gets enough use, it will be submitted to Google Play.",
  },
  {
    question: "What is Browse?",
    answer:
      "Browse loads Hot, New, or Top posts from a subreddit's public RSS feed as a plain list. Open a post to read it in the same clean view. It needs no account and does not load Reddit's HTML page.",
  },
  {
    question: "Why does Android warn about the file?",
    answer:
      "Android shows that warning for every app installed outside the Play Store. It is not specific to this APK. You can verify the file with the SHA-256 hash below before installing.",
  },
  {
    question: "Does it need a VPN?",
    answer:
      "No. It uses your phone's normal connection. If Reddit blocks the network you are on, the app says so and asks you to switch to mobile data or turn off the VPN.",
  },
  {
    question: "What does the app collect?",
    answer:
      "The Android app has no analytics and no Wappkit account. This page uses the site's normal analytics and records a download count when the button is tapped; neither is tied to a named user.",
  },
];

function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "Wappkit Reddit Reader",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Android 8.0 and newer",
        softwareVersion: "0.2",
        fileSize: "107366",
        url: `${siteConfig.url}${PAGE_PATH}`,
        downloadUrl: `${siteConfig.url}${DOWNLOAD_HREF}`,
        description:
          "A free Android reader for Reddit that hides login prompts, highlights keywords, and exports threads to Markdown without an account.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };
}

export default function RedditReaderAndroidPage() {
  return (
    <MarketingPageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />

      <MarketingHero
        eyebrow="Android app · Free APK"
        title="Read Reddit on your phone without the login wall."
        description="A 105 KB Android app that browses subreddits through Reddit's public RSS, opens any thread in a clean reader, hides the app-install and sign-in prompts, and saves the post plus comments as Markdown. No account, no Wappkit server."
        badges={[
          { label: "Free", tone: "warm" },
          { label: "No account", tone: "default" },
          { label: "Android 8.0+", tone: "muted" },
        ]}
        actions={
          <>
            <a
              href={DOWNLOAD_HREF}
              data-umami-event="apk_download_clicked"
              data-umami-event-source="android_page_hero"
            >
              <Button rounded="full" size="lg">
                <Download className="mr-2 size-4" />
                Download APK (105 KB)
              </Button>
            </a>
            <Link href="#install">
              <Button rounded="full" size="lg" variant="outline">
                Installation steps
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </>
        }
        stats={[
          { label: "Version", value: "0.2" },
          { label: "Download size", value: "105 KB" },
          { label: "Price", value: "Free" },
        ]}
        rightContent={
          <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-[2rem] border border-border/70 bg-background/80 p-2 shadow-sm">
            <Image
              src="/images/reddit-reader-android/reader-panel.png"
              alt="Wappkit Reddit Reader running on Android with the reader panel open"
              width={1080}
              height={2400}
              className="h-auto w-full rounded-[1.6rem]"
              priority
            />
          </div>
        }
      />

      <section className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <MarketingCard key={feature.title} tone="soft" className="p-7">
            <span className="inline-flex rounded-full bg-orange-100 p-2 text-orange-700">
              <feature.icon className="size-5" />
            </span>
            <h2 className="mt-4 font-heading text-2xl text-foreground">
              {feature.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {feature.description}
            </p>
          </MarketingCard>
        ))}
      </section>

      <section id="install" className="mt-14 scroll-mt-24">
        <MarketingSectionIntro
          eyebrow="Install"
          title="Three steps, about a minute"
          description="The app is distributed as a direct APK. Android will ask you to allow installs from the browser or file manager you use; that is expected for any app outside the Play Store."
        />
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {installSteps.map((step, index) => (
            <MarketingCard key={step.title} className="p-7">
              <span className="inline-flex size-9 items-center justify-center rounded-full bg-orange-500 font-heading text-lg text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 font-heading text-xl text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {step.description}
              </p>
            </MarketingCard>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        <MarketingCard tone="warm" className="p-8">
          <div className="flex items-center gap-3">
            <Smartphone className="size-5 text-orange-700" />
            <h2 className="font-heading text-2xl text-foreground">
              What runs on your phone
            </h2>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            {[
              "Reddit loads from your own IP address, not ours.",
              "Browse uses Reddit's public RSS, not Reddit's page scripts.",
              "The app only requests the internet permission.",
              "No analytics, no account, no background service.",
              "Markdown goes to Downloads/RedditReader and stays on the device.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <Check className="mt-0.5 size-4 shrink-0 text-orange-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </MarketingCard>

        <MarketingCard className="p-8">
          <h2 className="font-heading text-2xl text-foreground">
            What it does not do
          </h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            {[
              "It does not post, vote, or reply on Reddit.",
              "It does not bypass a block on your network; it tells you when Reddit blocks it.",
              "It does not come with unlimited exports; the free build includes three.",
              "It does not send your reading history anywhere.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-slate-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </MarketingCard>
      </section>

      <section className="mt-14">
        <MarketingSectionIntro
          eyebrow="FAQ"
          title="Before you install"
          description="The short answers to the questions the download page usually gets."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-[1.5rem] border border-border/70 bg-card p-6"
            >
              <summary className="cursor-pointer list-none font-semibold text-foreground">
                {faq.question}
              </summary>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <MarketingCard tone="soft" className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            File verification
          </p>
          <h2 className="mt-3 font-heading text-2xl text-foreground">
            SHA-256 of the APK
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Optional but useful: compare this hash with the file you downloaded.
            It should match exactly.
          </p>
          <code className="mt-4 block overflow-x-auto rounded-[1rem] border border-border/70 bg-background p-4 font-mono text-xs text-foreground">
            {APK_SHA256}
          </code>
        </MarketingCard>
      </section>

      <MarketingCtaBand
        className="mt-14"
        eyebrow="One more thing"
        title="On a laptop? Use the browser extension instead."
        description="The Android APK is for phones. On Chrome or Edge, the extension adds the same reader, keyword highlight, and Markdown export to a desktop tab."
      >
        <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
          <a
            href={DOWNLOAD_HREF}
            data-umami-event="apk_download_clicked"
            data-umami-event-source="android_page_footer"
          >
            <Button rounded="full" size="lg">
              <Download className="mr-2 size-4" />
              Download APK (105 KB)
            </Button>
          </a>
          <Link href="/tools/reddit-viewer-extension">
            <Button rounded="full" size="lg" variant="outline">
              Desktop extension
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </MarketingCtaBand>
    </MarketingPageShell>
  );
}
