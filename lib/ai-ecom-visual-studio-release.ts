import { env } from "@/env.mjs";

const version = "0.1.0";
const appUrl = env.NEXT_PUBLIC_APP_URL;
const hasHostedInstaller = Boolean(env.AI_ECOM_VISUAL_STUDIO_DOWNLOAD_URL);

export const aiEcomVisualStudioRelease = {
  toolSlug: "ai-ecom-visual-studio",
  version,
  releasedAt: "2026-07-10",
  minSupportedVersion: "0.1.0",
  fileName: `AI-Ecommerce-Visual-Studio-Setup-${version}.exe`,
  fileSizeBytes: null,
  fileSizeLabel: hasHostedInstaller ? "Installer" : "Installer pending",
  sha256: env.AI_ECOM_VISUAL_STUDIO_SHA256 ?? null,
  releaseUrl:
    env.AI_ECOM_VISUAL_STUDIO_RELEASE_URL ??
    `${appUrl}/tools/ai-ecom-visual-studio`,
  directDownloadUrl: hasHostedInstaller
    ? `${appUrl}/api/desktop/ai-ecom-visual-studio/download`
    : null,
  checksumUrl: env.AI_ECOM_VISUAL_STUDIO_CHECKSUM_URL ?? null,
  changelog: [
    "Background removal, batch removal, and background replacement workflows are available.",
    "Amazon, Shopify, Instagram, and Facebook export presets are included.",
    "Metadata cleanup, Smart Product Optimize, enhancement presets, and persistent settings are enabled.",
  ],
} as const;
