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
  type LicenseKeyRecord,
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
  let syncedCustomerEmail: string | null = null;
  let licenseKeys: LicenseKeyRecord[] = [];
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

  if (orderId && (!canVerifyRedirect || hasValidRedirectSignature)) {
    try {
      const record = await getLicenseStore().getByOrderId(orderId);

      if (record) {
        syncedOrderId = record.orderId;
        syncedCustomerEmail = record.customerEmail;
        licenseKeys = record.licenseKeys;
        syncReady = true;
      }
    } catch {
      syncReady = false;
    }
  }

  if (
    licenseKeys.length === 0 &&
    checkoutId &&
    (!canVerifyRedirect || hasValidRedirectSignature)
  ) {
    try {
      const checkout = await retrieveCreemCheckout(checkoutId);

      if (hasLicenseKeys(checkout)) {
        const record = createLicenseRecordFromCreemCheckout(checkout);

        await getLicenseStore().save(record);

        syncedOrderId = record.orderId;
        syncedCustomerEmail = record.customerEmail;
        licenseKeys = record.licenseKeys;
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
          licenseKeys.length > 0
            ? "Your license key is ready. Copy it below and use it in the desktop app to unlock Pro features."
            : syncReady
            ? "Your order has already been synced with Wappkit. If the key is not shown yet, use the original purchase email and order ID below to retrieve it."
            : "Creem is processing the order and issuing the license. The key is typically available from the purchase receipt and can also be retrieved from Wappkit using the original purchase email and order details."
        }
        badges={[
          {
            label:
              licenseKeys.length > 0
                ? "License ready"
                : syncReady
                ? "Synced with Wappkit"
                : "Processing order",
            tone: "warm",
          },
          { label: "License retrieval ready", tone: "muted" },
        ]}
      />

      {licenseKeys.length > 0 ? (
        <MarketingCard tone="warm" className="mt-10 p-6 md:p-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
                License Key
              </p>
              <h2 className="mt-2 font-heading text-2xl text-foreground">
                Copy this key to activate the desktop app.
              </h2>
            </div>
            <span className="rounded-full bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
              Pro unlock
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {licenseKeys.map((license) => (
              <div
                key={license.id}
                className="rounded-2xl border border-orange-200 bg-white/85 p-4"
              >
                <code className="block select-all break-all text-lg font-semibold tracking-wide text-slate-950 md:text-xl">
                  {license.key}
                </code>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Status: {license.status}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Save this key. Open AI E-commerce Visual Studio, click Enter Key,
            paste the license key, and activate Pro on this computer.
          </p>
        </MarketingCard>
      ) : null}

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
        {syncedCustomerEmail ? (
          <MarketingCard tone="soft" className="p-5 md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Purchase Email
            </p>
            <p className="mt-3 break-all text-sm text-foreground">
              {syncedCustomerEmail}
            </p>
          </MarketingCard>
        ) : null}
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
