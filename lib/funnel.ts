import { getTrimmedEnv } from "@/lib/env-utils";

type CheckoutAttempt = {
  toolSlug: string;
  referer: string | null;
  userAgent: string | null;
  country: string | null;
};

function getDayKey(now = new Date()) {
  return now.toISOString().slice(0, 10);
}

async function runUpstash(command: Array<string | number>) {
  const url = getTrimmedEnv("UPSTASH_REDIS_REST_URL");
  const token = getTrimmedEnv("UPSTASH_REDIS_REST_TOKEN");

  if (!url || !token) {
    return false;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });

    return response.ok;
  } catch (error) {
    console.error("funnel.upstash_failed", {
      command: command[0],
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

export async function recordDownloadClick(source: string | null) {
  const day = getDayKey();
  const event = {
    event: "download_click",
    toolSlug: "reddit-toolbox",
    source,
    at: new Date().toISOString(),
  };

  const counters = [
    "wappkit:funnel:download_clicks:total",
    `wappkit:funnel:download_clicks:day:${day}`,
  ];

  const results = await Promise.all(
    counters.map((key) => runUpstash(["INCR", key])),
  );
  const stored = results.some(Boolean);

  if (stored) {
    await runUpstash([
      "LPUSH",
      "wappkit:funnel:download_events",
      JSON.stringify(event),
    ]);
    await runUpstash(["LTRIM", "wappkit:funnel:download_events", 0, 499]);
    return;
  }

  console.log("funnel.download_click", event);
}

function getReportDayKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getRecentDayKeys(days: number, now = new Date()) {
  return Array.from({ length: days }, (_, index) =>
    getReportDayKey(new Date(now.getTime() - index * 86_400_000)),
  ).reverse();
}

async function runUpstashResult(command: Array<string | number>) {
  const url = getTrimmedEnv("UPSTASH_REDIS_REST_URL");
  const token = getTrimmedEnv("UPSTASH_REDIS_REST_TOKEN");

  if (!url || !token) {
    return null;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { result?: unknown };
    return payload.result ?? null;
  } catch (error) {
    console.error("funnel.upstash_result_failed", {
      command: command[0],
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

function toCount(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export async function recordToolDownload(
  toolSlug: string,
  source: string | null,
) {
  const day = getReportDayKey(new Date());
  const event = {
    event: "tool_download",
    toolSlug,
    source,
    at: new Date().toISOString(),
  };

  const counters = [
    `wappkit:downloads:${toolSlug}:total`,
    `wappkit:downloads:${toolSlug}:day:${day}`,
  ];

  const results = await Promise.all(
    counters.map((key) => runUpstash(["INCR", key])),
  );
  const stored = results.some(Boolean);

  if (stored) {
    await runUpstash([
      "LPUSH",
      `wappkit:downloads:${toolSlug}:events`,
      JSON.stringify(event),
    ]);
    await runUpstash([
      "LTRIM",
      `wappkit:downloads:${toolSlug}:events`,
      0,
      499,
    ]);
    return;
  }

  console.log("funnel.tool_download", event);
}

export type ToolDownloadStats = {
  toolSlug: string;
  total: number;
  last30: number;
  days: Array<{ date: string; count: number }>;
};

export async function getToolDownloadStats(
  toolSlug: string,
  days = 30,
): Promise<ToolDownloadStats> {
  const keys = getRecentDayKeys(days);
  const [totalRaw, dailyRaw] = await Promise.all([
    runUpstashResult(["GET", `wappkit:downloads:${toolSlug}:total`]),
    runUpstashResult([
      "MGET",
      ...keys.map((date) => `wappkit:downloads:${toolSlug}:day:${date}`),
    ]),
  ]);

  const dailyValues = Array.isArray(dailyRaw) ? dailyRaw : [];
  const rows = keys.map((date, index) => ({
    date,
    count: toCount(dailyValues[index]),
  }));

  return {
    toolSlug,
    total: toCount(totalRaw),
    last30: rows.reduce((sum, row) => sum + row.count, 0),
    days: rows,
  };
}

export async function recordCheckoutAttempt(attempt: CheckoutAttempt) {
  const day = getDayKey();
  const event = {
    event: "checkout_attempt",
    toolSlug: attempt.toolSlug,
    referer: attempt.referer,
    userAgent: attempt.userAgent,
    country: attempt.country,
    at: new Date().toISOString(),
  };

  const counters = [
    "wappkit:funnel:checkout_attempts:total",
    `wappkit:funnel:checkout_attempts:day:${day}`,
    `wappkit:funnel:checkout_attempts:tool:${attempt.toolSlug}`,
  ];

  const results = await Promise.all(
    counters.map((key) => runUpstash(["INCR", key])),
  );
  const stored = results.some(Boolean);

  if (stored) {
    await runUpstash([
      "LPUSH",
      "wappkit:funnel:checkout_events",
      JSON.stringify(event),
    ]);
    await runUpstash(["LTRIM", "wappkit:funnel:checkout_events", 0, 499]);
    return;
  }

  console.log("funnel.checkout_attempt", event);
}
