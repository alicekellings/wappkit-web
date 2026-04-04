import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const metadata = constructMetadata({
  title: "License Center | Wappkit",
  description:
    "Understand how Wappkit licenses work, where to enter them, and how to retrieve a lost key without a user dashboard.",
});

export default function LicensePage() {
  return (
    <div className="container max-w-5xl py-16 md:py-20">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          License Center
        </p>
        <h1 className="font-heading text-4xl text-foreground md:text-5xl">
          Simple licensing without a customer dashboard.
        </h1>
        <p className="text-lg text-muted-foreground">
          Wappkit tools use a lightweight license flow. After checkout, the
          customer receives a license and activates it inside the product. If
          the key is lost, the website provides a retrieval path instead of a
          dedicated account center.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="font-heading text-xl text-foreground">1. Purchase</h2>
          <p className="mt-3 text-muted-foreground">
            Checkout runs through Creem. The purchase record stays tied to the
            original order details.
          </p>
        </div>
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="font-heading text-xl text-foreground">2. Activate</h2>
          <p className="mt-3 text-muted-foreground">
            Enter the license directly inside the tool to unlock the paid
            version. No web login required.
          </p>
        </div>
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="font-heading text-xl text-foreground">3. Retrieve</h2>
          <p className="mt-3 text-muted-foreground">
            Use order details and purchase email to recover a lost key or
            request a resend.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/license/retrieve">
          <Button rounded="full">Retrieve a License</Button>
        </Link>
        <Link href="/docs/license-retrieval">
          <Button rounded="full" variant="outline">
            Read the Guide
          </Button>
        </Link>
      </div>
    </div>
  );
}
