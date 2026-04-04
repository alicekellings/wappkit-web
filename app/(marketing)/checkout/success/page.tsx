import Link from "next/link";

import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const metadata = constructMetadata({
  title: "Checkout Success | Wappkit",
  description:
    "Payment completed. Your Wappkit purchase is being processed and the license can be retrieved from the site if needed.",
  noIndex: true,
});

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const toolSlug =
    typeof searchParams.tool === "string" ? searchParams.tool : undefined;
  const orderId =
    typeof searchParams.order_id === "string" ? searchParams.order_id : undefined;
  const checkoutId =
    typeof searchParams.checkout_id === "string"
      ? searchParams.checkout_id
      : undefined;

  return (
    <div className="container max-w-4xl py-16 md:py-20">
      <div className="rounded-[2rem] border bg-card p-8 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Checkout Success
        </p>
        <h1 className="mt-3 font-heading text-4xl text-foreground">
          Your payment has been completed.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Creem is processing the order and issuing the license. The key is
          typically available from the purchase receipt and can also be
          retrieved from Wappkit using the original purchase email and order
          details.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Order ID
            </p>
            <p className="mt-2 break-all text-sm text-foreground">
              {orderId ?? "Available after webhook sync"}
            </p>
          </div>
          <div className="rounded-2xl border bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Checkout ID
            </p>
            <p className="mt-2 break-all text-sm text-foreground">
              {checkoutId ?? "Provided by Creem after payment"}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/license/retrieve">
            <Button rounded="full">Retrieve License</Button>
          </Link>
          <Link href={toolSlug ? `/tools/${toolSlug}` : "/tools"}>
            <Button rounded="full" variant="outline">
              Back to Product Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
