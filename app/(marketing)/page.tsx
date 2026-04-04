import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { getFeaturedTools } from "@/lib/tools";
import { Button } from "@/components/ui/button";

export const metadata = constructMetadata({
  title: "Wappkit | Multi-Tool Product Site for Focused Utilities",
  description:
    "Discover focused desktop and web utilities on Wappkit. Browse tools, read practical guides, and manage license activation without a user dashboard.",
});

export default function IndexPage() {
  const featuredTools = getFeaturedTools();

  return (
    <div className="flex flex-col">
      <section className="border-b bg-gradient-to-b from-background via-background to-muted/40">
        <div className="container max-w-6xl py-20 md:py-28">
          <div className="max-w-3xl space-y-6">
            <span className="inline-flex rounded-full border px-4 py-1 text-sm font-medium text-muted-foreground">
              English-first product site for lightweight software tools
            </span>
            <h1 className="font-heading text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
              One home for practical tools, simple licensing, and clear docs.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Wappkit brings focused utilities under one clean product site.
              Each tool gets its own landing page, download path, documentation,
              and license-based checkout flow without a bulky account system.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/tools">
                <Button size="lg" rounded="full">
                  Browse Tools
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline" rounded="full">
                  Read the Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b">
        <div className="container max-w-6xl py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Featured Tools
              </p>
              <h2 className="mt-2 font-heading text-3xl text-foreground">
                Tool pages built to scale
              </h2>
            </div>
            <Link href="/tools" className="text-sm font-medium text-primary">
              View all tools
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredTools.map((tool) => (
              <article
                key={tool.slug}
                className="rounded-3xl border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
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
                <p className="mt-3 text-base text-muted-foreground">
                  {tool.shortDescription}
                </p>
                <div className="mt-6">
                  <Link href={`/tools/${tool.slug}`}>
                    <Button rounded="full" variant="outline">
                      Open Tool Page
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b bg-muted/30">
        <div className="container grid max-w-6xl gap-6 py-16 md:grid-cols-3">
          <div className="rounded-3xl border bg-background p-6">
            <h3 className="font-heading text-xl text-foreground">
              Directory-first structure
            </h3>
            <p className="mt-3 text-muted-foreground">
              Tools live under `/tools/[slug]`, keeping SEO, navigation, and
              analytics concentrated on the main domain.
            </p>
          </div>
          <div className="rounded-3xl border bg-background p-6">
            <h3 className="font-heading text-xl text-foreground">
              License-based checkout
            </h3>
            <p className="mt-3 text-muted-foreground">
              Customers buy with Creem, receive a license, and activate inside
              the app. No mandatory account dashboard required.
            </p>
          </div>
          <div className="rounded-3xl border bg-background p-6">
            <h3 className="font-heading text-xl text-foreground">
              Shared blog and docs
            </h3>
            <p className="mt-3 text-muted-foreground">
              Blog posts and documentation stay under the main domain so each
              new tool benefits from the same content hub.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
