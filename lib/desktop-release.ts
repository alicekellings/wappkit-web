export const redditToolboxDesktopRelease = {
  version: "1.2.1",
  releasedAt: "2026-10-26",
  minSupportedVersion: "1.2.0",
  fileName: "RedditToolbox-Windows-v1.2.1.exe",
  fileSizeBytes: 48_014_648,
  fileSizeLabel: "45.8 MB",
  sha256:
    "ff89d5c9d929e07384d2dc89b0af1ca246d63bca5c5c68a6dbf6378c5bd2547e",
  releaseUrl:
    "https://github.com/alicekellings/wappkit-web/releases/tag/reddit-toolbox-v1.2.1",
  directDownloadUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.2.1/RedditToolbox-Windows-v1.2.1.exe",
  checksumUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.2.1/RedditToolbox-Windows-v1.2.1.exe.sha256",
  changelog: [
    "Offline license checks now verify the server's signature, so a hand-edited configuration can no longer unlock Pro.",
    "A license copied to another computer is now rejected instead of accepted.",
    "If a license needs revalidation, the app checks once online and keeps working offline afterwards.",
  ],
} as const;
