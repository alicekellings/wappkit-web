import { track as vercelTrack } from "@vercel/analytics/react";

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string>) => void;
    };
  }
}

/**
 * One call, both dashboards.
 *
 * `track()` alone only reaches Vercel Analytics, so anyone reading the Umami dashboard
 * would see CTA clicks but none of the events that explain them. This sends the same
 * event to both, and never lets analytics break the tool it is measuring.
 *
 * Link clicks are the exception: those are captured declaratively with
 * `data-umami-event` attributes in TrackedToolLink, so they must NOT be sent twice.
 */
export function trackEvent(event: string, data?: Record<string, string>) {
  vercelTrack(event, data);

  try {
    window.umami?.track(event, data);
  } catch {
    // A blocked or half-loaded analytics script is not a reason to fail an audit.
  }
}
