"use client";

import { FormEvent, useState } from "react";

import { CopyButton } from "@/components/shared/copy-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeEmailInput, trimInput } from "@/lib/input-utils";

type AdminLicenseResult = {
  lookupMode: "licenseKey" | "orderId" | "orderAndEmail";
  orderId: string;
  customerEmail: string;
  customerName: string | null;
  productName: string;
  toolSlug: string;
  createdAt: string;
  updatedAt: string;
  licenseKeys: Array<{
    id: string;
    key: string;
    status: string;
    boundDevice?: {
      deviceId: string;
      deviceName: string;
      boundAt: string;
      lastValidatedAt: string;
    } | null;
  }>;
};

function getLicenseStatusTone(status: string) {
  switch (status) {
    case "active":
      return "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300";
    case "inactive":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    case "disabled":
      return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    default:
      return "border-muted bg-muted/40 text-muted-foreground";
  }
}

function getLookupModeLabel(mode: AdminLicenseResult["lookupMode"]) {
  switch (mode) {
    case "licenseKey":
      return "License key lookup";
    case "orderAndEmail":
      return "Order + email lookup";
    default:
      return "Order lookup";
  }
}

export function LicenseAdminConsole() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeUnbindKey, setActiveUnbindKey] = useState<string | null>(null);
  const [activeStatusKey, setActiveStatusKey] = useState<string | null>(null);
  const [result, setResult] = useState<AdminLicenseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsSearching(true);
      setError(null);
      setNotice(null);

      const response = await fetch("/api/admin/license/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: trimInput(orderId),
          email: normalizeEmailInput(email),
          licenseKey: trimInput(licenseKey),
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: AdminLicenseResult;
      };

      if (response.status === 401) {
        window.location.reload();
        return;
      }

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.message ?? "Admin lookup failed.");
      }

      setResult(payload.data);
    } catch (caughtError) {
      setResult(null);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Admin lookup failed.",
      );
    } finally {
      setIsSearching(false);
    }
  }

  async function handleUnbindLicense(targetLicenseKey: string) {
    try {
      setActiveUnbindKey(targetLicenseKey);
      setError(null);
      setNotice(null);

      const response = await fetch("/api/admin/license/unbind", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseKey: targetLicenseKey,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: {
          licenseKey: string;
          status: string;
          boundDevice?: AdminLicenseResult["licenseKeys"][number]["boundDevice"];
        };
      };

      if (response.status === 401) {
        window.location.reload();
        return;
      }

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.message ?? "Failed to unbind the device.");
      }

      setResult((current) =>
        current
          ? {
              ...current,
              licenseKeys: current.licenseKeys.map((license) =>
                license.key === payload.data?.licenseKey
                  ? {
                      ...license,
                      status: payload.data.status,
                      boundDevice: payload.data.boundDevice ?? null,
                    }
                  : license,
              ),
            }
          : current,
      );
      setNotice(payload.message ?? "The device binding was removed.");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to unbind the device.",
      );
    } finally {
      setActiveUnbindKey(null);
    }
  }

  async function handleLicenseStatusChange(
    targetLicenseKey: string,
    action: "disable" | "enable",
  ) {
    try {
      setActiveStatusKey(targetLicenseKey);
      setError(null);
      setNotice(null);

      const response = await fetch("/api/admin/license/status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          licenseKey: targetLicenseKey,
          action,
        }),
      });

      const payload = (await response.json()) as {
        success?: boolean;
        message?: string;
        data?: {
          licenseKey: string;
          status: string;
          boundDevice?: AdminLicenseResult["licenseKeys"][number]["boundDevice"];
        };
      };

      if (response.status === 401) {
        window.location.reload();
        return;
      }

      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.message ?? "Failed to update the license status.");
      }

      setResult((current) =>
        current
          ? {
              ...current,
              licenseKeys: current.licenseKeys.map((license) =>
                license.key === payload.data?.licenseKey
                  ? {
                      ...license,
                      status: payload.data.status,
                      boundDevice: payload.data.boundDevice ?? null,
                    }
                  : license,
              ),
            }
          : current,
      );
      setNotice(payload.message ?? "The license status was updated.");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to update the license status.",
      );
    } finally {
      setActiveStatusKey(null);
    }
  }

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await fetch("/api/admin/session", {
        method: "DELETE",
      });
    } finally {
      window.location.reload();
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border bg-card p-8 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Internal Admin
            </p>
            <h1 className="mt-3 font-heading text-4xl text-foreground">
              License operations console
            </h1>
            <p className="mt-4 max-w-3xl text-muted-foreground">
              Search by order ID, order + purchase email, or license key. Use
              this page when a customer cannot unbind an old device on their own
              and needs manual help.
            </p>
          </div>
          <Button
            type="button"
            rounded="full"
            variant="outline"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Closing..." : "Log Out"}
          </Button>
        </div>

        <form className="mt-8 grid gap-4 md:grid-cols-3" onSubmit={handleSearch}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Order ID
            </label>
            <Input
              value={orderId}
              onChange={(event) => setOrderId(event.target.value)}
              placeholder="ord_123..."
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
              placeholder="customer@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              License key
            </label>
            <Input
              value={licenseKey}
              onChange={(event) => setLicenseKey(event.target.value)}
              placeholder="WAAP-XXXX-XXXX"
            />
          </div>
          <div className="md:col-span-3">
            <Button type="submit" rounded="full" disabled={isSearching}>
              {isSearching ? "Searching..." : "Search License Record"}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-xs text-muted-foreground">
          Support rule: one license key can stay bound to one active computer at
          a time. Force unbind should only be used when the customer can no
          longer access the original machine.
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      {notice ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-sm text-emerald-700 dark:text-emerald-300">
          {notice}
        </div>
      ) : null}

      {result ? (
        <div className="space-y-5 rounded-[2rem] border bg-muted/20 p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Lookup mode
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {getLookupModeLabel(result.lookupMode)}
              </p>
            </div>
            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Product
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {result.productName}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {result.toolSlug}
              </p>
            </div>
            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Order
              </p>
              <p className="mt-2 break-all text-sm font-medium text-foreground">
                {result.orderId}
              </p>
            </div>
            <div className="rounded-2xl border bg-background p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Customer
              </p>
              <p className="mt-2 text-sm font-medium text-foreground">
                {result.customerName || "Name not provided"}
              </p>
              <p className="mt-1 break-all text-xs text-muted-foreground">
                {result.customerEmail}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {result.licenseKeys.map((license) => (
              <div key={license.id} className="rounded-2xl border bg-background p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      License key
                    </p>
                    <code className="mt-2 block break-all text-sm text-foreground">
                      {license.key}
                    </code>
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getLicenseStatusTone(license.status)}`}
                      >
                        {license.status}
                      </span>
                    </div>
                    {license.boundDevice ? (
                      <div className="mt-3 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-3 text-xs text-muted-foreground">
                        <p className="font-medium text-foreground">
                          Bound to: {license.boundDevice.deviceName}
                        </p>
                        <p className="mt-1 break-all">
                          Device ID: {license.boundDevice.deviceId}
                        </p>
                        <p className="mt-1">
                          Bound at: {new Date(
                            license.boundDevice.boundAt,
                          ).toLocaleString()}
                        </p>
                        <p className="mt-1">
                          Last validated:{" "}
                          {new Date(
                            license.boundDevice.lastValidatedAt,
                          ).toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div className="mt-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-muted-foreground">
                        This license is not currently bound to a device.
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <CopyButton
                      value={license.key}
                      showText
                      idleLabel="Copy key"
                      copiedLabel="Copied"
                    />
                    {license.boundDevice ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleUnbindLicense(license.key)}
                        disabled={
                          activeUnbindKey === license.key ||
                          activeStatusKey === license.key
                        }
                      >
                        {activeUnbindKey === license.key
                          ? "Removing..."
                          : "Force Unbind"}
                      </Button>
                    ) : null}
                    {license.status === "disabled" ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleLicenseStatusChange(license.key, "enable")}
                        disabled={activeStatusKey === license.key}
                      >
                        {activeStatusKey === license.key
                          ? "Updating..."
                          : "Re-enable License"}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => handleLicenseStatusChange(license.key, "disable")}
                        disabled={activeStatusKey === license.key}
                      >
                        {activeStatusKey === license.key
                          ? "Updating..."
                          : "Disable License"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border bg-background p-4 text-xs text-muted-foreground">
            Record created: {new Date(result.createdAt).toLocaleString()}
            {" | "}
            Last updated: {new Date(result.updatedAt).toLocaleString()}
          </div>
        </div>
      ) : null}
    </div>
  );
}
