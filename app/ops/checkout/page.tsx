import Link from "next/link";

import { LicenseAdminLoginForm } from "@/components/forms/license-admin-login-form";
import {
  hasAdminPageSession,
  isAdminTokenConfigured,
} from "@/lib/admin-auth";
import { getCheckoutStats, getProductEventStats } from "@/lib/funnel";
import { tools } from "@/lib/tools";
import { constructMetadata } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Checkout Stats | Wappkit",
  description: "Internal checkout attempt counts for Wappkit tools.",
  noIndex: true,
});

/** referer 只留主机名，表格里才读得动 */
function hostOf(referer: string | null) {
  if (!referer) {
    return "—";
  }
  try {
    return new URL(referer).host;
  } catch {
    return referer.slice(0, 40);
  }
}

function timeOf(iso: string) {
  if (!iso) {
    return "—";
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return date.toLocaleString("en-GB", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function CheckoutStatsPage() {
  if (!isAdminTokenConfigured()) {
    return (
      <div className="container max-w-[980px] py-16 md:py-20">
        <div className="rounded-[2rem] border bg-card p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Internal Admin
          </p>
          <h1 className="mt-3 font-heading text-4xl text-foreground">
            Admin access is not configured
          </h1>
          <p className="mt-4 text-muted-foreground">
            Add <code>INTERNAL_ADMIN_TOKEN</code> in Vercel before using this
            page.
          </p>
        </div>
      </div>
    );
  }

  if (!hasAdminPageSession()) {
    return (
      <div className="container max-w-[980px] py-16 md:py-20">
        <LicenseAdminLoginForm />
      </div>
    );
  }

  const stats = await getCheckoutStats(tools.map((tool) => tool.slug), 30);
  const productEvents = await getProductEventStats(
    tools.map((tool) => tool.slug),
    30,
  );
  const licenseViews =
    productEvents.find((row) => row.event === "license_view")?.total ?? 0;
  const proClicks =
    productEvents.find((row) => row.event === "pro_interest")?.total ?? 0;
  const proInterestRate =
    licenseViews > 0 ? `${Math.round((proClicks / licenseViews) * 100)}%` : "—";
  const max = Math.max(1, ...stats.days.map((day) => day.count));
  const today = stats.days[stats.days.length - 1];
  // 日历上没量到的日子不占表格，只留真的有数字的
  const rows = [...stats.days].reverse().filter((day) => day.count > 0);
  const conversion =
    stats.total > 0
      ? `${Math.round((stats.paidTotal / stats.total) * 100)}%`
      : "—";
  const conversionLast30 =
    stats.last30 > 0
      ? `${Math.round((stats.paidLast30 / stats.last30) * 100)}%`
      : "—";

  return (
    <div className="container max-w-[980px] py-16 md:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Internal Admin
      </p>
      <h1 className="mt-3 font-heading text-4xl text-foreground">
        Checkout attempts
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        An attempt is counted the moment a buyer presses Buy and we ask Creem
        for a checkout session. A paid order is counted when Creem confirms the
        payment through the webhook — so the gap between the two numbers is the
        checkout page losing people.
      </p>

      {stats.alert ? (
        <div className="mt-6 rounded-[1.25rem] border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-semibold">
            {stats.last30} checkout opens in the last 30 days, 0 paid orders.
          </p>
          <p className="mt-2 leading-6">
            That is the pattern worth investigating. Check, in this order: (1)
            the Creem webhook is still pointed at{" "}
            <code>/api/webhook/creem</code> and signing with the current
            secret — if the webhook is dead, orders are paid but never counted;
            (2) the Creem product is live and not in test mode; (3) the price
            and currency shown on the Creem page match the site.
          </p>
        </div>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Attempts · total", value: stats.total },
          { label: "Paid orders", value: stats.paidTotal },
          { label: "Conversion", value: conversion },
          { label: "Today (attempts)", value: today?.count ?? 0 },
        ].map((item) => (
          <div key={item.label} className="rounded-[1.5rem] border bg-card p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-3 font-heading text-4xl text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Last 30 days: <strong>{stats.last30}</strong> attempts,{" "}
        <strong>{stats.paidLast30}</strong> paid, conversion{" "}
        <strong>{conversionLast30}</strong>.
      </p>

      <div className="mt-8 overflow-hidden rounded-[1.5rem] border bg-card">
        <div className="border-b bg-muted/30 px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            In-app interest (before anyone reaches checkout)
          </p>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          {[
            { label: "License tab opens", value: licenseViews },
            { label: '"How do I get one?" clicks', value: proClicks },
            { label: "Clicks per open", value: proInterestRate },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 font-heading text-3xl text-foreground">
                {item.value}
              </p>
            </div>
          ))}
        </div>
        <p className="px-5 pb-5 text-xs leading-6 text-muted-foreground">
          Sent by the desktop app when someone opens the License tab or presses
          the Pro hint. No queries, results or emails are included. A rising
          click rate with zero checkouts means people want Pro but cannot find
          the purchase path, which is exactly the signal worth acting on.
        </p>
      </div>

      {stats.tools.length > 0 ? (
        <div className="mt-8 overflow-hidden rounded-[1.5rem] border bg-card">
          <div className="border-b bg-muted/30 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Per tool (all time)
            </p>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">Tool</th>
                <th className="px-5 py-3 font-semibold">Opened</th>
                <th className="px-5 py-3 font-semibold">Paid</th>
                <th className="px-5 py-3 font-semibold">Conv.</th>
              </tr>
            </thead>
            <tbody>
              {stats.tools.map((row) => (
                <tr key={row.toolSlug} className="border-t">
                  <td className="px-5 py-3 font-mono text-xs">{row.toolSlug}</td>
                  <td className="px-5 py-3 font-semibold">{row.attempts}</td>
                  <td className="px-5 py-3 font-semibold">{row.paid}</td>
                  <td className="px-5 py-3">
                    {row.conversion === null
                      ? "—"
                      : `${Math.round(row.conversion * 100)}%`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-[1.5rem] border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Attempts</th>
              <th className="hidden px-5 py-3 font-semibold sm:table-cell">
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((day) => (
                <tr key={day.date} className="border-t">
                  <td className="px-5 py-3 font-mono text-xs">{day.date}</td>
                  <td className="px-5 py-3 font-semibold">{day.count}</td>
                  <td className="hidden px-5 py-3 sm:table-cell">
                    <div className="h-2 w-full max-w-[260px] overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-teal-500"
                        style={{ width: `${(day.count / max) * 100}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td className="px-5 py-6 text-muted-foreground" colSpan={3}>
                  No checkout attempt recorded in the last 30 days.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 overflow-hidden rounded-[1.5rem] border bg-card">
        <div className="border-b bg-muted/30 px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Latest 50 attempts
          </p>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">When (Shanghai)</th>
              <th className="px-5 py-3 font-semibold">Tool</th>
              <th className="px-5 py-3 font-semibold">Country</th>
              <th className="hidden px-5 py-3 font-semibold sm:table-cell">
                Came from
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.events.length > 0 ? (
              stats.events.map((event, index) => (
                <tr key={`${event.at}-${index}`} className="border-t">
                  <td className="px-5 py-3 font-mono text-xs">
                    {timeOf(event.at)}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs">
                    {event.toolSlug}
                  </td>
                  <td className="px-5 py-3">{event.country ?? "—"}</td>
                  <td className="hidden px-5 py-3 text-muted-foreground sm:table-cell">
                    {hostOf(event.referer)}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td className="px-5 py-6 text-muted-foreground" colSpan={4}>
                  Nothing recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 overflow-hidden rounded-[1.5rem] border bg-card">
        <div className="border-b bg-muted/30 px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Paid orders ({stats.paidOrders.length})
          </p>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">When (Shanghai)</th>
              <th className="px-5 py-3 font-semibold">Tool</th>
              <th className="hidden px-5 py-3 font-semibold sm:table-cell">
                Order
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.paidOrders.length > 0 ? (
              stats.paidOrders.map((order, index) => (
                <tr key={`${order.orderId}-${index}`} className="border-t">
                  <td className="px-5 py-3 font-mono text-xs">
                    {timeOf(order.at)}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs">
                    {order.toolSlug}
                  </td>
                  <td className="hidden px-5 py-3 font-mono text-xs text-muted-foreground sm:table-cell">
                    {order.orderId || "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td className="px-5 py-6 text-muted-foreground" colSpan={3}>
                  No paid order yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-6 text-muted-foreground">
        Counts live in Upstash under{" "}
        <code>wappkit:funnel:checkout_attempts:*</code> and{" "}
        <code>wappkit:funnel:paid_orders:*</code>; details in{" "}
        <code>wappkit:funnel:checkout_events</code> and{" "}
        <code>wappkit:funnel:paid_events</code> (last 500 each). If every number
        stays at zero, check that <code>UPSTASH_REDIS_REST_URL</code> and{" "}
        <code>UPSTASH_REDIS_REST_TOKEN</code> are set in Vercel.{" "}
        <Link className="underline" href="/ops/downloads">
          APK download stats
        </Link>
        .
      </p>
    </div>
  );
}
