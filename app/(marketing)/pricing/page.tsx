import Link from "next/link";
import { CreditCard, KeyRound, ShieldCheck } from "lucide-react";

import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";

export const metadata = constructMetadata({
  title: "Pricing | Wappkit",
  description:
    "Wappkit keeps pricing simple: each tool has its own product page, download path, and license-based checkout.",
});

export default function PricingPage() {
  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Pricing"
        title="Tool pricing belongs inside each product story, not inside a generic plan wall."
        description="Wappkit is a multi-tool surface, so pricing stays attached to the software that earns it. Each tool can have a free entry point, a paid unlock, and a retrieval path without pretending to be a seat-based SaaS dashboard."
        badges={[
          { label: "Per-tool offers", tone: "warm" },
          { label: "License key delivery", tone: "muted" },
          { label: "No forced account center" },
        ]}
        actions={
          <>
            <Link href="/tools">
              <Button rounded="full" size="lg">
                View Live Products
              </Button>
            </Link>
            <Link href="/license">
              <Button rounded="full" size="lg" variant="outline">
                See License Flow
              </Button>
            </Link>
          </>
        }
        stats={[
          { label: "Paid tools", value: "Per product" },
          { label: "Checkout path", value: "Creem" },
          { label: "Recovery path", value: "Order + email" },
        ]}
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <MarketingCard tone="warm" className="p-6">
          <CreditCard className="size-5 text-orange-700" />
          <h2 className="mt-4 font-heading text-xl text-foreground">
            Per-tool offers
          </h2>
          <p className="mt-3 text-muted-foreground">
            Screenshots, features, pricing, and checkout calls-to-action should
            live on the product page itself instead of being flattened into one
            global pricing table.
          </p>
        </MarketingCard>
        <MarketingCard tone="soft" className="p-6">
          <KeyRound className="size-5 text-orange-700" />
          <h2 className="mt-4 font-heading text-xl text-foreground">
            License activation
          </h2>
          <p className="mt-3 text-muted-foreground">
            Customers buy with Creem, receive a license key, and unlock the paid
            version inside the desktop app. No sign-in is required.
          </p>
        </MarketingCard>
        <MarketingCard tone="soft" className="p-6">
          <ShieldCheck className="size-5 text-orange-700" />
          <h2 className="mt-4 font-heading text-xl text-foreground">
            Recovery path
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lost keys are recovered with order details and purchase email, which
            keeps support clear without maintaining a bulky user portal.
          </p>
        </MarketingCard>
      </div>
    </MarketingPageShell>
  );
}
