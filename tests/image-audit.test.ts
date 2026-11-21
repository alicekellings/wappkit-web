import assert from "node:assert/strict";
import test from "node:test";

import {
  analyzePixels,
  auditMetadata,
  auditPixels,
  formatBytes,
  summarize,
} from "../lib/image-audit";
import { IMAGE_SPECS, getImageSpec } from "../lib/image-specs";

type RGB = [number, number, number];

/**
 * Builds an RGBA buffer from a per-pixel function.
 * Kept small on purpose: the algorithm is resolution-independent, so 200x200 proves the
 * same thing as 2000x2000 while keeping the test fast.
 */
function makeImage(
  width: number,
  height: number,
  paint: (x: number, y: number) => RGB,
): Uint8ClampedArray {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const [r, g, b] = paint(x, y);
      const offset = (y * width + x) * 4;
      data[offset] = r;
      data[offset + 1] = g;
      data[offset + 2] = b;
      data[offset + 3] = 255;
    }
  }
  return data;
}

const WHITE: RGB = [255, 255, 255];

test("all-white image reads as pure white with no subject", () => {
  const data = makeImage(200, 200, () => WHITE);
  const analysis = analyzePixels(data, 200, 200);

  assert.equal(analysis.backgroundVerdict, "pure");
  assert.equal(analysis.subjectBox, null);
  assert.equal(analysis.fillRatio, 0);
  assert.equal(analysis.borderNonWhiteRatio, 0);
  // every sampled corner must be exact white
  for (const corner of analysis.corners) {
    assert.deepEqual(corner.rgb, [255, 255, 255]);
  }
});

test("bounding box of a centred subject matches its real area", () => {
  // 200x200 canvas, dark block from (15,15) to (184,184) inclusive => 170x170
  const data = makeImage(200, 200, (x, y) =>
    x >= 15 && x <= 184 && y >= 15 && y <= 184 ? [20, 20, 20] : WHITE,
  );
  const analysis = analyzePixels(data, 200, 200);

  assert.ok(analysis.subjectBox);
  assert.equal(analysis.subjectBox!.left, 15);
  assert.equal(analysis.subjectBox!.top, 15);
  assert.equal(analysis.subjectBox!.right, 184);
  assert.equal(analysis.subjectBox!.bottom, 184);

  const expected = (170 * 170) / (200 * 200);
  assert.ok(
    Math.abs(analysis.fillRatio - expected) < 0.001,
    `fill ratio ${analysis.fillRatio} should be ~${expected}`,
  );
  // subject never touches the border band, so the background must still read pure
  assert.equal(analysis.backgroundVerdict, "pure");
});

test("grey 245 border is not accepted as pure white", () => {
  const data = makeImage(200, 200, (x, y) => {
    const inBand = x < 4 || y < 4 || x >= 196 || y >= 196;
    return inBand ? [245, 245, 245] : WHITE;
  });
  const analysis = analyzePixels(data, 200, 200);

  assert.ok(analysis.borderNonWhiteRatio > 0.99);
  assert.equal(analysis.backgroundVerdict, "not-white");
});

test("near-white 252 still counts as white", () => {
  const data = makeImage(200, 200, (x, y) => {
    const inBand = x < 4 || y < 4 || x >= 196 || y >= 196;
    return inBand ? [252, 252, 252] : WHITE;
  });
  const analysis = analyzePixels(data, 200, 200);

  assert.equal(analysis.backgroundVerdict, "pure");
});

test("metadata audit fails an undersized image for Amazon", () => {
  const spec = getImageSpec("amazon-main-image");
  assert.ok(spec);

  const findings = auditMetadata(
    { name: "small.jpg", width: 400, height: 400, bytes: 80_000, type: "image/jpeg" },
    spec!,
  );
  const minEdge = findings.find((finding) => finding.id === "min-edge");
  assert.equal(minEdge?.status, "fail");

  const zoom = findings.find((finding) => finding.id === "zoom");
  assert.equal(zoom?.status, "warn");

  const verdict = summarize(findings);
  assert.equal(verdict.verdict, "blocked");
});

test("metadata audit passes a 2000px JPEG under the size limit", () => {
  const spec = getImageSpec("amazon-main-image");
  const findings = auditMetadata(
    {
      name: "hero.jpg",
      width: 2000,
      height: 2000,
      bytes: 900_000,
      type: "image/jpeg",
    },
    spec!,
  );

  assert.equal(findings.find((finding) => finding.id === "min-edge")?.status, "pass");
  assert.equal(findings.find((finding) => finding.id === "format")?.status, "pass");
  assert.equal(findings.find((finding) => finding.id === "bytes")?.status, "pass");
  assert.equal(findings.find((finding) => finding.id === "square")?.status, "pass");
});

