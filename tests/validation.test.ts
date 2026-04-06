import assert from "node:assert/strict";
import test from "node:test";

import {
  adminLicenseSearchSchema,
  adminLicenseUnbindSchema,
  adminSessionSchema,
  checkoutRequestSchema,
  licenseDeactivateSchema,
  licenseLookupSchema,
  licenseUnbindSchema,
  licenseValidateSchema,
} from "../lib/validations/license";

test("checkoutRequestSchema trims and normalizes input", () => {
  const parsed = checkoutRequestSchema.parse({
    toolSlug: " reddit-toolbox ",
    customerEmail: " Test@Example.com ",
  });

  assert.equal(parsed.toolSlug, "reddit-toolbox");
  assert.equal(parsed.customerEmail, "test@example.com");
});

test("licenseLookupSchema trims and normalizes lookup fields", () => {
  const parsed = licenseLookupSchema.parse({
    orderId: " ord_ABC123 ",
    email: " Test@Example.com ",
  });

  assert.equal(parsed.orderId, "ord_ABC123");
  assert.equal(parsed.email, "test@example.com");
});

test("licenseLookupSchema rejects unsafe order identifiers", () => {
  assert.throws(() =>
    licenseLookupSchema.parse({
      orderId: "<script>alert(1)</script>",
      email: "test@example.com",
    }),
  );
});

test("licenseValidateSchema trims device-aware activation fields", () => {
  const parsed = licenseValidateSchema.parse({
    licenseKey: " WAAP-KEY-123 ",
    deviceId: " device_abc123 ",
    deviceName: " Alice Laptop ",
    toolSlug: " reddit-toolbox ",
  });

  assert.equal(parsed.licenseKey, "WAAP-KEY-123");
  assert.equal(parsed.deviceId, "device_abc123");
  assert.equal(parsed.deviceName, "Alice Laptop");
  assert.equal(parsed.toolSlug, "reddit-toolbox");
});

test("licenseDeactivateSchema requires a safe device id", () => {
  assert.throws(() =>
    licenseDeactivateSchema.parse({
      licenseKey: "WAAP-KEY-123",
      deviceId: "<bad>",
      toolSlug: "reddit-toolbox",
    }),
  );
});

test("licenseUnbindSchema trims a self-serve unbind request", () => {
  const parsed = licenseUnbindSchema.parse({
    orderId: " ord_ABC123 ",
    email: " Test@Example.com ",
    licenseKey: " WAAP-KEY-123 ",
  });

  assert.equal(parsed.orderId, "ord_ABC123");
  assert.equal(parsed.email, "test@example.com");
  assert.equal(parsed.licenseKey, "WAAP-KEY-123");
});

test("adminSessionSchema trims the admin token", () => {
  const parsed = adminSessionSchema.parse({
    token: " support-secret ",
  });

  assert.equal(parsed.token, "support-secret");
});

test("adminLicenseSearchSchema accepts order plus email lookups", () => {
  const parsed = adminLicenseSearchSchema.parse({
    orderId: " ord_ABC123 ",
    email: " Test@Example.com ",
  });

  assert.equal(parsed.orderId, "ord_ABC123");
  assert.equal(parsed.email, "test@example.com");
});

test("adminLicenseSearchSchema requires either an order id or a license key", () => {
  assert.throws(() =>
    adminLicenseSearchSchema.parse({
      email: "test@example.com",
    }),
  );
});

test("adminLicenseUnbindSchema trims the target license key", () => {
  const parsed = adminLicenseUnbindSchema.parse({
    licenseKey: " WAAP-KEY-123 ",
  });

  assert.equal(parsed.licenseKey, "WAAP-KEY-123");
});
