import { getTrimmedEnv } from "@/lib/env-utils";

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
  resetAt: number;
};

type MemoryBucket = {
  count: number;
  resetAt: number;
};

declare global {
  // eslint-disable-next-line no-var
  var __wappkitRateLimitBuckets__: Map<string, MemoryBucket> | undefined;
}

function getMemoryBuckets() {
  if (!globalThis.__wappkitRateLimitBuckets__) {
    globalThis.__wappkitRateLimitBuckets__ = new Map<string, MemoryBucket>();
  }

  return globalThis.__wappkitRateLimitBuckets__;
}

function createRateLimitResult(
  count: number,
  limit: number,
  resetAt: number,
): RateLimitResult {
  const remaining = Math.max(0, limit - count);
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));

  return {
    success: count <= limit,
    limit,
    remaining,
    retryAfterSeconds,
    resetAt,
  };
}

async function applyMemoryRateLimit(
  options: RateLimitOptions,
): Promise<RateLimitResult> {
  const buckets = getMemoryBuckets();
  const now = Date.now();
  const existing = buckets.get(options.key);

  if (!existing || existing.resetAt <= now) {
    const next = {
      count: 1,
      resetAt: now + options.windowMs,
    };

    buckets.set(options.key, next);

    return createRateLimitResult(next.count, options.limit, next.resetAt);
  }

  existing.count += 1;
  buckets.set(options.key, existing);

  return createRateLimitResult(existing.count, options.limit, existing.resetAt);
}

async function runUpstashCommand<T>(command: Array<string>) {
  const url = getTrimmedEnv("UPSTASH_REDIS_REST_URL");
  const token = getTrimmedEnv("UPSTASH_REDIS_REST_TOKEN");

  if (!url || !token) {
    return null;
  }

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
    throw new Error(`Upstash request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as { result?: T; error?: string };
  if (payload.error) {
    throw new Error(payload.error);
  }

  return (payload.result ?? null) as T | null;
}

async function applyUpstashRateLimit(
  options: RateLimitOptions,
): Promise<RateLimitResult | null> {
  const count = await runUpstashCommand<number>(["INCR", options.key]);

  if (count == null) {
    return null;
  }

  if (count === 1) {
    await runUpstashCommand(["PEXPIRE", options.key, String(options.windowMs)]);
  }

  const ttl = await runUpstashCommand<number>(["PTTL", options.key]);
  const resetAt =
    ttl && ttl > 0 ? Date.now() + ttl : Date.now() + options.windowMs;

  return createRateLimitResult(count, options.limit, resetAt);
}

export async function applyRateLimit(options: RateLimitOptions) {
  try {
    const upstashResult = await applyUpstashRateLimit(options);

    if (upstashResult) {
      return upstashResult;
    }
  } catch (error) {
    console.error("Rate limit fallback to memory store:", error);
  }

  return applyMemoryRateLimit(options);
}

export function buildRateLimitKey(namespace: string, identifier: string) {
  return `rate_limit:${namespace}:${identifier}`;
}
