import Link from "next/link";

import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MarketingCard,
  MarketingCtaBand,
  MarketingHero,
  MarketingPageShell,
  MarketingSectionIntro,
} from "@/components/marketing/page-shell";

export const metadata = constructMetadata({
  title: "AI E-commerce Visual Studio Support | Wappkit",
  description:
    "Download, activation, export, and quality help for AI E-commerce Visual Studio.",
});

const freeFeatures = [
  "Single-image background removal and preview",
  "Transparent PNG output and current-size result saving",
  "Optional EXIF / metadata cleanup when saving",
  "A local temporary workspace before final export",
];

const proFeatures = [
  "Batch background removal and background replacement",
  "Background position and scale controls",
  "Marketplace and social export presets",
  "Image enhancement and Smart Product Optimize",
];

const commonTopics = [
  "Download and install the Windows application",
  "Run a free single-image background removal test",
  "Export a product image at its original size",
  "Choose a background and adjust the product position",
  "Activate, retrieve, or move a Pro license",
  "Review an exported image before publishing a listing",
];

export default function AiEcomVisualStudioSupportPage() {
  return (
    <MarketingPageShell containerClassName="max-w-6xl py-16 md:py-20">
      <MarketingHero
        eyebrow="Image Studio Support"
        title="Help for downloads, product-image workflows, and Pro activation."
        description="AI E-commerce Visual Studio is built for Windows sellers and catalog teams. Start with the free cleanup workflow, then use the support paths here for export, activation, or license recovery questions."
        badges={[
          { label: "Windows desktop app", tone: "warm" },
          { label: "Free workflow included", tone: "muted" },
          { label: "License recovery available" },
        ]}
        actions={
          <>
            <Link href="/tools/ai-ecom-visual-studio">
              <Button rounded="full" size="lg">
                Open Product Page
              </Button>
            </Link>
            <Link href="/api/desktop/ai-ecom-visual-studio/download">
              <Button rounded="full" size="lg" variant="outline">
                Download Windows App
              </Button>
            </Link>
            <Link href="/license/retrieve">
              <Button rounded="full" size="lg" variant="ghost">
                Retrieve License
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
              className="mt-4 block break-all font-heading text-3xl text-white"
            >
              {siteConfig.mailSupport}
            </a>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Include the app version, Windows version, a screenshot of the
              issue, and your order ID when the question is about Pro.
            </p>
          </MarketingCard>
        }
      />

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <MarketingCard tone="warm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
            Free workflow
          </p>
          <h2 className="mt-3 font-heading text-3xl text-foreground">
            Test cleanup quality on a real product image first.
          </h2>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-foreground">
            {freeFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </MarketingCard>

        <MarketingCard tone="dark">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-200">
            Pro workflow
          </p>
          <h2 className="mt-3 font-heading text-3xl text-white">
            Move faster when a catalog needs repeatable output.
          </h2>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-slate-200">
            {proFeatures.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </MarketingCard>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <MarketingCard tone="soft">
          <MarketingSectionIntro
            eyebrow="Common help"
            title="The usual questions before a listing goes live"
            description="These steps cover the normal path from a raw product image to a saved export."
          />
          <ul className="mt-6 space-y-3 text-sm leading-6 text-foreground">
            {commonTopics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </MarketingCard>

        <MarketingCard>
          <MarketingSectionIntro
            eyebrow="Quality and privacy"
            title="Keep the final review with the seller."
            description="The app processes the core image workflow locally. Marketplace output presets are starting points, so inspect edge quality, background, crop, and the destination platform's current rules before publishing."
          />
          <div className="mt-6 space-y-3">
            <Link href="/privacy" className="block">
              <div className="rounded-2xl border bg-background p-4 text-sm font-medium text-foreground transition hover:border-orange-300">
                Read the privacy policy
              </div>
            </Link>
            <Link href="/docs/checkout-and-activation" className="block">
              <div className="rounded-2xl border bg-background p-4 text-sm font-medium text-foreground transition hover:border-orange-300">
                Read activation guidance
              </div>
            </Link>
            <Link href="/license/retrieve" className="block">
              <div className="rounded-2xl border bg-background p-4 text-sm font-medium text-foreground transition hover:border-orange-300">
                Retrieve a license key
              </div>
            </Link>
          </div>
        </MarketingCard>
      </section>

      <MarketingCtaBand
        className="mt-10"
        eyebrow="Need direct help"
        title="Use email when the in-app workflow or recovery page does not solve it."
        description="For license questions, do not send a license key by email. Send the product name, order ID, and a short description of the issue instead."
      >
        <MarketingCard className="bg-white/85 p-6">
          <a
            href={`mailto:${siteConfig.mailSupport}`}
            className="break-all text-lg font-semibold text-foreground"
          >
            {siteConfig.mailSupport}
          </a>
        </MarketingCard>
      </MarketingCtaBand>
    </MarketingPageShell>
  );
}
