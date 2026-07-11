import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LicenseRetrievalForm } from "@/components/forms/license-retrieval-form";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";

export const metadata = constructMetadata({
  title: "Retrieve a License | Wappkit",
  description:
    "Recover a Wappkit license or move its one-device activation using order details and the purchase email.",
});

export default function LicenseRetrievePage() {
  return (
    <MarketingPageShell containerClassName="max-w-5xl py-16 md:py-20">
      <MarketingHero
        eyebrow="License Retrieval"
        title="Find your license with the same details used during checkout."
        description="Enter the original order ID and purchase email to retrieve a key or move its one-device activation. Each license can be moved once every 30 days."
        badges={[
          { label: "Order ID", tone: "warm" },
          { label: "Purchase email", tone: "muted" },
          { label: "One-device move every 30 days" },
        ]}
        rightContent={
          <MarketingCard tone="dark">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Need context first?
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              If you are not sure where the order ID came from or how activation
              works, the docs explain the full checkout and activation loop.
            </p>
            <div className="mt-5">
              <Link href="/docs/checkout-and-activation">
                <Button
                  rounded="full"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  Open Activation Guide
                </Button>
              </Link>
            </div>
          </MarketingCard>
        }
      />

      <div className="mt-10">
        <MarketingCard tone="soft" className="p-8 md:p-10">
          <LicenseRetrievalForm />
        </MarketingCard>
      </div>
    </MarketingPageShell>
  );
}
