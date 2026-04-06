import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";

import { POST as searchPOST } from "../app/api/admin/license/search/route";
import { POST as unbindPOST } from "../app/api/admin/license/unbind/route";
import { POST as sessionPOST } from "../app/api/admin/session/route";
import { POST as validatePOST } from "../app/api/license/validate/route";
import {
  createLicenseRecordFromCreemCheckout,
  getLicenseStore,
  type CreemCheckoutPayload,
} from "../lib/licenses";

const checkoutPayload: CreemCheckoutPayload = {
  id: "chk_admin_123",
  request_id: "req_admin_123",
  order: {
    id: "ord_admin_123",
    customer: {
      id: "cus_admin_123",
      email: "admin@example.com",
      name: "Admin User",
    },
  },
  product: {
    id: "prod_reddit_toolbox",
    name: "Reddit Toolbox",
  },
  license_keys: [
    {
      id: "lic_admin_123",
      key: "WAAP-ADMIN-123",
      status: "inactive",
    },
  ],
  metadata: {
    toolSlug: "reddit-toolbox",
  },
};

test("admin session route sets the session cookie after a valid token", async () => {
  process.env.INTERNAL_ADMIN_TOKEN = "support-secret";

  const response = await sessionPOST(
    new Request("http://localhost/api/admin/session", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        token: " support-secret ",
      }),
    }) as never,
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("set-cookie") ?? "",
    /wappkit_admin_session=support-secret/i,
  );
});

test("admin search and unbind routes work with a valid admin session", async () => {
  process.env.INTERNAL_ADMIN_TOKEN = "support-secret";

  const suffix = crypto.randomUUID();
  const store = getLicenseStore();
  const record = createLicenseRecordFromCreemCheckout({
    ...checkoutPayload,
    id: `chk_admin_${suffix}`,
    request_id: `req_admin_${suffix}`,
    order: {
      id: `ord_admin_${suffix}`,
      customer: {
        id: `cus_admin_${suffix}`,
        email: "admin@example.com",
        name: "Admin User",
      },
    },
    license_keys: [
      {
        id: `lic_admin_${suffix}`,
        key: `WAAP-ADMIN-${suffix}`,
        status: "inactive",
      },
    ],
  });
  await store.save(record);

  await validatePOST(
    new Request("http://localhost/api/license/validate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "198.51.100.40",
      },
      body: JSON.stringify({
        licenseKey: record.licenseKeys[0]?.key,
        deviceId: "desktop_admin",
        deviceName: "Admin Desktop",
        toolSlug: "reddit-toolbox",
      }),
    }) as never,
  );

  const cookieHeader = "wappkit_admin_session=support-secret";

  const searchResponse = await searchPOST(
    new Request("http://localhost/api/admin/license/search", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        licenseKey: record.licenseKeys[0]?.key,
      }),
    }) as never,
  );
  const searchPayload = await searchResponse.json();

  assert.equal(searchResponse.status, 200);
  assert.equal(searchPayload.success, true);
  assert.equal(searchPayload.data.orderId, record.orderId);
  assert.equal(searchPayload.data.licenseKeys[0].boundDevice.deviceId, "desktop_admin");

  const unbindResponse = await unbindPOST(
    new Request("http://localhost/api/admin/license/unbind", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        licenseKey: record.licenseKeys[0]?.key,
      }),
    }) as never,
  );
  const unbindPayload = await unbindResponse.json();

  assert.equal(unbindResponse.status, 200);
  assert.equal(unbindPayload.success, true);
  assert.equal(unbindPayload.data.status, "inactive");
  assert.equal(unbindPayload.data.boundDevice, null);
});
