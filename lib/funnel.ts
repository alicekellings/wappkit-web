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
