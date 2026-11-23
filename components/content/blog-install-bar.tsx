import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MarketingCard } from "@/components/marketing/page-shell";
import { REDDIT_READER } from "@/lib/store-links";

/**
 * Compact install strip for blog posts. Desktop readers already get the
 * sticky sidebar promo; this one carries the install link for the readers who
 * land on a phone, where the sidebar is hidden.
 */
export function BlogInstallBar({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  return (
    <MarketingCard
      tone="warm"
      className={`p-4 sm:p-5${className ? ` ${className}` : ""}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
            Free browser extension
          </p>
          <p className="mt-1 font-heading text-lg text-foreground">
            Read Reddit without the login wall
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Clean thread view, keyword highlighting and Markdown export. Free to
            install on Chrome or Edge.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={REDDIT_READER.chrome}
            target="_blank"
            rel="noopener"
            data-umami-event="extension_install_clicked"
            data-umami-event-store="chrome"
            data-umami-event-source={source}
          >
            <Button size="sm" rounded="full">
              <Download className="mr-1.5 size-4" />
              Add to Chrome — free
            </Button>
          </a>
          <a
            href={REDDIT_READER.edge}
            target="_blank"
            rel="noopener"
            data-umami-event="extension_install_clicked"
            data-umami-event-store="edge"
            data-umami-event-source={source}
          >
            <Button size="sm" rounded="full" variant="outline">
              Add to Edge
            </Button>
          </a>
        </div>
      </div>
    </MarketingCard>
  );
}