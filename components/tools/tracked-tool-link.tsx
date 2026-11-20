"use client";

import Link from "next/link";
import { track } from "@vercel/analytics/react";

/**
 * An internal link that reports the click twice: once to Vercel Analytics via `track()`,
 * once to Umami via data attributes (which work even if the JS bundle is blocked).
 *
 * Used by the image checkers to answer one question — does a failed background check
 * actually send anyone to the paid desktop app? Without this the funnel is unmeasurable.
 */
type TrackedToolLinkProps = {
  href: string;
  event: string;
  data?: Record<string, string>;
  className?: string;
  children: React.ReactNode;
};

export function TrackedToolLink({
  href,
  event,
  data,
  className,
  children,
}: TrackedToolLinkProps) {
  const umamiAttributes: Record<string, string> = {};
  for (const [key, value] of Object.entries(data ?? {})) {
    umamiAttributes[`data-umami-event-${key}`] = value;
  }

  return (
    <Link
      href={href}
      className={className}
      data-umami-event={event}
      {...umamiAttributes}
      onClick={() => track(event, data)}
    >
      {children}
    </Link>
  );
}
