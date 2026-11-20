/**
 * Marketplace image auditing, pure functions only.
 *
 * Design constraint: this runs in the browser on files the user never uploads, so it
 * must be dependency-free and fast enough for a 20MP photo.
 *
 * Honesty constraint: a bounding-box scan cannot reproduce Amazon's human reviewer.
 * Pixel checks therefore report measurements plus a confidence band, and anything that
 * genuinely needs eyes is returned as a `manual` finding instead of a fake pass.
 */

import type { BackgroundRule, ImageSpec } from "./image-specs";

export type AuditStatus = "pass" | "fail" | "warn" | "manual";

export type Finding = {
  id: string;
  label: string;
  status: AuditStatus;
  detail: string;
};

export type RGB = [number, number, number];

export type PixelAnalysis = {
  /** Corner samples, useful to show the raw numbers when something looks white but isn't */
  corners: Array<{ label: string; rgb: RGB }>;
  /** Share of border-band samples that are not near-white, 0..1 */
  borderNonWhiteRatio: number;
  backgroundVerdict: "pure" | "near-white" | "not-white";
  /** Bounding box of non-background pixels, null when the image is entirely background */
  subjectBox: { left: number; top: number; right: number; bottom: number } | null;
  /** Bounding-box area divided by image area. Includes drop shadows — see note in fill finding. */
  fillRatio: number;
  /** How many pixels were actually sampled, so the UI can be honest about precision */
  sampledPixels: number;
};

/** A pixel counts as white when every channel is at or above this. */
const WHITE_CHANNEL_THRESHOLD = 250;
/**
 * How far a pixel must sit from the sampled backdrop before it counts as product.
 *
 * The earlier rule ("any channel below 240 is product") only worked on a pure white
 * backdrop. On a 238 grey studio background every pixel qualified, so the bounding box
 * became the whole frame and a near-empty photo was reported as "subject fills 100%".
 */
const SUBJECT_DELTA = 12;
/** Target number of sampled pixels; keeps a 20MP photo under ~50ms. */
const SAMPLE_BUDGET = 400_000;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatEdge(width: number, height: number): string {
  return `${width} × ${height} px`;
}

function sampleStride(width: number, height: number): number {
  const total = width * height;
  if (total <= SAMPLE_BUDGET) return 1;
  return Math.max(1, Math.floor(Math.sqrt(total / SAMPLE_BUDGET)));
}

function readPixel(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
): RGB {
  const offset = (y * width + x) * 4;
  return [data[offset], data[offset + 1], data[offset + 2]];
}

function isWhite(rgb: RGB): boolean {
  return (
    rgb[0] >= WHITE_CHANNEL_THRESHOLD &&
    rgb[1] >= WHITE_CHANNEL_THRESHOLD &&
    rgb[2] >= WHITE_CHANNEL_THRESHOLD
  );
}

/** Median resists a product that clips one edge, which a mean would drag toward. */
function median(values: number[]): number {
  if (values.length === 0) return 255;
  values.sort((a, b) => a - b);
  return values[Math.floor(values.length / 2)];
}

function isSubjectAgainst(rgb: RGB, backdrop: RGB): boolean {
  return (
    Math.abs(rgb[0] - backdrop[0]) > SUBJECT_DELTA ||
    Math.abs(rgb[1] - backdrop[1]) > SUBJECT_DELTA ||
    Math.abs(rgb[2] - backdrop[2]) > SUBJECT_DELTA
  );
}

/**
 * Measures background whiteness and the subject's bounding box.
 *
 * The border band is what marketplaces actually look at: a product can sit on white
 * paper with grey vignetting in the corners and still be rejected. Sampling the band
 * instead of the whole frame avoids letting the product itself count as "not white".
 *
 * That same band supplies the backdrop colour used to separate product from background,
 * which is why the fill estimate survives a grey or coloured backdrop.
 */
