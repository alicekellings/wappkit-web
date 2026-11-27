import Link from "next/link";

import { REDDIT_READER } from "@/lib/store-links";
import { MarketingCard } from "@/components/marketing/page-shell";
import { RedditReaderInstallLinks } from "@/components/marketing/reddit-reader-install-links";

export function BlogInstallBar({
  includeFirefox,
}: {
  includeFirefox: boolean;
}) {
  return (
    <MarketingCard tone="warm" className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-700">
            Free browser extension
          </p>
          <p className="mt-1 font-heading text-lg text-foreground">
            Read public Reddit threads in a cleaner view
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Highlight keywords and try three Markdown exports free.
            {includeFirefox && (
              <>
                {" "}
                <Link
                  href={`/tools/${REDDIT_READER.slug}#reddit-reader-pro`}
                  className="font-medium text-foreground underline underline-offset-4"
                >
                  Pro is $4.99 once for unlimited exports and keywords.
                </Link>
              </>
            )}
          </p>
        </div>
        <RedditReaderInstallLinks
          source="article_top"
          includeFirefox={includeFirefox}
          compact
        />
      </div>
    </MarketingCard>
  );
}
