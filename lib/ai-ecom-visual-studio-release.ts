import { env } from "@/env.mjs";

const version = "0.1.5";
const appUrl = env.NEXT_PUBLIC_APP_URL;
const fileName = `AI-Ecommerce-Visual-Studio-Setup-${version}.exe`;
const githubReleaseTag = `ai-ecom-visual-studio-v${version}`;
const githubReleaseBase =
  "https://github.com/alicekellings/wappkit-web/releases";
const defaultReleaseUrl = `${githubReleaseBase}/tag/${githubReleaseTag}`;
const defaultHostedInstallerUrl = `${githubReleaseBase}/download/${githubReleaseTag}/${fileName}`;
const defaultChecksumUrl = `${defaultHostedInstallerUrl}.sha256`;
const defaultSha256 =
  "56c7a939d0688d3709cdc13a2908688826f7e9ace518245e47f5c142be5123fa";

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
  fileSizeBytes: 80324558,
  fileSizeLabel: "76.60 MB installer",
  sha256:
    env.AI_ECOM_VISUAL_STUDIO_SHA256?.includes(defaultSha256)
      ? env.AI_ECOM_VISUAL_STUDIO_SHA256
      : defaultSha256,
  releaseUrl,
  hostedInstallerUrl,
  directDownloadUrl: `${appUrl}/api/desktop/ai-ecom-visual-studio/download`,
  checksumUrl,
  changelog: [
    "Shows Free or Pro Activated clearly in the desktop title bar and app header after license changes.",
    "Avoids accidental overwrites during multi-size and batch exports by generating unique output filenames.",
    "Keeps the verified update download flow from 0.1.4 with progress, checksum verification, and automatic launch of the new version.",
  ],
} as const;
