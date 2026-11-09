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

/**
 * 记录一笔真正付成的订单。
 *
 * 幂等很重要：Creem 会重放同一个 checkout.completed，license 那边靠 mergeAndSave 去重，
 * 计数器没有 merge 语义，所以先用 SADD 看这单是不是第一次见，只有返回 1 才 INCR。
 */
export async function recordPaidOrder(input: {
  orderId: string;
  toolSlug: string;
}) {
  const day = getDayKey();
  const event = {
    event: "paid_order",
    orderId: input.orderId,
    toolSlug: input.toolSlug,
    at: new Date().toISOString(),
  };

  const firstSeen = await runUpstashResult([
    "SADD",
    "wappkit:funnel:paid_orders:seen",
    input.orderId,
  ]);

  if (Number(firstSeen) !== 1) {
    // 未配置 Upstash（null）或这一单已经记过（0）
    if (firstSeen === null) {
      console.log("funnel.paid_order", event);
    }
    return false;
  }

  await Promise.all([
    runUpstash(["INCR", "wappkit:funnel:paid_orders:total"]),
    runUpstash(["INCR", `wappkit:funnel:paid_orders:day:${day}`]),
    runUpstash(["INCR", `wappkit:funnel:paid_orders:tool:${input.toolSlug}`]),
  ]);
  await runUpstash([
    "LPUSH",
    "wappkit:funnel:paid_events",
    JSON.stringify(event),
  ]);
  await runUpstash(["LTRIM", "wappkit:funnel:paid_events", 0, 499]);
  return true;
}

export type CheckoutEvent = {
  at: string;
  toolSlug: string;
  country: string | null;
  referer: string | null;
};

export type PaidOrderEvent = {
  at: string;
  orderId: string;
  toolSlug: string;
};

export type CheckoutStats = {
  total: number;
  last30: number;
  days: Array<{ date: string; count: number }>;
  tools: Array<{ toolSlug: string; count: number }>;
  events: CheckoutEvent[];
  paidTotal: number;
  paidLast30: number;
  paidDays: Array<{ date: string; count: number }>;
  paidOrders: PaidOrderEvent[];
  configured: boolean;
};

/**
 * 结账漏斗的读取端。
 *
 * 写入是 recordCheckoutAttempt（用户点购买、我们向 Creem 建单时触发），
 * 这里把三个计数器和明细列表读回来给 /ops/checkout 用。
 * toolSlugs 由调用方传入（页面从 lib/tools 拿），避免这里 import 出环。
 */
export async function getCheckoutStats(
  toolSlugs: string[],
  days = 30,
): Promise<CheckoutStats> {
  const keys = getRecentDayKeys(days);
  const [totalRaw, dailyRaw, toolRaw, eventsRaw, paidTotalRaw, paidDailyRaw, paidEventsRaw] =
    await Promise.all([
      runUpstashResult(["GET", "wappkit:funnel:checkout_attempts:total"]),
      runUpstashResult([
        "MGET",
        ...keys.map((date) => `wappkit:funnel:checkout_attempts:day:${date}`),
      ]),
      runUpstashResult([
        "MGET",
        ...toolSlugs.map((slug) => `wappkit:funnel:checkout_attempts:tool:${slug}`),
      ]),
      runUpstashResult(["LRANGE", "wappkit:funnel:checkout_events", 0, 49]),
      runUpstashResult(["GET", "wappkit:funnel:paid_orders:total"]),
      runUpstashResult([
        "MGET",
        ...keys.map((date) => `wappkit:funnel:paid_orders:day:${date}`),
      ]),
      runUpstashResult(["LRANGE", "wappkit:funnel:paid_events", 0, 49]),
    ]);

  const dailyValues = Array.isArray(dailyRaw) ? dailyRaw : [];
  const toolValues = Array.isArray(toolRaw) ? toolRaw : [];
  const rows = keys.map((date, index) => ({
    date,
    count: toCount(dailyValues[index]),
  }));

  const events: CheckoutEvent[] = [];
  if (Array.isArray(eventsRaw)) {
    for (const raw of eventsRaw) {
      try {
        const parsed = JSON.parse(String(raw)) as Record<string, unknown>;
        events.push({
          at: String(parsed.at ?? ""),
          toolSlug: String(parsed.toolSlug ?? "unknown"),
          country: parsed.country ? String(parsed.country) : null,
          referer: parsed.referer ? String(parsed.referer) : null,
        });
      } catch {
        // 坏掉的一行不影响整页
      }
    }
  }

  const paidValues = Array.isArray(paidDailyRaw) ? paidDailyRaw : [];
  const paidRows = keys.map((date, index) => ({
    date,
    count: toCount(paidValues[index]),
  }));

  const paidOrders: PaidOrderEvent[] = [];
  if (Array.isArray(paidEventsRaw)) {
    for (const raw of paidEventsRaw) {
      try {
        const parsed = JSON.parse(String(raw)) as Record<string, unknown>;
        paidOrders.push({
          at: String(parsed.at ?? ""),
          orderId: String(parsed.orderId ?? ""),
          toolSlug: String(parsed.toolSlug ?? "unknown"),
        });
      } catch {
        // 同上，坏行跳过
      }
    }
  }

  return {
    total: toCount(totalRaw),
    last30: rows.reduce((sum, row) => sum + row.count, 0),
    days: rows,
    tools: toolSlugs
      .map((slug, index) => ({ toolSlug: slug, count: toCount(toolValues[index]) }))
      .filter((row) => row.count > 0)
      .sort((a, b) => b.count - a.count),
    events,
    paidTotal: toCount(paidTotalRaw),
    paidLast30: paidRows.reduce((sum, row) => sum + row.count, 0),
    paidDays: paidRows,
    paidOrders,
    configured: totalRaw !== null,
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
