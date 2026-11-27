"use client";

import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

/**
 * A download button that reports one `download_clicked` event carrying both the
 * tool and the campaign source.
 *
 * It used to fire twice — once to Vercel via `track()`, once to Umami via
 * data attributes. The Vercel channel is dead since the move to Cloudflare
 * Pages, and the declarative attributes cannot carry a runtime-computed
 * campaign source, so the handler now sends the whole thing once through
 * trackEvent(). Keep it single: a second send would double every click.
 */
type TrackedDownloadLinkProps = {
  href: string;
  toolSlug: string;
  children: React.ReactNode;
  className?: string;
  rounded?: ButtonProps["rounded"];
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
};

function getCampaignSource() {
  return new URLSearchParams(window.location.search).get("utm_source") ?? "direct";
}

export function TrackedDownloadLink({
  href,
  toolSlug,
  children,
  className,
  rounded = "full",
  size = "default",
  variant = "default",
}: TrackedDownloadLinkProps) {
  return (
    <a
      href={href}
      className={cn(buttonVariants({ className, rounded, size, variant }))}
      onClick={() => {
        trackEvent("download_clicked", {
          tool: toolSlug,
          campaign_source: getCampaignSource(),
        });
      }}
    >
      {children}
    </a>
  );
}