test("WebP is rejected where the platform only accepts JPEG or PNG", () => {
  const spec = getImageSpec("amazon-main-image");
  const findings = auditMetadata(
    {
      name: "hero.webp",
      width: 2000,
      height: 2000,
      bytes: 400_000,
      type: "image/webp",
    },
    spec!,
  );
  assert.equal(findings.find((finding) => finding.id === "format")?.status, "fail");
});

test("oversized file is flagged before upload", () => {
  const spec = getImageSpec("temu-product-image");
  const findings = auditMetadata(
    {
      name: "big.jpg",
      width: 1200,
      height: 1200,
      bytes: 5 * 1024 * 1024,
      type: "image/jpeg",
    },
    spec!,
  );
  assert.equal(findings.find((finding) => finding.id === "bytes")?.status, "fail");
});

test("fill ratio bands: 72% passes, 60% warns, 30% fails", () => {
  const spec = getImageSpec("amazon-main-image");
  assert.ok(spec);

  const buildWithFill = (side: number) => {
    const start = Math.floor((200 - side) / 2);
    const end = start + side - 1;
    return makeImage(200, 200, (x, y) =>
      x >= start && x <= end && y >= start && y <= end ? [10, 10, 10] : WHITE,
    );
  };

  const cases: Array<{ side: number; expected: string }> = [
    { side: 170, expected: "pass" }, // 72.25%
    { side: 155, expected: "warn" }, // 60.06%
    { side: 110, expected: "fail" }, // 30.25%
  ];

  for (const item of cases) {
    const analysis = analyzePixels(buildWithFill(item.side), 200, 200);
    const findings = auditPixels(analysis, spec!, { backgroundAvailable: true });
    const fill = findings.find((finding) => finding.id === "fill");
    assert.equal(
      fill?.status,
      item.expected,
      `fill side ${item.side} (${(analysis.fillRatio * 100).toFixed(1)}%) should be ${item.expected}`,
    );
  }
});

test("platforms without a fill rule produce no fill finding", () => {
  const spec = getImageSpec("shopify-product-image");
  const analysis = analyzePixels(makeImage(200, 200, () => WHITE), 200, 200);
  const findings = auditPixels(analysis, spec!, { backgroundAvailable: true });
  assert.equal(findings.find((finding) => finding.id === "fill"), undefined);
});

test("background rule 'any' always passes", () => {
  const spec = getImageSpec("shopify-product-image");
  const dark = makeImage(200, 200, () => [12, 34, 56]);
  const analysis = analyzePixels(dark, 200, 200);
  const findings = auditPixels(analysis, spec!, { backgroundAvailable: true });
  const background = findings.find((finding) => finding.id === "background");
  assert.equal(background?.status, "pass");
});

test("large file skips pixel scan and asks for a human check", () => {
  const spec = getImageSpec("amazon-main-image");
  const analysis = analyzePixels(makeImage(200, 200, () => WHITE), 200, 200);
  const findings = auditPixels(analysis, spec!, { backgroundAvailable: false });
  const background = findings.find((finding) => finding.id === "background");
  assert.equal(background?.status, "manual");
});

test("formatBytes uses readable units", () => {
  assert.equal(formatBytes(512), "512 B");
  assert.equal(formatBytes(2048), "2 KB");
  assert.equal(formatBytes(3 * 1024 * 1024), "3.00 MB");
});

test("a grey backdrop is not mistaken for one huge subject", () => {
  // Regression: the old rule treated every pixel below 240 as product, so a 238 grey
  // studio backdrop became a full-frame subject and fill was reported as 100%.
  const spec = getImageSpec("amazon-main-image");
  assert.ok(spec);

  const start = 15;
  const end = 184;
  const data = makeImage(200, 200, (x, y) =>
    x >= start && x <= end && y >= start && y <= end ? [196, 74, 52] : [238, 238, 238],
  );
  const analysis = analyzePixels(data, 200, 200);

  assert.ok(analysis.subjectBox);
  assert.equal(analysis.subjectBox!.left, 15);
  assert.equal(analysis.subjectBox!.right, 184);
  assert.ok(
    Math.abs(analysis.fillRatio - (170 * 170) / (200 * 200)) < 0.001,
    `fill ratio ${analysis.fillRatio} should measure the product, not the frame`,
  );

  const findings = auditPixels(analysis, spec!, { backgroundAvailable: true });
  // The backdrop is still wrong for Amazon, and the fill verdict still works.
  assert.equal(findings.find((finding) => finding.id === "background")?.status, "fail");
  assert.equal(findings.find((finding) => finding.id === "fill")?.status, "pass");
});