export function analyzePixels(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): PixelAnalysis {
  const stride = sampleStride(width, height);
  const bandX = Math.max(1, Math.floor(width * 0.02));
  const bandY = Math.max(1, Math.floor(height * 0.02));

  // Pass 1 — the border band only. It answers two questions: is the background white,
  // and what colour is it actually? The second answer is what keeps a grey backdrop
  // from being read as one giant subject.
  const bandR: number[] = [];
  const bandG: number[] = [];
  const bandB: number[] = [];
  let borderSamples = 0;
  let borderNonWhite = 0;

  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      const inBand =
        x < bandX || y < bandY || x >= width - bandX || y >= height - bandY;
      if (!inBand) continue;

      const rgb = readPixel(data, width, x, y);
      bandR.push(rgb[0]);
      bandG.push(rgb[1]);
      bandB.push(rgb[2]);
      borderSamples += 1;
      if (!isWhite(rgb)) borderNonWhite += 1;
    }
  }

  const backdrop: RGB = [median(bandR), median(bandG), median(bandB)];

  // Pass 2 — subject bounds measured against that backdrop, so the same thresholds
  // work on white, grey and coloured backgrounds alike.
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  let sampled = 0;

  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      sampled += 1;
      if (!isSubjectAgainst(readPixel(data, width, x, y), backdrop)) continue;

      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  const cornerInset = Math.max(1, Math.floor(Math.min(width, height) * 0.03));
  const corners: PixelAnalysis["corners"] = [
    { label: "top-left", rgb: readPixel(data, width, cornerInset, cornerInset) },
    {
      label: "top-right",
      rgb: readPixel(data, width, width - 1 - cornerInset, cornerInset),
    },
    {
      label: "bottom-left",
      rgb: readPixel(data, width, cornerInset, height - 1 - cornerInset),
    },
    {
      label: "bottom-right",
      rgb: readPixel(data, width, width - 1 - cornerInset, height - 1 - cornerInset),
    },
  ];

  const borderNonWhiteRatio =
    borderSamples > 0 ? borderNonWhite / borderSamples : 0;

  const backgroundVerdict: PixelAnalysis["backgroundVerdict"] =
    borderNonWhiteRatio <= 0.01
      ? "pure"
      : borderNonWhiteRatio <= 0.05
        ? "near-white"
        : "not-white";

  const hasSubject = maxX >= 0 && maxY >= 0;
  const boxWidth = hasSubject ? maxX - minX + 1 : 0;
  const boxHeight = hasSubject ? maxY - minY + 1 : 0;
  const fillRatio =
    hasSubject && width > 0 && height > 0
      ? (boxWidth * boxHeight) / (width * height)
      : 0;

  return {
    corners,
    borderNonWhiteRatio,
    backgroundVerdict,
    subjectBox: hasSubject
      ? { left: minX, top: minY, right: maxX, bottom: maxY }
      : null,
    fillRatio,
    sampledPixels: sampled,
  };
}

export type AuditInput = {
  name: string;
  width: number;
  height: number;
  bytes: number;
  type: string;
};

const FORMAT_BY_MIME: Record<string, string> = {
  "image/jpeg": "JPEG",
  "image/jpg": "JPEG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "image/gif": "GIF",
  "image/tiff": "TIFF",
  "image/avif": "AVIF",
  "image/bmp": "BMP",
};

export function formatFromMime(type: string): string {
  return FORMAT_BY_MIME[type.toLowerCase()] ?? (type || "unknown");
}

/**
 * Checks the measurable rules. Background and fill come from `analyzePixels`, so this
 * part stays pure metadata — useful for a quick verdict before decoding a large file.
 */
