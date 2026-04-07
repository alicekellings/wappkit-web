import Link from "next/link";

import { getPromotedTool } from "@/lib/tools";
import { Button } from "@/components/ui/button";
import { MarketingCard } from "@/components/marketing/page-shell";
import { cn } from "@/lib/utils";

export function BlogProductPromo({
  seed,
  className,
}: {
  seed: string;
  className?: string;
}) {
  const tool = getPromotedTool(seed);

  if (!tool) {
    return null;
  }

  const isLive = tool.status === "live";

  return (
    <MarketingCard
      tone="warm"
      className={cn(
        "overflow-hidden border-orange-200 bg-[linear-gradient(180deg,rgba(255,247,237,0.96),rgba(255,255,255,0.98))] p-6",
        className,
      )}
    >
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-700">
            From Wappkit
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
              {isLive ? "Live tool" : "Coming soon"}
            </span>
            <span className="rounded-full border border-border/70 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {tool.platform}
            </span>
          </div>
          <h3 className="font-heading text-2xl text-foreground">{tool.name}</h3>
          <p className="text-[15px] leading-7 text-muted-foreground">
            {tool.shortDescription}
          </p>
        </div>

        <div className="rounded-[1.4rem] border border-orange-200/80 bg-white/80 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Why it fits this blog
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
            {tool.features.slice(0, 2).map((feature) => (
              <li key={feature}>- {feature}</li>
            ))}
          </ul>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          {tool.availabilityNote}
        </p>

        <div className="flex flex-col gap-3">
          <Link href={`/tools/${tool.slug}`}>
            <Button rounded="full" className="w-full">
              View Product
            </Button>
          </Link>
          <Link href={tool.downloadHref}>
            <Button rounded="full" variant="outline" className="w-full">
              {tool.downloadLabel}
            </Button>
          </Link>
        </div>
      </div>
    </MarketingCard>
  );
}
