import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { tools } from "@/lib/tools";
import { Button } from "@/components/ui/button";

export const metadata = constructMetadata({
  title: "Download Center | Wappkit",
  description:
    "Browse all Wappkit downloads in one place and jump into dedicated product pages for more details.",
});

export default function DownloadPage() {
  return (
    <div className="container max-w-6xl py-16 md:py-20">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Download Center
        </p>
        <h1 className="font-heading text-4xl text-foreground md:text-5xl">
          One place to find downloads across Wappkit tools.
        </h1>
        <p className="text-lg text-muted-foreground">
          The main conversion path still lives on each tool page. This download
          center exists as a simple cross-tool directory for users who already
          know what they want.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <div key={tool.slug} className="rounded-3xl border bg-card p-6">
            <h2 className="font-heading text-2xl text-foreground">
              {tool.name}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {tool.shortDescription}
            </p>
            <div className="mt-6">
              <Link href={`/tools/${tool.slug}`}>
                <Button rounded="full" variant="outline">
                  Open Product Page
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
