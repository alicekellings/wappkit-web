"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Eye,
  ImageUp,
  Loader2,
  MinusCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  analyzePixels,
  auditMetadata,
  auditPixels,
  formatBytes,
  formatEdge,
  manualFindings,
  summarize,
  type AuditStatus,
  type Finding,
  type PixelAnalysis,
} from "@/lib/image-audit";
import { BACKGROUND_LABEL, type ImageSpec } from "@/lib/image-specs";

type FileState = {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  findings: Finding[];
  analysis: PixelAnalysis | null;
  scanning: boolean;
  exporting: boolean;
  exportedUrl?: string;
  exportedBytes?: number;
  exportedFormat?: string;
  error?: string;
};

/** Pixel scanning is capped so a 50MP frame does not freeze the tab. */
const MAX_SCAN_PIXELS = 40_000_000;
/** Pixel analysis runs on a downscaled copy; ratios survive the resize. */
const ANALYSIS_EDGE = 1200;

const STATUS_STYLE: Record<AuditStatus, { icon: typeof CheckCircle2; className: string; label: string }> = {
  pass: { icon: CheckCircle2, className: "text-emerald-600", label: "Pass" },
  warn: { icon: AlertTriangle, className: "text-amber-600", label: "Check" },
  fail: { icon: XCircle, className: "text-rose-600", label: "Fail" },
  manual: { icon: Eye, className: "text-slate-500", label: "Manual" },
};

async function decodeFile(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file);
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas export failed"));
      },
      type,
      quality,
    );
  });
}

