import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

import { POST } from "../app/api/license/validate/route";
import {
  createLicenseRecordFromCreemCheckout,
  getLicenseStore,
  type CreemCheckoutPayload,
} from "../lib/licenses";

const checkoutPayload: CreemCheckoutPayload = {
  id: "chk_validate_123",
  request_id: "req_validate_123",
  order: {
    id: "ord_validate_123",
    customer: {
      id: "cus_validate_123",
      email: "validate@example.com",
      name: "Validate User",
    },
  },
  product: {
    id: "prod_reddit_toolbox",
    name: "Reddit Toolbox",
  },
  license_keys: [
    {
      id: "lic_validate_123",
      key: "WAAP-VALIDATE-123",
      status: "inactive",
    },
  ],
  metadata: {
    toolSlug: "reddit-toolbox",
  },
};

test("license validate route returns a premium validation payload", async () => {
  const suffix = crypto.randomUUID();
  const store = getLicenseStore();
  const record = createLicenseRecordFromCreemCheckout({
    ...checkoutPayload,
    id: `chk_validate_${suffix}`,
    request_id: `req_validate_${suffix}`,
    order: {
      id: `ord_validate_${suffix}`,
      customer: {
        id: `cus_validate_${suffix}`,
        email: "validate@example.com",
        name: "Validate User",
      },
    },
    license_keys: [
      {
        id: `lic_validate_${suffix}`,
        key: `WAAP-VALIDATE-${suffix}`,
        status: "inactive",
      },
    ],
  });
  await store.save(record);

  const request = new Request("http://localhost/api/license/validate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "198.51.100.20",
    },
    body: JSON.stringify({
      licenseKey: record.licenseKeys[0]?.key.toLowerCase(),
      deviceId: "desktop_alpha",
      deviceName: "Alice Desktop",
      toolSlug: "reddit-toolbox",
    }),
  });

  const response = await POST(request as never);
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.valid, true);
  assert.equal(payload.data.toolSlug, "reddit-toolbox");
  assert.equal(payload.data.tier, "premium");
  assert.equal(payload.data.status, "active");
  assert.equal(payload.data.email, "validate@example.com");
  assert.equal(payload.data.productName, "Reddit Toolbox");
  assert.equal(payload.data.licenseKey, record.licenseKeys[0]?.key);
  assert.equal(payload.data.boundDevice.deviceId, "desktop_alpha");
  assert.equal(payload.data.boundDevice.deviceName, "Alice Desktop");
});
