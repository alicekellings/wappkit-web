declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: Record<string, string>) => void;
    };
  }
}

/**
 * Send one analytics event to Umami.
 *
 * This used to fan out to both Vercel Analytics and Umami. Since the site moved
 * to Cloudflare Pages the Vercel channel receives nothing (its ingest script
 * 404s), so the call was reduced to the one dashboard that actually records
 * data. Callers keep using this helper so there is a single place to change if
 * the provider changes again.
 *
 * Never let analytics break the tool it is measuring: a blocked or half-loaded
 * script must not throw into a click handler.
 */
export function trackEvent(event: string, data?: Record<string, string>) {
  try {
    window.umami?.track(event, data);
  } catch {
    // A blocked or half-loaded analytics script is not a reason to fail an audit.
  }
}