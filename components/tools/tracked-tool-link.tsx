"use client";

import Link from "next/link";

/**
 * An internal link that reports the click to Umami through data attributes.
 *
 * The attributes are deliberate: they fire even when the JS bundle fails to
 * load, and they are the only channel left now that the site runs on
 * Cloudflare Pages instead of Vercel (the old `track()` call went nowhere).
 *
 * Used by the image checkers to answer one question — does a failed background
 * check actually send anyone to the paid desktop app? Without this the funnel
 * is unmeasurable.
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
    >
      {children}
    </Link>
  );
}