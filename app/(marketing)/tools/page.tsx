import Link from "next/link";
import { ArrowRight, LayoutTemplate, Sparkles } from "lucide-react";

import { tools } from "@/lib/tools";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";

export const metadata = constructMetadata({
  title: "Tools | Wappkit",
  description:
    "Browse Wappkit tools, compare focused utilities, and open dedicated product pages for downloads, docs, and licensing details.",
});

export default function ToolsPage() {
  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Wappkit tools"
        title="Focused utilities, presented through one consistent product language."
        description="Each tool keeps its own promise, but the pages now follow the same visual system: structured hero, clear action buttons, strong cards, and support paths that feel like part of the same product family."
        badges={[
          { label: "Shared layout", tone: "warm" },
          { label: "Per-tool messaging", tone: "muted" },
          { label: "Launch-ready catalog" },
        ]}
        actions={
          <>
            <Link href="/download">
              <Button rounded="full" size="lg">
                Open Download Center
              </Button>
            </Link>
            <Link href="/license">
              <Button rounded="full" size="lg" variant="outline">
                License Center
              </Button>
            </Link>
          </>
        }
        stats={[
          { label: "Live now", value: "Reddit Toolbox" },
          { label: "Future tools", value: "Template-ready" },
          { label: "Support model", value: "Docs + recovery" },
        ]}
        rightContent={
          <MarketingCard tone="dark" className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Catalog system
            </p>
            {[
              {
                icon: LayoutTemplate,
                title: "Reusable page frame",
                copy: "New tools can inherit the same hero, card rhythm, and CTA structure without looking generic.",
              },
              {
                icon: Sparkles,
                title: "Room for product personality",
                copy: "The structure stays consistent while the copy, screenshots, and positioning stay specific to each tool.",
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
          </MarketingCard>
        }
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <MarketingCard key={tool.slug} tone="soft" className="p-6">
            <div className="flex items-center justify-between gap-3">
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
            <p className="mt-2 text-sm font-medium text-orange-700">
              {tool.tagline}
            </p>
            <p className="mt-4 text-muted-foreground">
              {tool.shortDescription}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/tools/${tool.slug}`}>
                <Button rounded="full" variant="outline">
                  Open Product Page
                </Button>
              </Link>
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <ArrowRight className="size-4 text-orange-700" />
                {tool.availabilityNote}
              </span>
            </div>
          </MarketingCard>
        ))}
      </div>
    </MarketingPageShell>
  );
}
