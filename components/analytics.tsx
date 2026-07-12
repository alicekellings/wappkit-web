"use client";

import Script from "next/script";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

const umamiWebsiteId =
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ??
  "0faee38f-350a-479a-b5a3-e442914b17c5";
const umamiScriptUrl =
  process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL ?? "https://cloud.umami.is/script.js";

export function Analytics() {
  return (
    <>
      <VercelAnalytics />
      {umamiWebsiteId ? (
        <Script
          id="umami-analytics"
          src={umamiScriptUrl}
          data-website-id={umamiWebsiteId}
          data-domains="wappkit.com,www.wappkit.com"
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}
