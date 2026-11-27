"use client";

import Script from "next/script";

const umamiWebsiteId =
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ??
  "0faee38f-350a-479a-b5a3-e442914b17c5";
const umamiScriptUrl =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js";

/**
 * Page-view analytics, Umami only.
 *
 * `<VercelAnalytics />` was removed when the site moved to Cloudflare Pages:
 * it kept requesting /_vercel/insights/script.js, which now 404s on every
 * page load, and sent no data anywhere.
 *
 * Cloudflare Web Analytics is deliberately NOT used here. It records page
 * views and Web Vitals but has no custom-event API, so the funnel events this
 * site depends on (checkout_clicked, checkout_redirected, purchase_completed,
 * image_audit_completed, download_clicked) would disappear with it.
 */
export function Analytics() {
  if (!umamiWebsiteId) {
    return null;
  }

  return (
    <Script
      id="umami-analytics"
      src={umamiScriptUrl}
      data-website-id={umamiWebsiteId}
      data-domains="wappkit.com,www.wappkit.com"
      strategy="afterInteractive"
    />
  );
}