async function scanPixels(bitmap: ImageBitmap): Promise<PixelAnalysis | null> {
  if (bitmap.width * bitmap.height > MAX_SCAN_PIXELS) return null;

  const scale = Math.min(1, ANALYSIS_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(bitmap, 0, 0, width, height);
  const { data } = ctx.getImageData(0, 0, width, height);
  return analyzePixels(data, width, height);
}

/**
 * Crops to a centred square, scales to the platform's recommended size, then binary
 * searches JPEG quality until the file fits the weight limit.
 *
 * It deliberately does NOT remove backgrounds: turning a grey studio backdrop into RGB
 * 255,255,255 needs a cut-out, and a canvas filter that "brightens" the background would
 * silently clip light products. The audit reports that case and points to the desktop app.
 */
async function exportCompliant(
  file: File,
  spec: ImageSpec,
): Promise<{ url: string; bytes: number; format: string }> {
  const bitmap = await decodeFile(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - side) / 2;
  const sy = (bitmap.height - side) / 2;

  const targetWidth = spec.recommendedWidth;
  const targetHeight = spec.recommendedHeight;

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser");

  // Fill first so transparent PNGs land on white instead of black.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  const wantsPng = spec.acceptedFormats.some((entry) => entry.startsWith("PNG"));
  const wantsJpeg = spec.acceptedFormats.some((entry) => entry.startsWith("JPEG"));
  const format = wantsJpeg ? "image/jpeg" : wantsPng ? "image/png" : "image/jpeg";

  if (format === "image/png") {
    let blob = await canvasToBlob(canvas, "image/png");
    if (blob.size > spec.maxBytes) {
      // PNG cannot be quality-tuned; fall back to JPEG only if the platform allows it.
      if (!wantsJpeg) throw new Error("PNG exceeds the size limit and this platform does not accept JPEG");
      blob = await canvasToBlob(canvas, "image/jpeg", 0.9);
    }
    return {
      url: URL.createObjectURL(blob),
      bytes: blob.size,
      format: blob.type === "image/png" ? "PNG" : "JPEG",
    };
  }

  let low = 0.45;
  let high = 0.95;
  let best: Blob | null = null;
  for (let step = 0; step < 7; step += 1) {
    const quality = (low + high) / 2;
    const blob = await canvasToBlob(canvas, format, quality);
    if (blob.size <= spec.maxBytes) {
      best = blob;
      low = quality;
    } else {
      high = quality;
    }
  }
  if (!best) {
    best = await canvasToBlob(canvas, format, 0.4);
  }
  return {
    url: URL.createObjectURL(best),
    bytes: best.size,
    format: format === "image/jpeg" ? "JPEG" : "WebP",
  };
}

export function ImageSpecTool({ spec }: { spec: ImageSpec }) {
  const [files, setFiles] = useState<FileState[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const patch = useCallback((id: string, changes: Partial<FileState>) => {
    setFiles((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, ...changes } : entry)),
    );
  }, []);

  const handleFiles = useCallback(
    async (incoming: FileList | File[]) => {
      const list = Array.from(incoming).filter((file) =>
        file.type.startsWith("image/"),
      );
      if (list.length === 0) return;

      const prepared: FileState[] = list.map((file, index) => ({
        id: `${Date.now()}-${index}-${file.name}`,
        file,
        previewUrl: URL.createObjectURL(file),
        width: 0,
        height: 0,
        findings: [],
        analysis: null,
        scanning: true,
        exporting: false,
      }));

      setFiles((current) => [...prepared, ...current].slice(0, 30));

      for (const entry of prepared) {
        try {
          const bitmap = await decodeFile(entry.file);
          const analysis = await scanPixels(bitmap);
          const input = {
            name: entry.file.name,
            width: bitmap.width,
            height: bitmap.height,
            bytes: entry.file.size,
            type: entry.file.type,
          };
          bitmap.close();

          const metadata = auditMetadata(input, spec);
          const pixelFindings = analysis
            ? auditPixels(analysis, spec, { backgroundAvailable: true })
            : auditPixels(
                {
                  corners: [],
                  borderNonWhiteRatio: 0,
                  backgroundVerdict: "not-white",
                  subjectBox: null,
                  fillRatio: 0,
                  sampledPixels: 0,
                },
                spec,
                { backgroundAvailable: false },
              );

          const findings = [...metadata, ...pixelFindings, ...manualFindings(spec)];
          const verdict = summarize(findings);

          patch(entry.id, {
            width: input.width,
            height: input.height,
            findings,
            analysis,
            scanning: false,
          });

          // Only the slot and the outcome — never the file name or the pixels.
          trackEvent("image_audit_completed", {
            slot: spec.slug,
            verdict: verdict.verdict,
            fails: String(verdict.fail),
            warns: String(verdict.warn),
          });
        } catch (error) {
          patch(entry.id, {
            scanning: false,
            error:
              error instanceof Error
                ? error.message
                : "This file could not be decoded by the browser.",
          });
        }
      }
    },
    [patch, spec],
  );

  const exportOne = useCallback(
    async (entry: FileState) => {
      patch(entry.id, { exporting: true });
      try {
        const result = await exportCompliant(entry.file, spec);
        patch(entry.id, {
          exporting: false,
          exportedUrl: result.url,
          exportedBytes: result.bytes,
          exportedFormat: result.format,
        });
        // An export is the strongest free-tool signal: the report was convincing enough
        // that the user took the file back to the marketplace.
        trackEvent("image_export_completed", {
          slot: spec.slug,
          format: result.format,
          kb: String(Math.max(1, Math.round(result.bytes / 1024))),
        });
      } catch (error) {
        patch(entry.id, {
          exporting: false,
          error:
            error instanceof Error ? error.message : "Export failed in this browser.",
        });
      }
    },
    [patch, spec],
  );

  const reset = useCallback(() => {
    setFiles((current) => {
      current.forEach((entry) => {
        URL.revokeObjectURL(entry.previewUrl);
        if (entry.exportedUrl) URL.revokeObjectURL(entry.exportedUrl);
      });
      return [];
    });
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const totals = useMemo(() => {
    const ready = files.filter(
      (entry) => !entry.scanning && summarize(entry.findings).verdict === "ready",
    ).length;
    return { ready, total: files.length };
  }, [files]);

  return (
    <div className="rounded-[1.8rem] border bg-card p-5 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.28)] md:p-7">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
        className={`rounded-[1.4rem] border-2 border-dashed p-8 text-center transition ${
          dragging
            ? "border-orange-400 bg-orange-50/60"
            : "border-border bg-background/60"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) void handleFiles(event.target.files);
          }}
        />
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-orange-100 text-orange-700">
          <ImageUp className="size-6" />
        </div>
        <p className="mt-4 font-heading text-xl text-foreground">
          Drop product photos here
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Checked against {spec.platform} {spec.surface.toLowerCase()} rules. Images are
          processed in this tab and never uploaded.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Button rounded="full" onClick={() => inputRef.current?.click()}>
            Choose images
          </Button>
          {files.length > 0 ? (
            <Button rounded="full" variant="outline" onClick={reset}>
              <RotateCcw className="mr-2 size-4" />
              Clear
            </Button>
          ) : null}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Up to 30 images per batch · JPEG, PNG, WebP or TIFF input
        </p>
      </div>

      {files.length > 0 ? (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {totals.ready} of {totals.total} already compliant
          </span>
          {files.length > 1 ? (
            <span>Export each file individually below</span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 space-y-4">
        {files.map((entry) => {
          const verdict = summarize(entry.findings);
          return (
            <article
              key={entry.id}
              className="rounded-[1.4rem] border border-border/70 bg-background/70 p-4"
            >
              <div className="flex flex-wrap items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entry.previewUrl}
                  alt={entry.file.name}
                  className="size-20 rounded-xl border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {entry.file.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entry.scanning
                      ? "Reading image…"
                      : `${formatEdge(entry.width, entry.height)} · ${formatBytes(entry.file.size)}`}
                  </p>
                  {entry.scanning ? (
                    <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="size-3.5 animate-spin" />
                      Running checks
                    </p>
                  ) : (
                    <p className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      {verdict.fail > 0 ? (
                        <span className="rounded-full bg-rose-50 px-2 py-0.5 font-medium text-rose-700">
                          {verdict.fail} to fix
                        </span>
                      ) : null}
                      {verdict.warn > 0 ? (
                        <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-700">
                          {verdict.warn} to review
                        </span>
                      ) : null}
                      {verdict.fail === 0 && verdict.warn === 0 ? (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                          Ready to upload
                        </span>
                      ) : null}
                      <span className="text-muted-foreground">
                        {verdict.pass} passed · {verdict.manual} manual
                      </span>
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    rounded="full"
                    size="sm"
                    onClick={() => void exportOne(entry)}
                    disabled={entry.scanning || entry.exporting}
                  >
                    {entry.exporting ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Download className="mr-2 size-4" />
                    )}
                    Export {spec.recommendedWidth}×{spec.recommendedHeight}
                  </Button>
                  {entry.exportedUrl ? (
                    <a
                      href={entry.exportedUrl}
                      download={`${entry.file.name.replace(/\.[^.]+$/, "")}-${spec.slug}.${entry.exportedFormat === "PNG" ? "png" : "jpg"}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-orange-300"
                    >
                      <Download className="size-3.5" />
                      Save
                      {entry.exportedBytes ? ` (${formatBytes(entry.exportedBytes)})` : ""}
                    </a>
                  ) : null}
                </div>
              </div>

              {entry.error ? (
                <p className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
                  <MinusCircle className="mt-0.5 size-4 shrink-0" />
                  {entry.error}
                </p>
              ) : null}

              {entry.findings.length > 0 ? (
                <ul className="mt-4 grid gap-2 md:grid-cols-2">
                  {entry.findings.map((finding) => {
                    const style = STATUS_STYLE[finding.status];
                    const Icon = style.icon;
                    return (
                      <li
                        key={finding.id}
                        className="rounded-xl border border-border/60 bg-card/60 p-3"
                      >
                        <div className="flex items-start gap-2">
                          <Icon className={`mt-0.5 size-4 shrink-0 ${style.className}`} />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground">
                              {finding.label}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              {finding.detail}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-xl border border-border/60 bg-muted/40 p-4 text-xs leading-6 text-muted-foreground">
        <p className="font-semibold text-foreground">What this checker can and cannot do</p>
        <p className="mt-1">
          It measures dimensions, weight, format, background whiteness and subject fill from
          the actual pixels, then exports a cropped square at {spec.recommendedWidth}×
          {spec.recommendedHeight}. Rule for this slot: {BACKGROUND_LABEL[spec.background]}.
        </p>
        <p className="mt-1">
          It does not remove backgrounds. If the report says the background is not pure
          white, the photo needs a real cut-out — brightening it in a browser would also
          wash out light-coloured products.
        </p>
        <p className="mt-1">
          Fill is an estimate from the subject&apos;s bounding box, measured against the
          background colour sampled from the frame edge, and it includes drop shadows.
          Marketplaces judge by eye, so use the number as a guide, not a guarantee.
        </p>
      </div>
    </div>
  );
}
