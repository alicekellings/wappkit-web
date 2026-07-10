import { env } from "@/env.mjs";

const version = "0.1.1";
const appUrl = env.NEXT_PUBLIC_APP_URL;
const fileName = `AI-Ecommerce-Visual-Studio-Setup-${version}.exe`;
const githubReleaseTag = `ai-ecom-visual-studio-v${version}`;
const githubReleaseBase =
  "https://github.com/alicekellings/wappkit-web/releases";
const defaultReleaseUrl = `${githubReleaseBase}/tag/${githubReleaseTag}`;
const defaultHostedInstallerUrl = `${githubReleaseBase}/download/${githubReleaseTag}/${fileName}`;
const defaultChecksumUrl = `${defaultHostedInstallerUrl}.sha256`;
const defaultSha256 =
  "1b1d87a20b478f08ad754079bcb1ab392f4ec312b27ad4ffb46091374725c3d0";

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
  fileSizeBytes: 76664469,
  fileSizeLabel: "73.11 MB installer",
  sha256:
    env.AI_ECOM_VISUAL_STUDIO_SHA256?.includes(defaultSha256)
      ? env.AI_ECOM_VISUAL_STUDIO_SHA256
      : defaultSha256,
  releaseUrl,
  hostedInstallerUrl,
  directDownloadUrl: `${appUrl}/api/desktop/ai-ecom-visual-studio/download`,
  checksumUrl,
  changelog: [
    "Adds Free / Pro licensing gate: free users can remove one image background and save transparent PNG output.",
    "Pro unlocks batch background removal, background replacement, e-commerce/social export presets, JPEG output, enhancement, and Smart Product Optimize.",
    "Keeps marketplace-focused output quality controls, metadata cleanup, and persistent settings enabled for the full workflow.",
  ],
} as const;
