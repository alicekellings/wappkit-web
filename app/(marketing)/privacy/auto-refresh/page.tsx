import Link from "next/link";

import {
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Auto Refresh Privacy Policy | Wappkit",
  description:
    "How the Auto Refresh browser extension handles site permissions, page change checks, settings, license activation, and device identifiers.",
});

const sections = [
  {
    title: "Which sites the extension can see",
    body: [
      "The extension has no access to any website when you install it. It declares no content scripts and no default host permissions for web pages.",
      "A site becomes available to the extension only when you switch it on in the popup. At that moment the browser asks you to allow that one site, and the refresh script is registered for that origin only. Turning the site off, or removing it from the options page, releases the permission again.",
    ],
  },
  {
    title: "What the refresh script does",
    body: [
      "On an enabled site the script runs a timer and calls location.reload() when the interval is reached. That is its whole job.",
      "If you turn on conditional refresh, the script also fetches the same page address from your browser and compares a fingerprint of the response with the previous one. The comparison happens on your device; the fetched copy never leaves it.",
      "The script stores your scroll position for the current tab in the browser's session storage so it can return you to the same place after a reload.",
    ],
  },
  {
    title: "What is stored on your device",
    body: [
      "Your per-site rules are kept in browser extension storage: which sites are on, the interval for each one, and the conditional, timing and scroll options you picked.",
      "Clearing the extension's storage or uninstalling the extension removes all of it.",
    ],
  },
  {
    title: "License activation",
    body: [
      "If you buy Pro and activate a license, the extension sends the license key, a random device identifier generated on first use, and the fixed device name \"Auto Refresh extension\" to https://www.wappkit.com/api/license/validate. Wappkit uses that request to confirm the key is valid and to bind it to this browser profile.",
      "The request does not include the addresses of the sites you enabled and does not include page content. Wappkit's web server may log standard request data such as IP address and timestamp for security and rate limiting.",
    ],
  },
  {
    title: "What the extension does not do",
    body: [
      "It does not collect analytics, does not show advertising, does not sell data, and does not send page content anywhere.",
      "It does not click, type, submit forms, or interact with page content. It reloads the page and restores your scroll position.",
      "It does not bypass logins or access content you are not already able to view.",
    ],
  },
  {
    title: "Contact",
    body: [
      "Questions about this policy can go to support@wappkit.com.",
    ],
  },
];

export default function AutoRefreshPrivacyPage() {
  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Privacy policy"
        title="Auto Refresh privacy policy"
        description="A short, plain-language description of what the Auto Refresh extension can see, stores, and sends. Last updated November 23, 2026."
      />

      <div className="mt-8 grid gap-4">
        {sections.map((section) => (
          <section
            key={section.title}
            className="rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm md:p-8"
          >
            <h2 className="font-heading text-2xl text-foreground">
              {section.title}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground md:text-base">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        See also the Reddit Reader policy at{" "}
        <Link
          href="/privacy/reddit-reader"
          className="text-orange-700 underline underline-offset-4"
        >
          /privacy/reddit-reader
        </Link>
        .
      </p>
    </MarketingPageShell>
  );
}