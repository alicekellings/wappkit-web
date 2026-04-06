import test from "node:test";
import assert from "node:assert/strict";

import {
  bindDeviceToLicenseKey,
  buildLicenseKeyLookupKey,
  buildLicenseLookupKey,
  createLicenseRecordFromCreemCheckout,
  createMemoryLicenseStore,
  findLicenseKeyRecord,
  normalizeLicenseEmail,
  normalizeLicenseKey,
  unbindDeviceFromLicenseKey,
  type CreemCheckoutPayload,
} from "../lib/licenses";

const checkoutPayload: CreemCheckoutPayload = {
  id: "chk_123",
  request_id: "req_123",
  order: {
    id: "ord_123",
    customer: {
      id: "cus_123",
      email: "Alice@Example.com",
      name: "Alice",
    },
  },
  product: {
    id: "prod_reddit_toolbox",
    name: "Reddit Toolbox",
  },
  license_keys: [
    {
      id: "lic_123",
      key: "WAAP-KEY-123",
      status: "active",
    },
  ],
  metadata: {
    toolSlug: "reddit-toolbox",
  },
};

test("normalizeLicenseEmail trims and lowercases purchase emails", () => {
  assert.equal(normalizeLicenseEmail(" Alice@Example.com "), "alice@example.com");
});

test("normalizeLicenseKey trims and uppercases license keys", () => {
  assert.equal(normalizeLicenseKey(" waap-key-123 "), "WAAP-KEY-123");
});

test("createLicenseRecordFromCreemCheckout maps checkout payload into a lookup-ready record", () => {
  const record = createLicenseRecordFromCreemCheckout(checkoutPayload);

  assert.equal(record.orderId, "ord_123");
  assert.equal(record.customerEmail, "alice@example.com");
  assert.equal(record.toolSlug, "reddit-toolbox");
  assert.equal(record.licenseKeys[0]?.key, "WAAP-KEY-123");
});

test("memory license store finds a record by order id plus purchase email", async () => {
  const store = createMemoryLicenseStore();
  const record = createLicenseRecordFromCreemCheckout(checkoutPayload);

  await store.save(record);
  const found = await store.findByOrderAndEmail({
    orderId: "ord_123",
    email: "alice@example.com",
  });

  assert.ok(found);
  assert.equal(found?.checkoutId, "chk_123");
  assert.equal(
    buildLicenseLookupKey("ord_123", "alice@example.com"),
    "license:lookup:alice@example.com:ord_123",
  );
});

test("memory license store returns null when email does not match the order", async () => {
  const store = createMemoryLicenseStore();
  const record = createLicenseRecordFromCreemCheckout(checkoutPayload);

  await store.save(record);
  const found = await store.findByOrderAndEmail({
    orderId: "ord_123",
    email: "wrong@example.com",
  });

  assert.equal(found, null);
});

test("memory license store finds a record by license key", async () => {
  const store = createMemoryLicenseStore();
  const record = createLicenseRecordFromCreemCheckout(checkoutPayload);

  await store.save(record);
  const found = await store.findByLicenseKey({
    licenseKey: "waap-key-123",
    toolSlug: "reddit-toolbox",
  });

  assert.ok(found);
  assert.equal(found?.orderId, "ord_123");
  assert.equal(
    buildLicenseKeyLookupKey("WAAP-KEY-123"),
    "license:key:WAAP-KEY-123",
  );
});

test("bindDeviceToLicenseKey stores a single active device on the key", () => {
  const record = createLicenseRecordFromCreemCheckout(checkoutPayload);
  const updated = bindDeviceToLicenseKey(record, "WAAP-KEY-123", {
    deviceId: "device_123",
    deviceName: "Alice Laptop",
  });

  assert.ok(updated);
  const license = findLicenseKeyRecord(updated!, "WAAP-KEY-123");
  assert.equal(license?.status, "active");
  assert.equal(license?.boundDevice?.deviceId, "device_123");
  assert.equal(license?.boundDevice?.deviceName, "Alice Laptop");
});

test("unbindDeviceFromLicenseKey clears the device binding", () => {
  const record = createLicenseRecordFromCreemCheckout(checkoutPayload);
  const bound = bindDeviceToLicenseKey(record, "WAAP-KEY-123", {
    deviceId: "device_123",
    deviceName: "Alice Laptop",
  });
  const unbound = unbindDeviceFromLicenseKey(bound!, "WAAP-KEY-123");

  assert.ok(unbound);
  const license = findLicenseKeyRecord(unbound!, "WAAP-KEY-123");
  assert.equal(license?.status, "inactive");
  assert.equal(license?.boundDevice ?? null, null);
});
