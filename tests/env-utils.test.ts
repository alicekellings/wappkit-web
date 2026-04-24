import assert from "node:assert/strict";
import test from "node:test";

import { isTrimmedEnvFlagEnabled, normalizeEnvValue } from "../lib/env-utils";

test("normalizeEnvValue strips surrounding whitespace and hidden characters", () => {
  assert.equal(
    normalizeEnvValue("\u200B  https://example.com/path/ \uFEFF"),
    "https://example.com/path/",
  );
});

test("isTrimmedEnvFlagEnabled accepts trimmed mixed-case true values", () => {
  process.env.CREEM_TEST_MODE = "\u200B True \uFEFF";

  assert.equal(isTrimmedEnvFlagEnabled("CREEM_TEST_MODE"), true);
});
