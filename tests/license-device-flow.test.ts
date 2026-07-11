import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";

import { POST as deactivatePOST } from "../app/api/license/deactivate/route";
import { POST as unbindPOST } from "../app/api/license/unbind/route";
import { POST as validatePOST } from "../app/api/license/validate/route";
import {
  createLicenseRecordFromCreemCheckout,
  getLicenseStore,
  type CreemCheckoutPayload,
} from "../lib/licenses";

const TEST_PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\\n" +
  "MC4CAQAwBQYDK2VwBCIEIK6v8VvlBPOfCea4nqYXeiWAbywbtvFzQzXqRMHLDMqR\\n" +
  "-----END PRIVATE KEY-----";

process.env.LICENSE_TOKEN_PRIVATE_KEY = TEST_PRIVATE_KEY;

const checkoutPayload: CreemCheckoutPayload = {
  id: "chk_device_123",
  request_id: "req_device_123",
  order: {
    id: "ord_device_123",
    customer: {
      id: "cus_device_123",
      email: "device@example.com",
      name: "Device User",
    },
  },
  product: {
    id: "prod_reddit_toolbox",
    name: "Reddit Toolbox",
  },
  license_keys: [
    {
      id: "lic_device_123",
      key: "WAAP-DEVICE-123",
      status: "inactive",
    },
  ],
  metadata: {
    toolSlug: "reddit-toolbox",
  },
};

test("license validation rejects a second device until the current one is unbound", async () => {
  const suffix = crypto.randomUUID();
  const store = getLicenseStore();
  const record = createLicenseRecordFromCreemCheckout({
    ...checkoutPayload,
    id: `chk_device_${suffix}`,
    request_id: `req_device_${suffix}`,
    order: {
      id: `ord_device_${suffix}`,
      customer: {
        id: `cus_device_${suffix}`,
        email: "device@example.com",
        name: "Device User",
      },
    },
    license_keys: [
      {
        id: `lic_device_${suffix}`,
        key: `WAAP-DEVICE-${suffix}`,
        status: "inactive",
      },
    ],
  });
  await store.save(record);

  const firstResponse = await validatePOST(
    new Request("http://localhost/api/license/validate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "198.51.100.30",
      },
      body: JSON.stringify({
        licenseKey: record.licenseKeys[0]?.key,
        deviceId: "desktop_alpha",
        deviceName: "Alpha Desktop",
        toolSlug: "reddit-toolbox",
      }),
    }) as never,
  );
  assert.equal(firstResponse.status, 200);

  const secondResponse = await validatePOST(
    new Request("http://localhost/api/license/validate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "198.51.100.31",
      },
      body: JSON.stringify({
        licenseKey: record.licenseKeys[0]?.key,
        deviceId: "desktop_beta",
        deviceName: "Beta Desktop",
        toolSlug: "reddit-toolbox",
      }),
    }) as never,
  );
  const secondPayload = await secondResponse.json();

  assert.equal(secondResponse.status, 409);
  assert.equal(secondPayload.valid, false);
  assert.equal(secondPayload.code, "DEVICE_ALREADY_BOUND");
  assert.equal(secondPayload.data.boundDevice.deviceId, "desktop_alpha");
});

test("license deactivate route removes the current device binding", async () => {
  const suffix = crypto.randomUUID();
  const store = getLicenseStore();
  const record = createLicenseRecordFromCreemCheckout({
    ...checkoutPayload,
    id: `chk_deactivate_${suffix}`,
    request_id: `req_deactivate_${suffix}`,
    order: {
      id: `ord_deactivate_${suffix}`,
      customer: {
        id: `cus_deactivate_${suffix}`,
        email: "device@example.com",
        name: "Device User",
      },
    },
    license_keys: [
      {
        id: `lic_deactivate_${suffix}`,
        key: `WAAP-DEACTIVATE-${suffix}`,
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
        "x-forwarded-for": "198.51.100.32",
      },
      body: JSON.stringify({
        licenseKey: record.licenseKeys[0]?.key,
        deviceId: "desktop_alpha",
        deviceName: "Alpha Desktop",
        toolSlug: "reddit-toolbox",
      }),
    }) as never,
  );

  const response = await deactivatePOST(
    new Request("http://localhost/api/license/deactivate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "198.51.100.33",
      },
      body: JSON.stringify({
        licenseKey: record.licenseKeys[0]?.key,
        deviceId: "desktop_alpha",
        toolSlug: "reddit-toolbox",
      }),
    }) as never,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.status, "inactive");
  assert.equal(payload.data.boundDevice, null);
});

