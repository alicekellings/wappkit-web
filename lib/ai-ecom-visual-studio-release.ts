import { env } from "@/env.mjs";

const version = "0.1.1";
const appUrl = env.NEXT_PUBLIC_APP_URL;
const hasHostedInstaller = Boolean(env.AI_ECOM_VISUAL_STUDIO_DOWNLOAD_URL);

export const aiEcomVisualStudioRelease = {
  toolSlug: "ai-ecom-visual-studio",
  version,
  releasedAt: "2026-07-10",
  minSupportedVersion: "0.1.0",
  fileName: `AI-Ecommerce-Visual-Studio-Setup-${version}.exe`,
  fileSizeBytes: 76664469,
  fileSizeLabel: hasHostedInstaller ? "73.11 MB installer" : "Installer pending",
  sha256: env.AI_ECOM_VISUAL_STUDIO_SHA256 ?? null,
  releaseUrl:
    env.AI_ECOM_VISUAL_STUDIO_RELEASE_URL ??
    `${appUrl}/tools/ai-ecom-visual-studio`,
  directDownloadUrl: hasHostedInstaller
    ? `${appUrl}/api/desktop/ai-ecom-visual-studio/download`
    : null,
  checksumUrl: env.AI_ECOM_VISUAL_STUDIO_CHECKSUM_URL ?? null,
  changelog: [
    "Adds Free / Pro licensing gate: free users can remove one image background and save transparent PNG output.",
    "Pro unlocks batch background removal, background replacement, e-commerce/social export presets, JPEG output, enhancement, and Smart Product Optimize.",
    "Keeps marketplace-focused output quality controls, metadata cleanup, and persistent settings enabled for the full workflow.",
  ],
} as const;
