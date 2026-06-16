import assert from "node:assert/strict";
import test from "node:test";

import { getRequestCountry, shouldBlockCountry } from "../lib/geo-block";

test("geo block accepts all country codes", () => {
  assert.equal(shouldBlockCountry("CN"), false);
  assert.equal(shouldBlockCountry("cn"), false);
  assert.equal(shouldBlockCountry("US"), false);
  assert.equal(shouldBlockCountry(null), false);
  assert.equal(shouldBlockCountry(""), false);
});

test("request country prefers Vercel country header", () => {
  const headers = new Headers({
    "x-vercel-ip-country": "US",
    "cf-ipcountry": "CN",
  });

  assert.equal(getRequestCountry(headers), "US");
});

test("request country falls back to Cloudflare country header", () => {
  const headers = new Headers({
    "cf-ipcountry": "cn",
  });

  assert.equal(getRequestCountry(headers), "CN");
});
