import { env } from "@/env.mjs";

const version = "0.1.3";
const appUrl = env.NEXT_PUBLIC_APP_URL;
const fileName = `AI-Ecommerce-Visual-Studio-Setup-${version}.exe`;
const githubReleaseTag = `ai-ecom-visual-studio-v${version}`;
const githubReleaseBase =
  "https://github.com/alicekellings/wappkit-web/releases";
const defaultReleaseUrl = `${githubReleaseBase}/tag/${githubReleaseTag}`;
const defaultHostedInstallerUrl = `${githubReleaseBase}/download/${githubReleaseTag}/${fileName}`;
const defaultChecksumUrl = `${defaultHostedInstallerUrl}.sha256`;
const defaultSha256 =
  "1700d58fac3d8d6f17ac35cd6e621047a50c0b20757addae39d12f3ff36c4b0a";

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
  releasedAt: "2026-07-10",
  minSupportedVersion: "0.1.0",
  fileName,
  fileSizeBytes: 80320418,
  fileSizeLabel: "76.59 MB installer",
  sha256:
    env.AI_ECOM_VISUAL_STUDIO_SHA256?.includes(defaultSha256)
      ? env.AI_ECOM_VISUAL_STUDIO_SHA256
      : defaultSha256,
  releaseUrl,
  hostedInstallerUrl,
  directDownloadUrl: `${appUrl}/api/desktop/ai-ecom-visual-studio/download`,
  checksumUrl,
  changelog: [
    "Improves license activation feedback with a clearer Pro active state and customer-friendly status text.",
    "Moves save and export work to background threads so large batch exports keep the interface responsive.",
    "Keeps Free mode available for single-image background removal, while Pro unlocks batch processing, background replacement, e-commerce/social exports, JPEG output, enhancement, and Smart Product Optimize.",
  ],
} as const;
