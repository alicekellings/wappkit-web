import assert from "node:assert/strict";
import test from "node:test";

import { POST } from "../app/api/webhook/creem/route";

test("production webhook ignores Creem test events", async () => {
  process.env.CREEM_TEST_MODE = "false";
  process.env.CREEM_WEBHOOK_SECRET = "whsec_test_secret";

  const body = JSON.stringify({
    id: "evt_test_123",
    eventType: "checkout.completed",
    created_at: Date.now(),
    object: {
      id: "ch_test_123",
      mode: "test",
    },
  });

  const crypto = await import("node:crypto");
  const signature = crypto
    .createHmac("sha256", process.env.CREEM_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  const request = new Request("http://localhost/api/webhook/creem", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "creem-signature": signature,
    },
    body,
  });

  const response = await POST(request as any);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.ignored, true);
});
