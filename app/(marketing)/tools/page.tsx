import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { tools } from "@/lib/tools";
import { Button } from "@/components/ui/button";

export const metadata = constructMetadata({
  title: "Tools | Wappkit",
  description:
    "Browse Wappkit tools, compare focused utilities, and open dedicated product pages for downloads, docs, and licensing details.",
});

export default function ToolsPage() {
  return (
    <div className="container max-w-6xl py-16 md:py-20">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Tools
        </p>
        <h1 className="font-heading text-4xl text-foreground md:text-5xl">
          Focused tools with simple pages, docs, and licensing.
        </h1>
        <p className="text-lg text-muted-foreground">
          Each Wappkit tool gets its own product page under the main domain.
          That keeps the structure predictable for GitHub, Vercel, SEO, and
          future launches.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <article key={tool.slug} className="rounded-3xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {tool.status === "live" ? "Live" : "Coming soon"}
              </span>
              <span className="text-sm text-muted-foreground">
                {tool.platform}
              </span>
            </div>
            <h2 className="mt-5 font-heading text-2xl text-foreground">
              {tool.name}
            </h2>
            <p className="mt-2 text-sm font-medium text-primary">
              {tool.tagline}
            </p>
            <p className="mt-4 text-muted-foreground">
              {tool.shortDescription}
            </p>
            <div className="mt-6">
              <Link href={`/tools/${tool.slug}`}>
                <Button rounded="full" variant="outline">
                  Open Product Page
                </Button>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
