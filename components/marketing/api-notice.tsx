import Link from "next/link";
import { ExternalLink, ServerCog } from "lucide-react";

import { Button } from "@/components/ui/button";

export function WappkitApiNotice() {
  return (
    <section className="border-t border-orange-100/70 bg-[linear-gradient(120deg,rgba(255,247,237,0.95),rgba(255,255,255,0.99))] py-4 md:py-5">
      <div className="container max-w-6xl">
        <div className="overflow-hidden rounded-[1.35rem] border border-orange-200 bg-[linear-gradient(120deg,rgba(255,247,237,0.98),rgba(255,255,255,0.99))] p-4 shadow-[0_18px_50px_-34px_rgba(194,65,12,0.65)] md:px-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <span className="rounded-xl border border-orange-200 bg-white p-2.5 text-orange-700 shadow-sm">
                <ServerCog className="size-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                  Searching for Wappkit API or Wappkit AI?
                </p>
                <h2 className="mt-1.5 font-heading text-xl leading-tight text-foreground md:text-2xl">
                  The API service lives at api.wappkit.com.
                </h2>
                <p className="mt-1.5 max-w-3xl text-sm leading-6 text-muted-foreground">
                  This main domain hosts Wappkit tools and product pages. For
                  OpenAI-compatible API credits, model access, tokens, and usage
                  logs, go straight to the API platform.
                </p>
              </div>
            </div>
            <Link
              href="https://api.wappkit.com"
              target="_blank"
              rel="noreferrer"
              className="shrink-0"
            >
              <Button rounded="full" className="w-full gap-2 md:w-auto">
                Go to API platform
                <ExternalLink className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
