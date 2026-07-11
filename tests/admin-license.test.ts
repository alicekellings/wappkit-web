import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";

import { GET as listGET } from "../app/api/admin/license/list/route";
import { POST as createQaPOST } from "../app/api/admin/license/create-qa/route";
import { POST as searchPOST } from "../app/api/admin/license/search/route";
import { POST as statusPOST } from "../app/api/admin/license/status/route";
import { POST as unbindPOST } from "../app/api/admin/license/unbind/route";
import { POST as sessionPOST } from "../app/api/admin/session/route";
import { POST as validatePOST } from "../app/api/license/validate/route";
import {
  createLicenseRecordFromCreemCheckout,
  getLicenseStore,
  type CreemCheckoutPayload,
} from "../lib/licenses";

process.env.LICENSE_TOKEN_PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\\n" +
  "MC4CAQAwBQYDK2VwBCIEIK6v8VvlBPOfCea4nqYXeiWAbywbtvFzQzXqRMHLDMqR\\n" +
  "-----END PRIVATE KEY-----";

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

test("admin status route can disable and re-enable a license", async () => {
  process.env.INTERNAL_ADMIN_TOKEN = "support-secret";

  const suffix = crypto.randomUUID();
  const store = getLicenseStore();
  const record = createLicenseRecordFromCreemCheckout({
    ...checkoutPayload,
    id: `chk_admin_status_${suffix}`,
    request_id: `req_admin_status_${suffix}`,
    order: {
      id: `ord_admin_status_${suffix}`,
      customer: {
        id: `cus_admin_status_${suffix}`,
        email: "admin@example.com",
        name: "Admin User",
      },
    },
    license_keys: [
      {
        id: `lic_admin_status_${suffix}`,
        key: `WAAP-ADMIN-STATUS-${suffix}`,
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
        "x-forwarded-for": "198.51.100.41",
      },
      body: JSON.stringify({
        licenseKey: record.licenseKeys[0]?.key,
        deviceId: "desktop_status",
        deviceName: "Status Desktop",
        toolSlug: "reddit-toolbox",
      }),
    }) as never,
  );

  const cookieHeader = "wappkit_admin_session=support-secret";

  const disableResponse = await statusPOST(
    new Request("http://localhost/api/admin/license/status", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        licenseKey: record.licenseKeys[0]?.key,
        action: "disable",
      }),
    }) as never,
  );
  const disablePayload = await disableResponse.json();

  assert.equal(disableResponse.status, 200);
  assert.equal(disablePayload.success, true);
  assert.equal(disablePayload.data.status, "disabled");
  assert.equal(disablePayload.data.boundDevice, null);

  const enableResponse = await statusPOST(
    new Request("http://localhost/api/admin/license/status", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify({
        licenseKey: record.licenseKeys[0]?.key,
        action: "enable",
      }),
    }) as never,
  );
  const enablePayload = await enableResponse.json();

  assert.equal(enableResponse.status, 200);
  assert.equal(enablePayload.success, true);
  assert.equal(enablePayload.data.status, "inactive");
  assert.equal(enablePayload.data.boundDevice, null);
});

test("admin list route returns flattened license items and summary", async () => {
  process.env.INTERNAL_ADMIN_TOKEN = "support-secret";

  const suffix = crypto.randomUUID();
  const store = getLicenseStore();
  const record = createLicenseRecordFromCreemCheckout({
    ...checkoutPayload,
    id: `chk_admin_list_${suffix}`,
    request_id: `req_admin_list_${suffix}`,
    order: {
      id: `ord_admin_list_${suffix}`,
      customer: {
        id: `cus_admin_list_${suffix}`,
        email: "admin-list@example.com",
        name: "Admin List User",
      },
    },
    license_keys: [
      {
        id: `lic_admin_list_${suffix}`,
        key: `WAAP-ADMIN-LIST-${suffix}`,
        status: "inactive",
      },
    ],
  });
  await store.save(record);

  const response = await listGET(
    new Request("http://localhost/api/admin/license/list", {
      method: "GET",
      headers: {
        cookie: "wappkit_admin_session=support-secret",
      },
    }) as never,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.ok(Array.isArray(payload.data.items));
  assert.ok(
    payload.data.items.some(
      (item: { orderId: string }) => item.orderId === record.orderId,
    ),
  );
  assert.equal(typeof payload.data.summary.total, "number");
});

test("admin can create an internal QA license for activation testing", async () => {
  process.env.INTERNAL_ADMIN_TOKEN = "support-secret";

  const unauthorizedResponse = await createQaPOST(
    new Request("http://localhost/api/admin/license/create-qa", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        toolSlug: "ai-ecom-visual-studio",
      }),
    }) as never,
  );

  assert.equal(unauthorizedResponse.status, 401);

  const response = await createQaPOST(
    new Request("http://localhost/api/admin/license/create-qa", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "wappkit_admin_session=support-secret",
      },
      body: JSON.stringify({
        toolSlug: "ai-ecom-visual-studio",
      }),
    }) as never,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.toolSlug, "ai-ecom-visual-studio");
  assert.match(payload.data.licenseKey, /^WAPPKIT-AIECOM-/);

  const searchResponse = await searchPOST(
    new Request("http://localhost/api/admin/license/search", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "wappkit_admin_session=support-secret",
      },
      body: JSON.stringify({
        licenseKey: payload.data.licenseKey,
      }),
    }) as never,
  );
  const searchPayload = await searchResponse.json();

  assert.equal(searchResponse.status, 200);
  assert.equal(searchPayload.success, true);
  assert.equal(searchPayload.data.orderId, payload.data.orderId);

  const validateResponse = await validatePOST(
    new Request("http://localhost/api/license/validate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "198.51.100.42",
      },
      body: JSON.stringify({
        licenseKey: payload.data.licenseKey,
        deviceId: "desktop_qa",
        deviceName: "QA Desktop",
        toolSlug: "ai-ecom-visual-studio",
      }),
    }) as never,
  );
  const validatePayload = await validateResponse.json();

  assert.equal(validateResponse.status, 200);
  assert.equal(validatePayload.valid, true);
  assert.equal(validatePayload.data.toolSlug, "ai-ecom-visual-studio");
  assert.equal(validatePayload.data.boundDevice.deviceId, "desktop_qa");
});
