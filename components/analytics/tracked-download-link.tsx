"use client";

import { track } from "@vercel/analytics/react";

import { buttonVariants, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      data-umami-event="download_clicked"
      data-umami-event-tool={toolSlug}
      onClick={() => {
        track("download_clicked", {
          tool: toolSlug,
          campaign_source: getCampaignSource(),
        });
      }}
    >
      {children}
    </a>
  );
}
