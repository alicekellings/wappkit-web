import Link from "next/link";

import {
  retrieveCreemCheckout,
  verifyCreemRedirectSignature,
} from "@/lib/creem";
import { getTrimmedEnv } from "@/lib/env-utils";
import { getTrimmedSearchParam } from "@/lib/input-utils";
import {
  createLicenseRecordFromCreemCheckout,
  getLicenseStore,
  hasLicenseKeys,
} from "@/lib/licenses";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";

export const metadata = constructMetadata({
  title: "Checkout Success | Wappkit",
  description:
    "Payment completed. Your Wappkit purchase is being processed and the license can be retrieved from the site if needed.",
  noIndex: true,
});

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const toolSlug = getTrimmedSearchParam(searchParams.tool, {
    allowPattern: /^[a-z0-9-]+$/,
    maxLength: 80,
  });
  const orderId = getTrimmedSearchParam(searchParams.order_id, {
    allowPattern: /^[A-Za-z0-9_-]+$/,
    maxLength: 120,
  });
  const checkoutId = getTrimmedSearchParam(searchParams.checkout_id, {
    allowPattern: /^[A-Za-z0-9_-]+$/,
    maxLength: 120,
  });
  const customerId = getTrimmedSearchParam(searchParams.customer_id, {
    allowPattern: /^[A-Za-z0-9_-]+$/,
    maxLength: 120,
  });
  const productId = getTrimmedSearchParam(searchParams.product_id, {
    allowPattern: /^[A-Za-z0-9_-]+$/,
    maxLength: 120,
  });
  const requestId = getTrimmedSearchParam(searchParams.request_id, {
    allowPattern: /^[A-Za-z0-9_-]+$/,
    maxLength: 120,
  });
  const signature = getTrimmedSearchParam(searchParams.signature, {
    allowPattern: /^[A-Fa-f0-9=]+$/,
    maxLength: 200,
  });
  let syncedOrderId = orderId;
  let syncReady = false;
  const creemApiKey = getTrimmedEnv("CREEM_API_KEY");
  const canVerifyRedirect = Boolean(creemApiKey) && Boolean(signature);
  const hasValidRedirectSignature =
    canVerifyRedirect &&
    verifyCreemRedirectSignature(
      {
        checkout_id: checkoutId,
        order_id: orderId,
        customer_id: customerId,
        product_id: productId,
        request_id: requestId,
        signature,
      },
      creemApiKey!,
    );

  if (checkoutId && (!canVerifyRedirect || hasValidRedirectSignature)) {
    try {
      const checkout = await retrieveCreemCheckout(checkoutId);

      if (hasLicenseKeys(checkout)) {
        const record = createLicenseRecordFromCreemCheckout(checkout);

        await getLicenseStore().save(record);

        syncedOrderId = record.orderId;
        syncReady = true;
      }
    } catch {
      syncReady = false;
    }
  }

  return (
    <MarketingPageShell containerClassName="max-w-5xl py-16 md:py-20">
      <MarketingHero
        eyebrow="Checkout Success"
        title="Your payment has been completed."
        description={
          syncReady
            ? "Your order has already been synced with Wappkit, so you can retrieve the license using the original purchase email and the order ID shown below."
            : "Creem is processing the order and issuing the license. The key is typically available from the purchase receipt and can also be retrieved from Wappkit using the original purchase email and order details."
        }
        badges={[
          {
            label: syncReady ? "Synced with Wappkit" : "Processing order",
            tone: "warm",
          },
          { label: "License retrieval ready", tone: "muted" },
        ]}
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <MarketingCard tone="soft" className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Order ID
          </p>
          <p className="mt-3 break-all text-sm text-foreground">
            {syncedOrderId ?? "Available after sync"}
          </p>
        </MarketingCard>
        <MarketingCard tone="soft" className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Checkout ID
          </p>
          <p className="mt-3 break-all text-sm text-foreground">
            {checkoutId ?? "Provided by Creem after payment"}
          </p>
        </MarketingCard>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/license/retrieve">
          <Button rounded="full">Retrieve License</Button>
        </Link>
        <Link href={toolSlug ? `/tools/${toolSlug}` : "/tools"}>
          <Button rounded="full" variant="outline">
            Back to Product Page
          </Button>
        </Link>
      </div>
    </MarketingPageShell>
  );
}
