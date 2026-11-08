import Link from "next/link";

import { LicenseAdminLoginForm } from "@/components/forms/license-admin-login-form";
import {
  hasAdminPageSession,
  isAdminTokenConfigured,
} from "@/lib/admin-auth";
import { getCheckoutStats } from "@/lib/funnel";
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
  const max = Math.max(1, ...stats.days.map((day) => day.count));
  const today = stats.days[stats.days.length - 1];
  // 日历上没量到的日子不占表格，只留真的有数字的
  const rows = [...stats.days].reverse().filter((day) => day.count > 0);

  return (
    <div className="container max-w-[980px] py-16 md:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Internal Admin
      </p>
      <h1 className="mt-3 font-heading text-4xl text-foreground">
        Checkout attempts
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        A count is recorded the moment a buyer presses Buy and we ask Creem for
        a checkout session — so this counts intent, not money. Completed
        payments still need the Creem dashboard.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total attempts", value: stats.total },
          { label: "Last 30 days", value: stats.last30 },
          { label: "Today", value: today?.count ?? 0 },
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

      {stats.tools.length > 0 ? (
        <div className="mt-8 overflow-hidden rounded-[1.5rem] border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">Tool</th>
                <th className="px-5 py-3 font-semibold">Attempts</th>
              </tr>
            </thead>
            <tbody>
              {stats.tools.map((row) => (
                <tr key={row.toolSlug} className="border-t">
                  <td className="px-5 py-3 font-mono text-xs">{row.toolSlug}</td>
                  <td className="px-5 py-3 font-semibold">{row.count}</td>
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

      <p className="mt-4 text-xs leading-6 text-muted-foreground">
        Counts live in Upstash under{" "}
        <code>wappkit:funnel:checkout_attempts:*</code>, details in the list{" "}
        <code>wappkit:funnel:checkout_events</code> (last 500). If every number
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
