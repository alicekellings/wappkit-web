import Link from "next/link";
import { CreditCard, KeyRound, LifeBuoy } from "lucide-react";

import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";

export const metadata = constructMetadata({
  title: "License Center | Wappkit",
  description:
    "Understand how Wappkit licenses work, where to enter them, and how to retrieve a lost key without a user dashboard.",
});

export default function LicensePage() {
  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="License Center"
        title="Simple licensing without a separate customer dashboard."
        description="After checkout, the customer receives a license key and activates it inside the product. If the key is lost, Wappkit provides a direct retrieval path instead of forcing users through a separate account area."
        badges={[
          { label: "Checkout to activation", tone: "warm" },
          { label: "Single brand surface", tone: "muted" },
          { label: "Recovery built in" },
        ]}
        actions={
          <>
            <Link href="/license/retrieve">
              <Button rounded="full" size="lg">
                Retrieve a License
              </Button>
            </Link>
            <Link href="/docs/license-retrieval">
              <Button rounded="full" size="lg" variant="outline">
                Read the Guide
              </Button>
            </Link>
          </>
        }
        stats={[
          { label: "Purchase", value: "Creem checkout" },
          { label: "Unlock", value: "In-app activation" },
          { label: "Fallback", value: "Order + email recovery" },
        ]}
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <MarketingCard tone="warm" className="p-6">
          <CreditCard className="size-5 text-orange-700" />
          <h2 className="mt-4 font-heading text-xl text-foreground">
            1. Purchase
          </h2>
          <p className="mt-3 text-muted-foreground">
            Checkout runs through Creem and the order stays tied to the original
            purchase details.
          </p>
        </MarketingCard>
        <MarketingCard tone="soft" className="p-6">
          <KeyRound className="size-5 text-orange-700" />
          <h2 className="mt-4 font-heading text-xl text-foreground">
            2. Activate
          </h2>
          <p className="mt-3 text-muted-foreground">
            Enter the license directly inside the tool to unlock the paid
            version. No web login is required.
          </p>
        </MarketingCard>
        <MarketingCard tone="soft" className="p-6">
          <LifeBuoy className="size-5 text-orange-700" />
          <h2 className="mt-4 font-heading text-xl text-foreground">
            3. Retrieve
          </h2>
          <p className="mt-3 text-muted-foreground">
            Use the original order details and purchase email to recover a lost
            key or request a resend.
          </p>
        </MarketingCard>
      </div>
    </MarketingPageShell>
  );
}
