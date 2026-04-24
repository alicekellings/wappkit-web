import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../app/api/internal/upstash-keepalive/route";

test("upstash keepalive rejects unauthorized requests", async () => {
  process.env.CRON_SECRET = "cron-secret";

  const response = await GET(
    new Request("http://localhost/api/internal/upstash-keepalive", {
      method: "GET",
    }) as never,
  );
  const payload = await response.json();

  assert.equal(response.status, 401);
  assert.equal(payload.error, "Unauthorized.");
});

test("upstash keepalive writes a marker with valid cron authorization", async () => {
  process.env.CRON_SECRET = "cron-secret";
  process.env.UPSTASH_REDIS_REST_URL = "https://example.upstash.io";
  process.env.UPSTASH_REDIS_REST_TOKEN = "token-value";
  process.env.VERCEL_ENV = "production";

  const originalFetch = globalThis.fetch;
  let capturedUrl: string | null = null;
  let capturedBody: string | null = null;
  globalThis.fetch = async (input, init) => {
    capturedUrl = String(input);
    capturedBody = String(init?.body ?? "");

    return new Response(
      JSON.stringify({
        result: "OK",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    ) as never;
  };

  try {
    const response = await GET(
      new Request("http://localhost/api/internal/upstash-keepalive", {
        method: "GET",
        headers: {
          authorization: "Bearer cron-secret",
        },
      }) as never,
    );
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.ok, true);
    assert.equal(capturedUrl, "https://example.upstash.io");
    assert.match(capturedBody ?? "", /system:upstash:keepalive:last_run/);
    assert.match(capturedBody ?? "", /production/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