test("a nearly empty frame on grey is reported as undersized, not as 100% fill", () => {
  const spec = getImageSpec("amazon-main-image");
  assert.ok(spec);

  const start = 80;
  const end = 119;
  const data = makeImage(200, 200, (x, y) =>
    x >= start && x <= end && y >= start && y <= end ? [20, 20, 20] : [248, 248, 248],
  );
  const analysis = analyzePixels(data, 200, 200);

  assert.ok(analysis.fillRatio < 0.1, `fill ${analysis.fillRatio} should be small`);
  const fill = auditPixels(analysis, spec!, { backgroundAvailable: true }).find(
    (finding) => finding.id === "fill",
  );
  assert.equal(fill?.status, "fail");
});

test("Etsy's 1MB figure is guidance, so going over it warns instead of failing", () => {
  const spec = getImageSpec("etsy-listing-image");
  assert.ok(spec);

  const over = auditMetadata(
    { name: "big.jpg", width: 2000, height: 2000, bytes: 2 * 1024 * 1024, type: "image/jpeg" },
    spec!,
  );
  const overFinding = over.find((finding) => finding.id === "bytes");
  assert.equal(overFinding?.status, "warn");
  assert.equal(summarize(over).verdict, "fixable", "an advisory must not block the upload");

  const under = auditMetadata(
    { name: "ok.jpg", width: 2000, height: 2000, bytes: 800 * 1024, type: "image/jpeg" },
    spec!,
  );
  assert.equal(under.find((finding) => finding.id === "bytes")?.status, "pass");
});

test("a published hard cap still fails, unlike an advisory", () => {
  const spec = getImageSpec("amazon-main-image");
  assert.ok(spec);

  const findings = auditMetadata(
    {
      name: "huge.jpg",
      width: 2000,
      height: 2000,
      bytes: 11 * 1024 * 1024,
      type: "image/jpeg",
    },
    spec!,
  );
  assert.equal(findings.find((finding) => finding.id === "bytes")?.status, "fail");
});