test("license move clears the active device, activates the new device, and enforces cooldown", async () => {
  const suffix = crypto.randomUUID();
  const store = getLicenseStore();
  const record = createLicenseRecordFromCreemCheckout({
    ...checkoutPayload,
    id: `chk_unbind_${suffix}`,
    request_id: `req_unbind_${suffix}`,
    order: {
      id: `ord_unbind_${suffix}`,
      customer: {
        id: `cus_unbind_${suffix}`,
        email: "device@example.com",
        name: "Device User",
      },
    },
    license_keys: [
      {
        id: `lic_unbind_${suffix}`,
        key: `WAAP-UNBIND-${suffix}`,
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
        "x-forwarded-for": "198.51.100.34",
      },
      body: JSON.stringify({
        licenseKey: record.licenseKeys[0]?.key,
        deviceId: "desktop_alpha",
        deviceName: "Alpha Desktop",
        toolSlug: "reddit-toolbox",
      }),
    }) as never,
  );

  const response = await unbindPOST(
    new Request("http://localhost/api/license/unbind", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "198.51.100.35",
      },
      body: JSON.stringify({
        orderId: record.orderId,
        email: record.customerEmail,
        licenseKey: record.licenseKeys[0]?.key,
      }),
    }) as never,
  );
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.status, "inactive");
  assert.equal(payload.data.boundDevice, null);
  assert.ok(payload.data.lastDeviceTransferAt);

  const secondActivationResponse = await validatePOST(
    new Request("http://localhost/api/license/validate", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "198.51.100.36",
      },
      body: JSON.stringify({
        licenseKey: record.licenseKeys[0]?.key,
        deviceId: "desktop_beta",
        deviceName: "Beta Desktop",
        toolSlug: "reddit-toolbox",
      }),
    }) as never,
  );
  assert.equal(secondActivationResponse.status, 200);

  const cooldownResponse = await unbindPOST(
    new Request("http://localhost/api/license/unbind", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "198.51.100.37",
      },
      body: JSON.stringify({
        orderId: record.orderId,
        email: record.customerEmail,
        licenseKey: record.licenseKeys[0]?.key,
      }),
    }) as never,
  );
  const cooldownPayload = await cooldownResponse.json();

  assert.equal(cooldownResponse.status, 409);
  assert.equal(cooldownPayload.success, false);
  assert.equal(cooldownPayload.code, "DEVICE_TRANSFER_COOLDOWN");
  assert.ok(cooldownPayload.data.nextTransferAt);
});

test("license validation does not bind a device when token signing is unavailable", async () => {
  const suffix = crypto.randomUUID();
  const store = getLicenseStore();
  const record = createLicenseRecordFromCreemCheckout({
    ...checkoutPayload,
    id: `chk_signing_${suffix}`,
    request_id: `req_signing_${suffix}`,
    order: {
      id: `ord_signing_${suffix}`,
      customer: {
        id: `cus_signing_${suffix}`,
        email: "device@example.com",
        name: "Device User",
      },
    },
    license_keys: [
      {
        id: `lic_signing_${suffix}`,
        key: `WAAP-SIGNING-${suffix}`,
        status: "inactive",
      },
    ],
  });
  await store.save(record);

  const savedPrivateKey = process.env.LICENSE_TOKEN_PRIVATE_KEY;
  delete process.env.LICENSE_TOKEN_PRIVATE_KEY;

  try {
    const response = await validatePOST(
      new Request("http://localhost/api/license/validate", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "198.51.100.38",
        },
        body: JSON.stringify({
          licenseKey: record.licenseKeys[0]?.key,
          deviceId: "desktop_signing",
          deviceName: "Signing Desktop",
          toolSlug: "reddit-toolbox",
        }),
      }) as never,
    );
    const payload = await response.json();

    assert.equal(response.status, 503);
    assert.equal(payload.valid, false);
    assert.equal(payload.code, "LICENSE_SIGNING_UNAVAILABLE");

    const savedRecord = await store.getByOrderId(record.orderId);
    assert.equal(savedRecord?.licenseKeys[0]?.boundDevice, null);
    assert.equal(savedRecord?.licenseKeys[0]?.status, "inactive");
  } finally {
    process.env.LICENSE_TOKEN_PRIVATE_KEY = savedPrivateKey;
  }
});