export function auditMetadata(input: AuditInput, spec: ImageSpec): Finding[] {
  const findings: Finding[] = [];
  const longEdge = Math.max(input.width, input.height);
  const shortEdge = Math.min(input.width, input.height);
  const format = formatFromMime(input.type);

  if (spec.minLongEdge > 0) {
    findings.push({
      id: "min-edge",
      label: `Longest edge at least ${spec.minLongEdge} px`,
      status: longEdge >= spec.minLongEdge ? "pass" : "fail",
      detail:
        longEdge >= spec.minLongEdge
          ? `${longEdge} px, above the ${spec.minLongEdge} px minimum.`
          : `${longEdge} px is below the ${spec.minLongEdge} px minimum — this cannot be uploaded.`,
    });
  }

  findings.push({
    id: "max-edge",
    label: `Longest edge at most ${spec.maxLongEdge} px`,
    status: longEdge <= spec.maxLongEdge ? "pass" : "fail",
    detail:
      longEdge <= spec.maxLongEdge
        ? `${longEdge} px, within the ceiling.`
        : `${longEdge} px exceeds the ${spec.maxLongEdge} px ceiling; downscale before upload.`,
  });

  const zoomThreshold = 1000;
  if (spec.minLongEdge > 0 && spec.minLongEdge < zoomThreshold) {
    findings.push({
      id: "zoom",
      label: "Long enough for zoom",
      status: longEdge >= zoomThreshold ? "pass" : "warn",
      detail:
        longEdge >= zoomThreshold
          ? `${longEdge} px clears the ${zoomThreshold} px zoom threshold.`
          : `${longEdge} px is accepted but below ${zoomThreshold} px, so buyers cannot zoom.`,
    });
  }

  const formatLabel = format.toUpperCase();
  const formatOk = spec.acceptedFormats.some((accepted) => {
    const normalized = accepted.toUpperCase();
    return (
      normalized.startsWith(formatLabel) ||
      formatLabel.startsWith(normalized.split(" ")[0])
    );
  });
  findings.push({
    id: "format",
    label: `Accepted format (${spec.acceptedFormats.join(", ")})`,
    status: formatOk ? "pass" : "fail",
    detail: formatOk
      ? `${format} is accepted.`
      : `${format} is not in the accepted list; export as ${spec.acceptedFormats[0]}.`,
  });

  findings.push({
    id: "bytes",
    label: `File size at most ${formatBytes(spec.maxBytes)}`,
    status: input.bytes <= spec.maxBytes ? "pass" : "fail",
    detail:
      input.bytes <= spec.maxBytes
        ? `${formatBytes(input.bytes)}, under the limit.`
        : `${formatBytes(input.bytes)} exceeds ${formatBytes(spec.maxBytes)}; compress before upload.`,
  });

  // Aspect ratio is a recommendation everywhere except where the platform publishes 1:1.
  const ratio = shortEdge > 0 ? longEdge / shortEdge : 0;
  const square = ratio > 0 && ratio <= 1.02;
  findings.push({
    id: "square",
    label: "1:1 square",
    status: square ? "pass" : "warn",
    detail: square
      ? "Square frame, which is how marketplaces display the slot."
      : `${input.width} × ${input.height} is not square (${ratio.toFixed(2)}:1). Non-square images get padded, making the product look smaller.`,
  });

  const recommendedLong = Math.max(spec.recommendedWidth, spec.recommendedHeight);
  findings.push({
    id: "recommended",
    label: `Recommended ${spec.recommendedWidth} × ${spec.recommendedHeight}`,
    status: longEdge >= recommendedLong ? "pass" : "warn",
    detail:
      longEdge >= recommendedLong
        ? `${longEdge} px meets the recommended working size.`
        : `${longEdge} px is below the ${recommendedLong} px working size. It may be accepted, but it limits detail at zoom.`,
  });

  return findings;
}

