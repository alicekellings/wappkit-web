import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Download,
  ExternalLink,
  KeyRound,
} from "lucide-react";

import { getFeaturedTools } from "@/lib/tools";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MarketingCard,
  MarketingCtaBand,
  MarketingHero,
  MarketingPageShell,
  MarketingSectionIntro,
} from "@/components/marketing/page-shell";

export const metadata = constructMetadata({
  title: "Wappkit | Multi-Tool Product Site for Focused Utilities",
  description:
    "Discover Wappkit tools and find the Wappkit API or Wappkit AI service at api.wappkit.com. Browse product pages, guides, and license activation paths.",
});

export default function IndexPage() {
  const featuredTools = getFeaturedTools();

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="English-first product site for lightweight software tools"
        title="One home for practical tools, clean product pages, and direct licensing."
        description="Wappkit keeps each utility under one recognizable brand surface. Product pages, downloads, docs, checkout, activation, and recovery all follow the same simple path instead of splintering into separate dashboards."
        badges={[
          { label: "Main domain first", tone: "warm" },
          { label: "License-based checkout", tone: "muted" },
          { label: "Desktop and web ready" },
        ]}
        actions={
          <>
            <Link
              href="https://api.wappkit.com"
              target="_blank"
              rel="noreferrer"
            >
              <Button size="lg" rounded="full">
                Open Wappkit API
                <ExternalLink className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/tools">
              <Button size="lg" variant="outline" rounded="full">
                Browse Tools
              </Button>
            </Link>
            <Link href="/download">
              <Button size="lg" variant="outline" rounded="full">
                <Download className="mr-2 size-4" />
                Open Download Center
              </Button>
            </Link>
          </>
        }
        stats={[
          { label: "Live products", value: "3 desktop tools" },
          { label: "License model", value: "Key activation" },
          { label: "Content hub", value: "Blog + docs" },
        ]}
        rightContent={
          <MarketingCard tone="dark" className="relative overflow-hidden">
            <div className="absolute -right-8 top-6 size-32 rounded-full bg-orange-200/20 blur-3xl" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Wappkit Surface
            </p>
            <h2 className="mt-3 font-heading text-3xl text-white">
              Consistent from product page to recovery flow
            </h2>
            <div className="mt-6 space-y-3">
              {[
                {
                  icon: Download,
                  title: "Download paths stay obvious",
                  copy: "Users can move from product discovery to release download without leaving the brand surface.",
                },
                {
                  icon: KeyRound,
                  title: "License steps stay direct",
                  copy: "Checkout, retrieval, activation, and support all use the same language and structure.",
                },
                {
                  icon: BookOpen,
                  title: "Docs support the same sale",
                  copy: "Blog and docs stay attached to the same tool pages so the trust path feels coherent.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="bg-orange-500/12 rounded-full p-2 text-orange-200">
                      <item.icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {item.copy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MarketingCard>
        }
      />

      <section className="mt-10">
        <MarketingSectionIntro
          eyebrow="Featured tools"
          title="Tool pages built to scale without looking disposable."
          description="Each product keeps its own promise, but the surrounding surface stays unified so future launches feel intentional from day one."
        />

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {featuredTools.map((tool) => (
            <MarketingCard key={tool.slug} tone="soft" className="p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {tool.status === "live" ? "Available now" : "Coming soon"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {tool.category}
                </span>
              </div>
              <h3 className="mt-5 font-heading text-2xl text-foreground">
                {tool.name}
              </h3>
              <p className="mt-2 text-sm font-medium text-orange-700">
                {tool.tagline}
              </p>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {tool.shortDescription}
              </p>
              <div className="mt-6">
                <Link href={`/tools/${tool.slug}`}>
                  <Button rounded="full" variant="outline">
                    Open Product Page
                  </Button>
                </Link>
              </div>
            </MarketingCard>
          ))}
        </div>
      </section>

      <section className="mt-6 grid gap-6 md:grid-cols-3">
        <MarketingCard tone="warm" className="p-6">
          <h3 className="font-heading text-xl text-foreground">
            Directory-first structure
          </h3>
          <p className="mt-3 text-muted-foreground">
            Tools live under `/tools/[slug]`, which keeps SEO, navigation, and
            product trust concentrated on the main domain.
          </p>
        </MarketingCard>
        <MarketingCard tone="soft" className="p-6">
          <h3 className="font-heading text-xl text-foreground">
            License-first checkout
          </h3>
          <p className="mt-3 text-muted-foreground">
            Customers buy, receive a key, and activate inside the app without
            being pushed into a full account center.
          </p>
        </MarketingCard>
        <MarketingCard tone="soft" className="p-6">
          <h3 className="font-heading text-xl text-foreground">
            Shared docs and support
          </h3>
          <p className="mt-3 text-muted-foreground">
            Blog posts, activation guides, recovery steps, and support routes
            all reinforce the same tools instead of living in separate silos.
          </p>
        </MarketingCard>
      </section>

      <div className="mt-6">
        <MarketingCtaBand
          eyebrow="Build on one surface"
          title="Launch new tools without rebuilding the whole trust layer."
          description="Wappkit already has the pieces a small utility product needs: product page, download path, checkout, docs, and recovery. That makes each new tool easier to ship without making the brand feel stitched together."
        >
          <div className="rounded-3xl border border-orange-200 bg-white/85 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Next steps
            </p>
            <div className="mt-4 space-y-3">
              <Link href="/tools" className="block">
                <div className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-orange-300">
                  <span>Browse current tools</span>
                  <ArrowRight className="size-4" />
                </div>
              </Link>
              <Link href="/blog" className="block">
                <div className="flex items-center justify-between rounded-2xl border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:border-orange-300">
                  <span>Read the blog</span>
                  <ArrowRight className="size-4" />
                </div>
              </Link>
            </div>
          </div>
        </MarketingCtaBand>
      </div>
    </MarketingPageShell>
  );
}
