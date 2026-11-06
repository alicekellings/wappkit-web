import Link from "next/link";

import {
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";
import { constructMetadata } from "@/lib/utils";

export const metadata = constructMetadata({
  title: "Reddit Reader Privacy Policy | Wappkit",
  description:
    "How the Reddit Reader browser extension handles page content, settings, license activation, and device identifiers.",
});

const sections = [
  {
    title: "What the extension reads",
    body: [
      "When you click the toolbar icon on a reddit.com page, the extension reads the page you are already viewing so it can hide sidebars and login prompts, highlight your keywords, and build a Markdown export.",
      "That page content is processed locally in your browser. The extension does not upload Reddit posts, comments, usernames, or your browsing history to Wappkit or anyone else.",
    ],
  },
  {
    title: "What is stored on your device",
    body: [
      "The extension stores your settings in browser extension storage: whether clean reader mode is on, your keyword list, the number of free exports used, an optional license key, and a random device identifier generated on first use.",
      "You can remove this data at any time by clearing the extension's storage or uninstalling the extension.",
    ],
  },
  {
    title: "License activation",
    body: [
      "If you buy Pro and activate a license, the extension sends the license key, the random device identifier, and the fixed device name \"Reddit Reader extension\" to https://www.wappkit.com/api/license/validate. Wappkit uses that request to confirm the key is valid and to bind it to this browser profile.",
      "The request does not include the URL of the Reddit page you are reading or any page content. Wappkit's web server may log standard request data such as IP address and timestamp for security and rate limiting.",
    ],
  },
  {
    title: "What the extension does not do",
    body: [
      "The extension does not require or accept your Reddit username or password. It does not log you in, vote, post, comment, or bypass Reddit's account system.",
      "It does not include advertising, third-party analytics, affiliate trackers, or code that sells your data. It does not run on websites other than reddit.com, and it only reads a page after you click the toolbar icon or press the keyboard shortcut.",
    ],
  },
  {
    title: "Permissions",
    body: [
      "activeTab and scripting let the extension read the Reddit tab you explicitly activate. storage keeps your settings and license state on your device. The only host permission is https://www.wappkit.com/*, used solely for license validation.",
    ],
  },
  {
    title: "Changes and contact",
    body: [
      "If this policy changes, the updated version will be published on this page with a new date. Questions about privacy or data handling can be sent to support@wappkit.com.",
    ],
  },
];

export default function RedditReaderPrivacyPage() {
  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Privacy policy"
        title="Reddit Reader privacy policy"
        description="A short, plain-language description of what the Reddit Reader extension reads, stores, and sends. Last updated November 5, 2026."
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
        Read the product page at{" "}
        <Link
          href="/tools/reddit-viewer-extension"
          className="text-orange-700 underline underline-offset-4"
        >
          /tools/reddit-viewer-extension
        </Link>
        .
      </p>
    </MarketingPageShell>
  );
}