test("every spec is internally consistent", () => {
  assert.ok(IMAGE_SPECS.length >= 8, "expect at least eight marketplace pages");
  const slugs = new Set<string>();
  for (const spec of IMAGE_SPECS) {
    assert.ok(!slugs.has(spec.slug), `duplicate slug ${spec.slug}`);
    slugs.add(spec.slug);

    assert.ok(spec.h1.length > 20, `${spec.slug} needs a real h1`);
    assert.ok(spec.metaDescription.length >= 120, `${spec.slug} meta too thin`);
    assert.ok(spec.source.url.startsWith("http"), `${spec.slug} needs a source url`);
    // A seller portal homepage is not a source: it either redirects to a login wall or
    // describes nothing. Every spec must point at the document that carries the numbers.
    assert.ok(
      !/^https?:\/\/[^/]+\/?$/.test(spec.source.url),
      `${spec.slug} source is a bare domain, not a document`,
    );
    assert.match(spec.lastVerified, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(spec.maxBytes > 0);
    assert.ok(spec.requirements.length >= 3, `${spec.slug} needs real requirements`);
    assert.ok(
      spec.recommendedWidth >= spec.minLongEdge,
      `${spec.slug} recommends less than its own minimum`,
    );
    if (spec.maxLongEdge !== undefined) {
      assert.ok(
        spec.maxLongEdge >= spec.recommendedWidth,
        `${spec.slug} ceiling is below the recommended size`,
      );
    }
  }
});

test("a platform with no published ceiling produces no ceiling finding", () => {
  // Walmart's guide states 2200 px and a 1500 px zoom floor, but no maximum. Inventing
  // 5,000 px would fail a 6,000 px photo Walmart accepts.
  const spec = getImageSpec("walmart-main-image");
  assert.ok(spec);
  assert.equal(spec!.maxLongEdge, undefined);

  const findings = auditMetadata(
    { name: "huge.jpg", width: 6000, height: 6000, bytes: 900_000, type: "image/jpeg" },
    spec!,
  );
  assert.equal(findings.find((finding) => finding.id === "max-edge"), undefined);
  assert.equal(summarize(findings).fail, 0, "a 6000 px Walmart photo must not be blocked");
});

test("Walmart zoom floor is 1500 px, not the 1000 px Amazon uses", () => {
  const spec = getImageSpec("walmart-main-image");
  assert.ok(spec);

  const findings = auditMetadata(
    { name: "mid.jpg", width: 1200, height: 1200, bytes: 900_000, type: "image/jpeg" },
    spec!,
  );
  const zoom = findings.find((finding) => finding.id === "zoom");
  assert.equal(zoom?.status, "warn", "1200 px does not reach Walmart's 1500 px zoom floor");
  assert.match(zoom!.detail, /1,?500/);
});

test("Etsy's 635 px is a search floor, not an upload minimum", () => {
  const spec = getImageSpec("etsy-listing-image");
  assert.ok(spec);
  assert.equal(spec!.minLongEdge, 0);

  const findings = auditMetadata(
    { name: "small.jpg", width: 500, height: 500, bytes: 90_000, type: "image/jpeg" },
    spec!,
  );
  assert.equal(findings.find((finding) => finding.id === "min-edge"), undefined);
  const advisory = findings.find((finding) => finding.id === "min-edge-advisory");
  assert.equal(advisory?.status, "warn");
  assert.equal(summarize(findings).fail, 0, "500 px uploads to Etsy; it only ranks lower");
});

test("eBay accepts a non-white background with a warning, not a rejection", () => {
  const spec = getImageSpec("ebay-photo");
  assert.ok(spec);
  assert.equal(spec!.backgroundAdvisory, true);

  const grey = analyzePixels(makeImage(200, 200, () => [238, 238, 238]), 200, 200);
  const findings = auditPixels(grey, spec!, { backgroundAvailable: true });
  const background = findings.find((finding) => finding.id === "background");
  assert.equal(background?.status, "warn", "eBay recommends a neutral backdrop, it does not enforce one");
  assert.equal(summarize([background!]).fail, 0);
});

test("TikTok Shop's 5MB belongs to video, so a 6MB image still passes", () => {
  const spec = getImageSpec("tiktok-shop-image");
  assert.ok(spec);
  assert.equal(spec!.maxBytes, 10 * 1024 * 1024);

  const findings = auditMetadata(
    { name: "six.jpg", width: 1200, height: 1200, bytes: 6 * 1024 * 1024, type: "image/jpeg" },
    spec!,
  );
  assert.equal(findings.find((finding) => finding.id === "bytes")?.status, "pass");

  const tooBig = auditMetadata(
    { name: "eleven.jpg", width: 1200, height: 1200, bytes: 11 * 1024 * 1024, type: "image/jpeg" },
    spec!,
  );
  assert.equal(tooBig.find((finding) => finding.id === "bytes")?.status, "fail");
});

test("HEIC from an iPhone is recognised where the platform accepts it", () => {
  for (const slug of ["ebay-photo", "shopify-product-image", "etsy-listing-image"]) {
    const spec = getImageSpec(slug);
    assert.ok(spec, `missing spec ${slug}`);
    const findings = auditMetadata(
      { name: "IMG_0001.heic", width: 2000, height: 2000, bytes: 900_000, type: "image/heic" },
      spec!,
    );
    assert.equal(
      findings.find((finding) => finding.id === "format")?.status,
      "pass",
      `${slug} should accept HEIC`,
    );
  }

  // Amazon does not take HEIC, so the failure has to survive there.
  const amazon = getImageSpec("amazon-main-image");
  const findings = auditMetadata(
    { name: "IMG_0001.heic", width: 2000, height: 2000, bytes: 900_000, type: "image/heic" },
    amazon!,
  );
  assert.equal(findings.find((finding) => finding.id === "format")?.status, "fail");
});

test("SVG and WebP are accepted where the platform lists them", () => {
  const shopify = getImageSpec("shopify-product-image");
  const webp = auditMetadata(
    { name: "art.webp", width: 2048, height: 2048, bytes: 500_000, type: "image/webp" },
    shopify!,
  );
  assert.equal(webp.find((finding) => finding.id === "format")?.status, "pass");

  const svg = auditMetadata(
    { name: "logo.svg", width: 2048, height: 2048, bytes: 40_000, type: "image/svg+xml" },
    shopify!,
  );
  assert.equal(svg.find((finding) => finding.id === "format")?.status, "pass");
});
