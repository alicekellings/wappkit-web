"use client";

import { FormEvent, useMemo, useState } from "react";

import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LicenseLookupResult = {
  orderId: string;
  productName: string;
  toolSlug: string;
  customerEmail: string;
  licenseKeys: Array<{
    id: string;
    key: string;
    status: string;
  }>;
  emailDeliveryAvailable: boolean;
};

type LicenseStatusMeta = {
  label: string;
  description: string;
  tone: string;
};

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) {
    return email;
  }

  const safeName =
    name.length <= 2 ? `${name[0] ?? ""}*` : `${name[0]}${"*".repeat(name.length - 2)}${name[name.length - 1]}`;

  return `${safeName}@${domain}`;
}

function getLicenseStatusMeta(status: string): LicenseStatusMeta {
  switch (status) {
    case "inactive":
      return {
        label: "Ready to activate",
        description:
          "This key has been issued and has not been activated yet.",
        tone:
          "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      };
    case "active":
      return {
        label: "Activated",
        description:
          "This key has already been activated at least once.",
        tone:
          "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
      };
    case "disabled":
      return {
        label: "Disabled",
        description:
          "This key is no longer usable. Contact support if you did not expect this.",
        tone:
          "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      };
    default:
      return {
        label: "Status unavailable",
        description:
          "The key was found, but its activation state is not available yet.",
        tone:
          "border-muted bg-muted/40 text-muted-foreground",
      };
  }
}

export function LicenseRetrievalForm() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [result, setResult] = useState<LicenseLookupResult | null>(null);

  const maskedEmail = useMemo(
    () => (result ? maskEmail(result.customerEmail) : null),
    [result],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setError(null);
      setEmailStatus(null);
      setResult(null);

      const response = await fetch("/api/license/retrieve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          email,
        }),
      });

      const payload = (await response.json()) as {
        data?: LicenseLookupResult;
        error?: string;
      };

      if (!response.ok || !payload.data) {
        throw new Error(
          payload.error ??
            "We could not match that order ID and purchase email.",
        );
      }

      setResult(payload.data);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to retrieve license.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSendEmail() {
    if (!result) {
      return;
    }

    try {
      setIsEmailSending(true);
      setEmailStatus(null);

      const response = await fetch("/api/license/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: result.orderId,
          email,
        }),
      });

      const payload = (await response.json()) as { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to send email copy.");
      }

      setEmailStatus(payload.message ?? "A copy has been sent.");
    } catch (caughtError) {
      setEmailStatus(
        caughtError instanceof Error
          ? caughtError.message
          : "Email delivery is not available yet.",
      );
    } finally {
      setIsEmailSending(false);
    }
  }

  return (
    <div className="space-y-8">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Order ID</label>
          <Input
            value={orderId}
            onChange={(event) => setOrderId(event.target.value)}
            placeholder="Enter the order ID from your receipt or success page"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Purchase email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <Button type="submit" rounded="full" disabled={isLoading}>
          {isLoading ? "Checking..." : "Retrieve License"}
        </Button>
      </form>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-5 rounded-[2rem] border bg-muted/20 p-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Match found
            </p>
            <h2 className="font-heading text-2xl text-foreground">
              {result.productName}
            </h2>
            <p className="text-sm text-muted-foreground">
              Order <span className="font-medium text-foreground">{result.orderId}</span>{" "}
              is linked to <span className="font-medium text-foreground">{maskedEmail}</span>.
            </p>
          </div>

          <div className="space-y-3">
            {result.licenseKeys.length > 0 ? (
              result.licenseKeys.map((license) => (
                <div key={license.id} className="rounded-2xl border bg-background p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        License key
                      </p>
                      <code className="mt-2 block break-all text-sm text-foreground">
                        {license.key}
                      </code>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getLicenseStatusMeta(license.status).tone}`}
                        >
                          {getLicenseStatusMeta(license.status).label}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          {getLicenseStatusMeta(license.status).description}
                        </p>
                      </div>
                    </div>
                    <CopyButton
                      value={license.key}
                      showText
                      idleLabel="Copy key"
                      copiedLabel="Copied"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border bg-background p-4 text-sm text-muted-foreground">
                A purchase record was found, but no license key has been synced
                yet. Please check again in a moment or contact support.
              </div>
            )}
          </div>

          <div className="rounded-2xl border bg-background p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Activation steps
            </p>
            <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>1. Copy the license key shown above.</li>
              <li>2. Open your Wappkit app and find the activation screen.</li>
              <li>3. Paste the key and confirm to unlock the paid version.</li>
            </ol>
            <p className="mt-3 text-xs text-muted-foreground">
              If the status says <span className="font-medium text-foreground">Ready to activate</span>,
              the key is valid and simply has not been used yet.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              rounded="full"
              variant="outline"
              onClick={handleSendEmail}
              disabled={!result.emailDeliveryAvailable || isEmailSending}
            >
              {isEmailSending
                ? "Sending..."
                : result.emailDeliveryAvailable
                  ? "Email a Copy"
                  : "Email Delivery Coming Soon"}
            </Button>
            <Button
              type="button"
              rounded="full"
              variant="ghost"
              onClick={() => {
                window.location.href = "/docs/checkout-and-activation";
              }}
            >
              Open Activation Guide
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            {result.emailDeliveryAvailable
              ? "Email delivery is available and always sends to the original purchase email."
              : "The key shown on this page is the current retrieval path. Email re-send can be enabled later without changing the license flow."}
          </p>

          {emailStatus ? (
            <p className="text-sm text-muted-foreground">{emailStatus}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
