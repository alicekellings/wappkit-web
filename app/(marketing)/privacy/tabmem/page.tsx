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
      "TabMem uses the browser's tabs API to see open tab titles, addresses and state. It tracks when open tabs are used so it can decide which inactive tabs to put to sleep. It does not read page content, form fields or the browser's history database.",
    ],
  },
  {
    title: "What stays on your device",
    body: [
      "Tab activity timestamps, settings, the allowlist and cleanup statistics are kept in local browser extension storage. The Pro smart allowlist uses local counts of domain usage to decide which sites to protect. TabMem does not send these activity records to Wappkit or Creem.",
      "The optional Pro license key and its activation identifiers are also stored locally for the extension to use. To remove the local data, clear the extension's storage or uninstall TabMem.",
    ],
  },
  {
    title: "Optional Pro checkout and license checks",
    body: [
      "Creem hosts the optional checkout. The extension does not receive your payment card details. If you activate Pro, TabMem sends the key, a randomly generated installation identifier and, when available, an existing Creem activation identifier to license.wappkit.com. TabMem may recheck the key later to keep Pro active.",
      "Wappkit uses Creem to activate or validate the key. The license service may process standard connection data such as your IP address and the time of the request to operate the service and protect it from abuse. No tab addresses, contents or browsing activity are included in the license request.",
    ],
  },
  {
    title: "What differs by version",
    body: [
      "Edge versions 1.1.1 and 1.1.2 do not send upgrade analytics. Chrome 1.1.3 sends the TabMem product name and an event name to Wappkit when the upgrade prompt is shown or the checkout link is clicked. These event payloads do not include a license key, installation identifier, tab title, page URL or page content.",
      "Edge 1.1.1 requests site icons from Google when you open the tab list. Those icon requests can include open-tab domain names, not full addresses. Edge 1.1.2 and Chrome 1.1.3 use local placeholders instead.",
      "No separate Wappkit account is required. Tab management is performed on your device. We do not use your tab data for advertising or sell it.",
    ],
  },
  {
    title: "Questions and deletion requests",
    body: ["For questions about this policy or deletion of your license information, email support@wappkit.com."],
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