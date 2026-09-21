import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { studioConfig } from "@/config/studio";
import { cn } from "@/lib/utils";

export function StudioHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="container flex h-16 max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="font-heading text-lg text-foreground">
            {studioConfig.brand}
          </span>
          <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
            Studio
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a className="hover:text-foreground" href="/#services">
            Services
          </a>
          <a className="hover:text-foreground" href="/#process">
            How it works
          </a>
          <a className="hover:text-foreground" href="/#contact">
            Contact
          </a>
        </nav>

        <a
          href="/#contact"
          className={cn(buttonVariants({ rounded: "full", size: "sm" }), "px-4")}
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}

export function StudioFooter() {
  return (
    <footer className="border-t border-border/70 bg-background/60">
      <div className="container flex max-w-6xl flex-col gap-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          {studioConfig.name} — custom automation work by the team behind{" "}
          {studioConfig.brand}.
        </p>
        <div className="flex flex-wrap items-center gap-5">
          <a className="hover:text-foreground" href={`mailto:${siteConfig.mailSupport}`}>
            {siteConfig.mailSupport}
          </a>
          <a className="hover:text-foreground" href={`${siteConfig.url}/pricing`}>
            Wappkit products
          </a>
        </div>
      </div>
    </footer>
  );
}
