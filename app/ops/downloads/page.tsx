import Link from "next/link";

import { LicenseAdminLoginForm } from "@/components/forms/license-admin-login-form";
import {
  hasAdminPageSession,
  isAdminTokenConfigured,
} from "@/lib/admin-auth";
import { getToolDownloadEvents, getToolDownloadStats } from "@/lib/funnel";
import { constructMetadata } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Download Stats | Wappkit",
  description: "Internal daily download counts for Wappkit tools.",
  noIndex: true,
});

const TOOL_SLUG = "reddit-reader-android";

export default async function DownloadStatsPage() {
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

  const [stats, events] = await Promise.all([
    getToolDownloadStats(TOOL_SLUG, 30),
    getToolDownloadEvents(TOOL_SLUG, 50),
  ]);
  const max = Math.max(1, ...stats.days.map((day) => day.count));
  const today = stats.days[stats.days.length - 1];
  const rows = [...stats.days].reverse();
  const sourceRows = Object.entries(
    events.reduce<Record<string, number>>((acc, event) => {
      acc[event.source] = (acc[event.source] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="container max-w-[980px] py-16 md:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Internal Admin
      </p>
      <h1 className="mt-3 font-heading text-4xl text-foreground">
        APK download stats
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Reddit Reader for Android. A count is recorded when the download route
        is requested; shared caches and retries can add a few extra hits.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total downloads", value: stats.total },
          { label: "Last 30 days", value: stats.last30 },
          { label: "Today", value: today?.count ?? 0 },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[1.5rem] border bg-card p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-3 font-heading text-4xl text-foreground">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[1.5rem] border bg-card p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-heading text-2xl text-foreground">
            Where downloads came from
          </h2>
          <p className="text-xs text-muted-foreground">
            Last {events.length} recorded requests
          </p>
        </div>
        {sourceRows.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {sourceRows.map(([source, count]) => (
              <span
                key={source}
                className="rounded-full border bg-muted/40 px-3 py-1 text-xs font-semibold text-foreground"
              >
                {source} · {count}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No events recorded yet.
          </p>
        )}
        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          <code>android_page</code> is the button on the download page.{" "}
          <code>direct</code> is a request without a source tag, which can be a
          bot, a direct link, or a cached URL.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-[1.5rem] border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Downloads</th>
              <th className="hidden px-5 py-3 font-semibold sm:table-cell">
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((day) => (
              <tr key={day.date} className="border-t">
                <td className="px-5 py-3 font-mono text-xs">{day.date}</td>
                <td className="px-5 py-3 font-semibold">{day.count}</td>
                <td className="hidden px-5 py-3 sm:table-cell">
                  <div className="h-2 w-full max-w-[260px] overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-orange-500"
                      style={{ width: `${(day.count / max) * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {events.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-[1.5rem] border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">
                  Recent request (Asia/Shanghai)
                </th>
                <th className="px-5 py-3 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {events.slice(0, 20).map((event, index) => (
                <tr key={`${event.at}-${index}`} className="border-t">
                  <td className="px-5 py-3 font-mono text-xs">
                    {timeFormatter.format(new Date(event.at))}
                  </td>
                  <td className="px-5 py-3 font-semibold">{event.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs leading-6 text-muted-foreground">
        Dates use Asia/Shanghai. Counts are stored in Upstash under{" "}
        <code>wappkit:downloads:{TOOL_SLUG}:day:YYYY-MM-DD</code>. If every
        number stays at zero, check that <code>UPSTASH_REDIS_REST_URL</code>{" "}
        and <code>UPSTASH_REDIS_REST_TOKEN</code> are set.
      </p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link
          className="font-semibold text-orange-700 hover:underline"
          href="/tools/reddit-reader-android"
        >
          Open the download page
        </Link>
        <Link
          className="font-semibold text-muted-foreground hover:underline"
          href="/ops/licenses"
        >
          License admin
        </Link>
      </div>
    </div>
  );
}
