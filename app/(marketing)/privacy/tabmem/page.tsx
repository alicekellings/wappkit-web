import Link from "next/link";

import {
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "TabMem Privacy Policy | Wappkit",
  description:
    "How the TabMem browser extension handles tab activity, settings, license activation, and device identifiers.",
});

const sections = [
  {
    title: "What the extension reads",
    body: [
      "TabMem needs to know which tabs are open and when each one was last used, so it can decide which inactive tabs to put to sleep. That information is read from the browser's own tab and session APIs.",
      "TabMem does not read the content of the pages you visit. It does not see form fields, text, images, or anything inside a page, and it does not record your browsing history.",
    ],
  },
  {
    title: "What is stored on your device",
    body: [
      "Your settings are kept in browser extension storage: the whitelist of sites that should never sleep, your sleep timeout, the auto-cleanup interval, the number of tabs saved, and statistics such as how many tabs have been slept.",
      "An optional Pro license key and a randomly generated device identifier are stored the same way. You can remove all of it by clearing the extension's storage or uninstalling the extension.",
    ],
  },
  {
    title: "License activation",
    body: [
      "If you buy Pro and activate a license, the extension sends the license key, a random device identifier generated on first use, and the fixed device name \"TabMem extension\" to https://license.wappkit.com/. Wappkit uses that request to confirm the key is valid and to bind it to this browser profile.",
      "The request does not include the addresses of the sites you visit, your tab list, or any page content. Wappkit's server may log standard request data such as IP address and timestamp for security and rate limiting.",
    ],
  },
  {
    title: "What the extension does not do",
    body: [
      "It does not collect analytics, does not show advertising, does not sell data, and does not send your browsing activity anywhere.",
      "It does not modify pages, inject visible content into websites, or run scripts on sites you have not opened.",
      "It does not require an account. The free tier works entirely offline.",
    ],
  },
  {
    title: "Contact",
    body: ["Questions about this policy can go to support@wappkit.com."],
  },
];

export default function TabMemPrivacyPage() {
  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Privacy policy"
        title="TabMem privacy policy"
        description="A short, plain-language description of what the TabMem extension can see, stores, and sends. Last updated November 26, 2026."
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
        Read about the extension at{" "}
        <Link
          href="/tools/tabmem"
          className="text-orange-700 underline underline-offset-4"
        >
          /tools/tabmem
        </Link>
        .
      </p>
    </MarketingPageShell>
  );
}