/** Background and fill findings derived from the pixel scan. */
export function auditPixels(
  analysis: PixelAnalysis,
  spec: ImageSpec,
  options: { backgroundAvailable: boolean },
): Finding[] {
  const findings: Finding[] = [];
  const rule: BackgroundRule = spec.background;

  if (!options.backgroundAvailable) {
    findings.push({
      id: "background",
      label: "Background purity",
      status: "manual",
      detail:
        "This image is too large to scan quickly. Resize it below 20MP or check the background with a colour picker.",
    });
  } else if (rule === "any") {
    findings.push({
      id: "background",
      label: "Background",
      status: "pass",
      detail: `${spec.platform} does not enforce a background colour for this slot.`,
    });
  } else {
    const verdict = analysis.backgroundVerdict;
    const ratioPct = (analysis.borderNonWhiteRatio * 100).toFixed(1);
    if (verdict === "pure") {
      findings.push({
        id: "background",
        label:
          rule === "pure-white"
            ? "Pure white background (RGB 255,255,255)"
            : "White or light background",
        status: "pass",
        detail: `Border band is ${(100 - analysis.borderNonWhiteRatio * 100).toFixed(1)}% white — every sampled corner reads 255-ish.`,
      });
    } else if (verdict === "near-white") {
      findings.push({
        id: "background",
        label:
          rule === "pure-white"
            ? "Pure white background (RGB 255,255,255)"
            : "White or light background",
        status: rule === "pure-white" ? "fail" : "warn",
        detail: `${ratioPct}% of the border band is off-white. ${
          rule === "pure-white"
            ? "Amazon and Walmart reject anything that is not exactly 255, so lift the whites before uploading."
            : "Light enough for this platform, but the edge is not clean."
        }`,
      });
    } else {
      findings.push({
        id: "background",
        label:
          rule === "pure-white"
            ? "Pure white background (RGB 255,255,255)"
            : "White or light background",
        status: "fail",
        detail: `${ratioPct}% of the border band is not white — this background will be rejected for ${
          spec.platform
        }'s ${spec.surface.toLowerCase()}.`,
      });
    }
  }

  if (spec.fillRatioMin) {
    if (!options.backgroundAvailable || !analysis.subjectBox) {
      findings.push({
        id: "fill",
        label: `Product fills about ${Math.round(spec.fillRatioMin * 100)}% of the frame`,
        status: "manual",
        detail: "Could not detect a subject against the background. Check framing by eye.",
      });
    } else {
      // Marketplaces describe fill as a linear dimension ("product fills 85% of the
      // frame"), but a bounding box gives area. A square subject at 85% width covers
      // 0.85^2 = 72% of the area, so convert back before comparing, otherwise every
      // compliant image looks undersized.
      const linearFill = Math.sqrt(analysis.fillRatio);
      const linearPct = linearFill * 100;
      const targetPct = spec.fillRatioMin * 100;
      // The box includes drop shadows and stray marks, so judge in bands rather than
      // pretending to reproduce the platform's own reviewer.
      const status: AuditStatus =
        linearFill >= spec.fillRatioMin * 0.92
          ? "pass"
          : linearFill >= spec.fillRatioMin * 0.7
            ? "warn"
            : "fail";
      findings.push({
        id: "fill",
        label: `Product fills about ${Math.round(targetPct)}% of the frame`,
        status,
        detail:
          status === "pass"
            ? `Subject spans about ${linearPct.toFixed(0)}% of the frame across its longest side — at the ${Math.round(targetPct)}% target.`
            : status === "warn"
              ? `Subject spans about ${linearPct.toFixed(0)}% of the frame, under the ${Math.round(targetPct)}% target. Tighten the crop or the product looks weak in search results.`
              : `Subject spans only ${linearPct.toFixed(0)}% of the frame. ${spec.platform} expects around ${Math.round(targetPct)}%, so this reads as too much white space.`,
      });
    }
  }

  return findings;
}

export function manualFindings(spec: ImageSpec): Finding[] {
  return spec.manualChecks.map((check, index) => ({
    id: `manual-${index}`,
    label: "Needs a human check",
    status: "manual" as const,
    detail: check,
  }));
}

export function summarize(findings: Finding[]): {
  fail: number;
  warn: number;
  manual: number;
  pass: number;
  verdict: "ready" | "fixable" | "blocked";
} {
  const count = (status: AuditStatus) =>
    findings.filter((finding) => finding.status === status).length;
  const fail = count("fail");
  const warn = count("warn");
  const manual = count("manual");
  const pass = count("pass");
  return {
    fail,
    warn,
    manual,
    pass,
    verdict: fail === 0 && warn === 0 ? "ready" : fail === 0 ? "fixable" : "blocked",
  };
}

/** Longest edge of the export target, keeping the platform's recommended square. */
export function exportTarget(spec: ImageSpec): { width: number; height: number } {
  return { width: spec.recommendedWidth, height: spec.recommendedHeight };
}
