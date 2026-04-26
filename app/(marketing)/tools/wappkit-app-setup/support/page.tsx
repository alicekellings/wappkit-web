import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  MarketingCard,
  MarketingCtaBand,
  MarketingHero,
  MarketingPageShell,
  MarketingSectionIntro,
} from "@/components/marketing/page-shell";

export const metadata = constructMetadata({
  title: "Wappkit App Setup Support | Wappkit",
  description:
    "Support, activation help, and recovery links for Wappkit App Setup.",
});

const freeFeatures = [
  "Starter packs for common Windows setup flows",
  "Supported app search and queue building",
  "Install queue execution",
  "Direct WinGet download help",
  "Inline WinGet install or repair help",
];

const premiumFeatures = [
  "Save profile",
  "Load profile",
  "Copy commands",
  "Run diagnostics",
  "Open diagnostics folder",
  "Copy fix commands",
  "Reset WinGet sources",
  "Upgrade installed apps via WinGet",
];

const commonTopics = [
  "Install apps from a starter pack",
  "Compare which apps are already installed on this PC",
  "Search and add supported apps",
  "Install or repair WinGet",
  "Activate a Premium license",
  "Retrieve an existing license",
  "Move a license to a new device",
];

export default function WappkitAppSetupSupportPage() {
  return (
    <MarketingPageShell containerClassName="max-w-6xl py-16 md:py-20">
      <MarketingHero
        eyebrow="App Setup Support"
        title="Support paths for setup, activation, and license recovery."
        description="Wappkit App Setup is designed to stay lightweight. The free version handles core PC setup workflows, while Premium unlocks diagnostics and repeatable admin-style shortcuts."
        badges={[
          { label: "Free core workflow", tone: "warm" },
          { label: "License retrieval", tone: "muted" },
          { label: "Desktop activation" },
        ]}
        actions={
          <>
            <Link href="/tools/wappkit-app-setup">
              <Button rounded="full" size="lg">
                Open Product Page
              </Button>
            </Link>
            <Link href="/license/retrieve">
              <Button rounded="full" size="lg" variant="outline">
                Retrieve License
              </Button>
            </Link>
            <Link href="/docs/checkout-and-activation">
              <Button rounded="full" size="lg" variant="ghost">
                Activation Guide
              </Button>
            </Link>
          </>
        }
        rightContent={
          <MarketingCard tone="dark">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Support email
            </p>
            <a
              href={`mailto:${siteConfig.mailSupport}`}
              className="mt-4 block font-heading text-3xl text-white"
            >
              {siteConfig.mailSupport}
            </a>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Include the tool name, your Windows version, and your order ID if
              the issue is related to Premium activation or billing.
            </p>
          </MarketingCard>
        }
      />

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <MarketingCard tone="warm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
            Free version
          </p>
          <h2 className="mt-3 font-heading text-3xl text-foreground">
            Core setup stays usable without activation.
          </h2>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-foreground">
            {freeFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </MarketingCard>

        <MarketingCard tone="dark">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-200">
            Premium
          </p>
          <h2 className="mt-3 font-heading text-3xl text-white">
            Advanced maintenance and repeatable workflow tools.
          </h2>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-200">
            {premiumFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </MarketingCard>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <MarketingCard tone="soft">
          <MarketingSectionIntro
            eyebrow="Common help topics"
            title="What users usually need help with"
            description="Most support requests for this product should fit one of these paths before they need a direct email."
          />
          <ul className="mt-6 space-y-3 text-sm leading-6 text-foreground">
            {commonTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </MarketingCard>

        <MarketingCard>
          <MarketingSectionIntro
            eyebrow="Support flow"
            title="Fastest route before contacting support"
            description="These pages should solve most recovery and activation issues without a manual ticket."
          />
          <div className="mt-6 space-y-3">
            <Link href="/license/retrieve" className="block">
              <div className="rounded-2xl border bg-background p-4 text-sm font-medium text-foreground transition hover:border-orange-300">
                Open the license retrieval page
              </div>
            </Link>
            <Link href="/docs/checkout-and-activation" className="block">
              <div className="rounded-2xl border bg-background p-4 text-sm font-medium text-foreground transition hover:border-orange-300">
                Read checkout and activation docs
              </div>
            </Link>
            <Link href="/privacy" className="block">
              <div className="rounded-2xl border bg-background p-4 text-sm font-medium text-foreground transition hover:border-orange-300">
                Review the privacy policy
              </div>
            </Link>
          </div>
        </MarketingCard>
      </section>

      <MarketingCtaBand
        className="mt-10"
        eyebrow="Need direct help"
        title="Use email support when recovery and docs are not enough."
        description="For activation issues, include the product name, the problem you hit, and the original order ID when available."
      >
        <MarketingCard className="bg-white/85 p-6">
          <a
            href={`mailto:${siteConfig.mailSupport}`}
            className="text-lg font-semibold text-foreground"
          >
            {siteConfig.mailSupport}
          </a>
        </MarketingCard>
      </MarketingCtaBand>
    </MarketingPageShell>
  );
}
