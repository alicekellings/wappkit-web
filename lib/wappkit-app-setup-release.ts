import { env } from "@/env.mjs";

const version = "1.0.0";
const appUrl = env.NEXT_PUBLIC_APP_URL;
const hasHostedInstaller = Boolean(env.WAPPKIT_APP_SETUP_DOWNLOAD_URL);

export const wappkitAppSetupRelease = {
  version,
  releasedAt: "2026-04-26",
  minSupportedVersion: "1.0.0",
  fileName: `WappkitAppSetup-Setup-${version}.exe`,
  fileSizeBytes: 51_077_074,
  fileSizeLabel: "48.7 MB",
  sha256: env.WAPPKIT_APP_SETUP_SHA256 ?? null,
  releaseUrl:
    env.WAPPKIT_APP_SETUP_RELEASE_URL ??
    `${appUrl}/tools/wappkit-app-setup`,
  directDownloadUrl: hasHostedInstaller
    ? `${appUrl}/api/desktop/wappkit-app-setup/download`
    : null,
  checksumUrl: env.WAPPKIT_APP_SETUP_CHECKSUM_URL ?? null,
  changelog: [
    "Starter-pack selection now refreshes the install list immediately.",
    "Bundle previews only show the apps that are still missing on the current PC.",
    "The desktop app can now check for newer releases and launch the latest installer.",
  ],
} as const;
