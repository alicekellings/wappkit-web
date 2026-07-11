import test from "node:test";
import assert from "node:assert/strict";

import {
  bindDeviceToLicenseKey,
  buildLicenseKeyLookupKey,
  buildLicenseLookupKey,
  createLicenseRecordFromCreemCheckout,
  createMemoryLicenseStore,
  findLicenseKeyRecord,
  getDeviceTransferEligibility,
  getLicenseStore,
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
  assert.ok(license?.lastDeviceTransferAt);
});

test("legacy licenses can move once before the 30-day cooldown starts", () => {
  const record = createLicenseRecordFromCreemCheckout(checkoutPayload);
  const license = findLicenseKeyRecord(record, "WAAP-KEY-123");

  assert.ok(license);
  assert.deepEqual(getDeviceTransferEligibility(license!), {
    allowed: true,
    nextTransferAt: null,
  });

  const transferAt = "2026-07-10T12:00:00.000Z";
  const moved = {
    ...license!,
    lastDeviceTransferAt: transferAt,
  };
  const blocked = getDeviceTransferEligibility(
    moved,
    Date.parse("2026-07-11T12:00:00.000Z"),
  );

  assert.equal(blocked.allowed, false);
  assert.equal(blocked.nextTransferAt, "2026-08-09T12:00:00.000Z");
});

test("memory license store lists saved records", async () => {
  const store = getLicenseStore();
  const firstRecord = createLicenseRecordFromCreemCheckout({
    ...checkoutPayload,
    id: "chk_list_1",
    request_id: "req_list_1",
    order: {
      id: "ord_list_1",
      customer: {
        id: "cus_list_1",
        email: "list-one@example.com",
        name: "List One",
      },
    },
    license_keys: [
      {
        id: "lic_list_1",
        key: "WAAP-LIST-1",
        status: "inactive",
      },
    ],
  });
  const secondRecord = createLicenseRecordFromCreemCheckout({
    ...checkoutPayload,
    id: "chk_list_2",
    request_id: "req_list_2",
    order: {
      id: "ord_list_2",
      customer: {
        id: "cus_list_2",
        email: "list-two@example.com",
        name: "List Two",
      },
    },
    license_keys: [
      {
        id: "lic_list_2",
        key: "WAAP-LIST-2",
        status: "inactive",
      },
    ],
  });

  await store.save(firstRecord);
  await store.save(secondRecord);

  const records = await store.listAllRecords();

  assert.ok(records.some((record) => record.orderId === "ord_list_1"));
  assert.ok(records.some((record) => record.orderId === "ord_list_2"));
});
