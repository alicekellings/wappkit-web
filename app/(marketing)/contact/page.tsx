import { constructMetadata } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";

export const metadata = constructMetadata({
  title: "Contact | Wappkit",
  description:
    "Get in touch with Wappkit for licensing, product, or support questions.",
});

export default function ContactPage() {
  return (
    <MarketingPageShell containerClassName="max-w-5xl py-16 md:py-20">
      <MarketingHero
        eyebrow="Contact"
        title="Need help with a tool, payment, or activation?"
        description="Wappkit is intentionally lightweight. Instead of pushing support into a ticket portal, we keep the docs, recovery path, and contact route close to the product pages."
        badges={[
          { label: "Product questions", tone: "warm" },
          { label: "License help", tone: "muted" },
          { label: "Launch feedback" },
        ]}
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
              Include the tool name, your order ID when relevant, and a short
              description of the issue so we can help faster.
            </p>
          </MarketingCard>
        }
      />
    </MarketingPageShell>
  );
}
