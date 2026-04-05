import assert from "node:assert/strict";
import test from "node:test";

import { applyRateLimit, buildRateLimitKey } from "../lib/rate-limit";

test("memory rate limit allows requests until the limit is reached", async () => {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  globalThis.__wappkitRateLimitBuckets__ = new Map();

  const key = buildRateLimitKey("license-retrieve", "198.51.100.10");

  const first = await applyRateLimit({
    key,
    limit: 2,
    windowMs: 60_000,
  });
  const second = await applyRateLimit({
    key,
    limit: 2,
    windowMs: 60_000,
  });
  const third = await applyRateLimit({
    key,
    limit: 2,
    windowMs: 60_000,
  });

  assert.equal(first.success, true);
  assert.equal(first.remaining, 1);
  assert.equal(second.success, true);
  assert.equal(second.remaining, 0);
  assert.equal(third.success, false);
  assert.equal(third.remaining, 0);
  assert.ok(third.retryAfterSeconds >= 1);
});
