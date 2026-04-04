import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const metadata = constructMetadata({
  title: "Pricing | Wappkit",
  description:
    "Wappkit keeps pricing simple: each tool has its own product page, download path, and license-based checkout.",
});

export default function PricingPage() {
  return (
    <div className="container max-w-5xl py-16 md:py-20">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Pricing
        </p>
        <h1 className="font-heading text-4xl text-foreground md:text-5xl">
          Tool pricing belongs on each product page.
        </h1>
        <p className="text-lg text-muted-foreground">
          Wappkit is a multi-tool platform, not a subscription dashboard. Each
          tool can have its own free version, paid license, and checkout flow
          while the platform stays easy to manage and easy to understand.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="font-heading text-xl text-foreground">
            Per-tool offers
          </h2>
          <p className="mt-3 text-muted-foreground">
            Screenshots, features, pricing, and checkout calls-to-action should
            live on each tool page instead of in a single SaaS-style plan grid.
          </p>
        </div>
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="font-heading text-xl text-foreground">
            License activation
          </h2>
          <p className="mt-3 text-muted-foreground">
            Customers buy with Creem, receive a license, and unlock the paid
            version inside the app. No sign-in is required.
          </p>
        </div>
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="font-heading text-xl text-foreground">
            Recovery path
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lost licenses are recovered with order ID and purchase email, not a
            web account center.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/tools">
          <Button rounded="full">Browse Tools</Button>
        </Link>
        <Link href="/license">
          <Button rounded="full" variant="outline">
            See License Flow
          </Button>
        </Link>
      </div>
    </div>
  );
}
