import Link from "next/link";

import { LicenseAdminLoginForm } from "@/components/forms/license-admin-login-form";
import {
  hasAdminPageSession,
  isAdminTokenConfigured,
} from "@/lib/admin-auth";
import { getToolDownloadEvents, getToolDownloadStats } from "@/lib/funnel";
import { getStoreTools } from "@/lib/go-links";
import { constructMetadata } from "@/lib/utils";

/**
 * 商店点击的来源看板。
 *
 * 微软商店后台只说"有多少人看了详情页"，不说他们从哪来。
 * 所有站外链接都先落到 /go/<工具>-<渠道>，点击时由
 * /go/[slug]/out 写进 Upstash，这个页面把它们读回来。
 *
 * 判断渠道生死就看这里，不看商店的 Page views：那个数含爬虫、
 * 含我们自己开的页面，还分不清新旧访客。
 */
export const dynamic = "force-dynamic";

export const metadata = constructMetadata({
  title: "Store Click Stats | Wappkit",
  description: "Internal per-channel store click counts for Wappkit tools.",
  noIndex: true,
});

function stripPrefix(source: string) {
  return source.startsWith("go:") ? source.slice(3) : source;
}

export default async function StoreStatsPage() {
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

  const storeTools = getStoreTools();

  const rows = await Promise.all(
    storeTools.map(async (tool) => {
      const [stats, events] = await Promise.all([
        getToolDownloadStats(tool.slug, 30),
        getToolDownloadEvents(tool.slug, 200),
      ]);

      const channels = Object.entries(
        events.reduce<Record<string, number>>((acc, event) => {
          const key = stripPrefix(event.source);
          acc[key] = (acc[key] ?? 0) + 1;
          return acc;
        }, {}),
      ).sort((a, b) => b[1] - a[1]);

      return {
        slug: tool.slug,
        name: tool.name,
        total: stats.total,
        last30: stats.last30,
        today: stats.days[stats.days.length - 1]?.count ?? 0,
        channels,
        events,
      };
    }),
  );

  const totalClicks = rows.reduce((sum, row) => sum + row.total, 0);
  const clicks30 = rows.reduce((sum, row) => sum + row.last30, 0);
  const activeTools = rows.filter((row) => row.total > 0).length;
  const allEvents = rows
    .flatMap((row) =>
      row.events.map((event) => ({
        at: event.at,
        source: stripPrefix(event.source),
        name: row.name,
      })),
    )
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 30);

  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="container max-w-[980px] py-16 md:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Internal Admin
      </p>
      <h1 className="mt-3 font-heading text-4xl text-foreground">
        Store click stats
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Clicks that went from a Wappkit link to a Microsoft Store listing.
        Recorded on the server when <code>/go/&lt;tool&gt;-&lt;channel&gt;/out</code>{" "}
        is requested, so ad blockers and disabled JavaScript do not hide them.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total clicks", value: totalClicks },
          { label: "Last 30 days", value: clicks30 },
          { label: "Tools with clicks", value: `${activeTools}/${rows.length}` },
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

      <div className="mt-8 space-y-4">
        {rows.map((row) => (
          <div key={row.slug} className="rounded-[1.5rem] border bg-card p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-heading text-2xl text-foreground">
                {row.name}
              </h2>
              <p className="font-mono text-xs text-muted-foreground">
                /go/{row.slug}-&lt;channel&gt;
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              <span>
                <span className="text-muted-foreground">Total </span>
                <span className="font-semibold text-foreground">
                  {row.total}
                </span>
              </span>
              <span>
                <span className="text-muted-foreground">30 days </span>
                <span className="font-semibold text-foreground">
                  {row.last30}
                </span>
              </span>
              <span>
                <span className="text-muted-foreground">Today </span>
                <span className="font-semibold text-foreground">
                  {row.today}
                </span>
              </span>
            </div>

            {row.channels.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {row.channels.map(([channel, count]) => (
                  <span
                    key={channel}
                    className="rounded-full border bg-muted/40 px-3 py-1 text-xs font-semibold text-foreground"
                  >
                    {channel} · {count}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No clicks yet. Any link to <code>/go/{row.slug}-yt01</code> will
                start recording.
              </p>
            )}
          </div>
        ))}
      </div>

      {allEvents.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-[1.5rem] border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">
                  Recent click (Asia/Shanghai)
                </th>
                <th className="px-5 py-3 font-semibold">Tool</th>
                <th className="px-5 py-3 font-semibold">Channel</th>
              </tr>
            </thead>
            <tbody>
              {allEvents.map((event, index) => (
                <tr key={`${event.at}-${index}`} className="border-t">
                  <td className="px-5 py-3 font-mono text-xs">
                    {timeFormatter.format(new Date(event.at))}
                  </td>
                  <td className="px-5 py-3">{event.name}</td>
                  <td className="px-5 py-3 font-semibold">{event.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs leading-6 text-muted-foreground">
        <code>direct</code> means the link had no channel suffix, which is
        usually a bot or a URL someone trimmed by hand. Counts live in Upstash
        under <code>wappkit:downloads:&lt;tool&gt;:day:YYYY-MM-DD</code> and{" "}
        <code>wappkit:downloads:&lt;tool&gt;:events</code>. If everything stays
        at zero, check <code>UPSTASH_REDIS_REST_URL</code> and{" "}
        <code>UPSTASH_REDIS_REST_TOKEN</code>.
      </p>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <Link
          className="font-semibold text-orange-700 hover:underline"
          href="/ops/licenses"
        >
          License admin
        </Link>
        <Link
          className="font-semibold text-muted-foreground hover:underline"
          href="/ops/downloads"
        >
          APK download stats
        </Link>
      </div>
    </div>
  );
}
