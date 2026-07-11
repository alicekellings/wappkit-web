import { env } from "@/env.mjs";

const version = "0.1.7";
const appUrl = env.NEXT_PUBLIC_APP_URL;
const fileName = `AI-Ecommerce-Visual-Studio-Setup-${version}.exe`;
const githubReleaseTag = `ai-ecom-visual-studio-v${version}`;
const githubReleaseBase =
  "https://github.com/alicekellings/wappkit-web/releases";
const defaultReleaseUrl = `${githubReleaseBase}/tag/${githubReleaseTag}`;
const defaultHostedInstallerUrl = `${githubReleaseBase}/download/${githubReleaseTag}/${fileName}`;
const defaultChecksumUrl = `${defaultHostedInstallerUrl}.sha256`;
const defaultSha256 =
  "406e5f0025085e1247fe931843827284b7906f67827761ebb29c5011ddb80e05";

function getVersionMatchedUrl(value: string | undefined, fallback: string) {
  if (!value) {
    return fallback;
  }

  return value.includes(version) ? value : fallback;
}

const hostedInstallerUrl = getVersionMatchedUrl(
  env.AI_ECOM_VISUAL_STUDIO_DOWNLOAD_URL,
  defaultHostedInstallerUrl,
);
const releaseUrl = getVersionMatchedUrl(
  env.AI_ECOM_VISUAL_STUDIO_RELEASE_URL,
  defaultReleaseUrl,
);
const checksumUrl = getVersionMatchedUrl(
  env.AI_ECOM_VISUAL_STUDIO_CHECKSUM_URL,
  defaultChecksumUrl,
);

export const aiEcomVisualStudioRelease = {
  toolSlug: "ai-ecom-visual-studio",
  version,
  releasedAt: "2026-07-11",
  minSupportedVersion: "0.1.0",
  fileName,
  fileSizeBytes: 80329118,
  fileSizeLabel: "76.61 MB installer",
  sha256:
    env.AI_ECOM_VISUAL_STUDIO_SHA256?.includes(defaultSha256)
      ? env.AI_ECOM_VISUAL_STUDIO_SHA256
      : defaultSha256,
  releaseUrl,
  hostedInstallerUrl,
  directDownloadUrl: `${appUrl}/api/desktop/ai-ecom-visual-studio/download`,
  checksumUrl,
  changelog: [
    "Adds one-device Pro licensing with a verified self-service move path and a 30-day transfer cooldown.",
    "Refreshes signed Pro access at startup and every six hours without blocking image work.",
    "Keeps Free batch background removal at 100 locally protected images and Pro batch processing unlimited.",
  ],
} as const;
