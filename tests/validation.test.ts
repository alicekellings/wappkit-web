import assert from "node:assert/strict";
import test from "node:test";

import {
  checkoutRequestSchema,
  licenseLookupSchema,
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
