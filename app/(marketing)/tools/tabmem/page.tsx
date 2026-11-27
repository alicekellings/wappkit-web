import Link from "next/link";
import { Check, LockKeyhole, Moon, Timer } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";
import { constructMetadata } from "@/lib/utils";
import { TABMEM } from "@/lib/store-links";

const STORE_URL = TABMEM.edge;

const PRO_CHECKOUT_ENABLED = true;
const CHECKOUT_URL = "https://www.creem.io/payment/prod_5sNXXcNOuCqa0joIyeBz8Y";

export const metadata = constructMetadata({
  title: "TabMem - Smart Tab Memory Manager for Edge | Wappkit",
  description:
    "TabMem puts inactive tabs to sleep so your browser stops eating RAM. Built-in whitelist for mail, chat and docs, custom sleep timers, and a one-time Pro unlock. Free to install.",
});

const freeFeatures = [
  "Automatically check every 30 minutes for tabs idle for at least 30 minutes",
  "15 common sites protected by default (Gmail, Slack, GitHub, YouTube and more)",
  "Up to 10 custom whitelist domains",
  "Manually put an eligible background tab to sleep",
  "No separate account required",
];

const proFeatures = [
  "Auto-cleanup every 2 minutes instead of 30",
  "Custom sleep timers from 5 minutes to 4 hours",
  "Unlimited custom whitelist domains",
  "Smart auto-whitelist that learns the sites you keep",
  "One-time license, no subscription",
];

const faqs = [
  {
    q: "Does TabMem read the pages I visit?",
    a: "No. It uses the browser's tabs API to see which tabs are open and records recent tab activity on your device. It never reads page content or form fields.",
  },
  {
    q: "What happens to a sleeping tab?",
    a: "The tab stays in your tab bar. Selecting it reloads the page; unsaved page state may not be restored.",
  },
  {
    q: "Will it put my email or chat to sleep?",
    a: "Not by default. 15 common work sites are protected out of the box, and you can add your own domains to the whitelist.",
  },
  {
    q: "Do I need an account?",
    a: "No. The free tier works entirely offline. A license key is only needed if you choose to unlock Pro.",
  },
];

export default function TabMemPage() {
  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Browser extension · Microsoft Edge"
        title="Stop your browser from eating all the RAM."
        description="TabMem puts eligible inactive tabs to sleep to help free memory. Active, pinned and audible tabs stay awake, as do sites on your allowlist. Free to install; Pro is a one-time $6."
        badges={[
          { label: "Free to install", tone: "warm" },
          { label: "15 sites protected", tone: "muted" },
          { label: "$6 one-time Pro" },
        ]}
      >
        <div className="flex flex-wrap gap-3">
          <Link href={STORE_URL} target="_blank" rel="noopener">
            <Button rounded="full" size="lg">
              Get TabMem for Edge
            </Button>
          </Link>
          {PRO_CHECKOUT_ENABLED ? (
            <a href={CHECKOUT_URL} target="_blank" rel="noopener">
              <Button rounded="full" size="lg" variant="outline">
                Get Pro — $6
              </Button>
            </a>
          ) : null}
        </div>
      </MarketingHero>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Moon,
            title: "Sleeps the tabs you forgot",
            body: "Inactive tabs are suspended automatically. The tab stays in place; its memory does not.",
          },
          {
            icon: LockKeyhole,
            title: "Never touches the important ones",
            body: "15 domains, including Gmail, Slack and GitHub, are protected by default. Add the sites you want to keep awake.",
          },
          {
            icon: Timer,
            title: "You set the pace",
            body: "Choose how long a tab must sit idle before it sleeps, from 5 minutes to 4 hours on Pro.",
          },
        ].map((item) => (
          <MarketingCard key={item.title} tone="soft" className="p-6">
            <item.icon className="h-6 w-6 text-orange-700" aria-hidden="true" />
            <h2 className="mt-4 font-heading text-xl text-foreground">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              {item.body}
            </p>
          </MarketingCard>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <MarketingCard tone="soft" className="p-6">
          <h2 className="font-heading text-2xl text-foreground">Free</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything you need for a normal day of browsing.
          </p>
          <ul className="mt-4 space-y-2">
            {freeFeatures.map((f) => (
              <li key={f} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                <Check className="mt-1 h-4 w-4 flex-none text-green-600" aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </MarketingCard>

        <MarketingCard tone="warm" className="p-6">
          <h2 className="font-heading text-2xl text-foreground">
            Pro — $6 one-time
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            For people who keep 50+ tabs open on purpose.
          </p>
          <ul className="mt-4 space-y-2">
            {proFeatures.map((f) => (
              <li key={f} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                <Check className="mt-1 h-4 w-4 flex-none text-orange-700" aria-hidden="true" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </MarketingCard>
      </div>

      <MarketingCard tone="soft" className="mt-6 p-6 md:p-8">
        <h2 className="font-heading text-2xl text-foreground">Questions</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {faqs.map((item) => (
            <div key={item.q}>
              <h3 className="font-semibold text-foreground">{item.q}</h3>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </MarketingCard>

      <p className="mt-8 text-sm text-muted-foreground">
        Read the{" "}
        <Link
          href="/privacy/tabmem"
          className="text-orange-700 underline underline-offset-4"
        >
          TabMem privacy policy
        </Link>
        , or see other{" "}
        <Link href="/tools" className="text-orange-700 underline underline-offset-4">
          Wappkit tools
        </Link>
        .
      </p>
    </MarketingPageShell>
  );
}