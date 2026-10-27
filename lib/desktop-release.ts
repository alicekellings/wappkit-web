export const redditToolboxDesktopRelease = {
  version: "1.3.5",
  releasedAt: "2026-10-27",
  minSupportedVersion: "1.2.0",
  fileName: "RedditToolbox-Windows-v1.3.5.exe",
  fileSizeBytes: 48_070_182,
  fileSizeLabel: "45.8 MB",
  sha256:
    "946b2a5bbeb9894daeead2a71f163d9bcf63a73da015ef2aad589303cf4bb214",
  releaseUrl:
    "https://github.com/alicekellings/wappkit-web/releases/tag/reddit-toolbox-v1.3.5",
  directDownloadUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.3.5/RedditToolbox-Windows-v1.3.5.exe",
  checksumUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.3.5/RedditToolbox-Windows-v1.3.5.exe.sha256",
  changelog: [
    "Clearer failure messages. When Reddit is rate limiting your network, the app now suggests adding a cookie first, because that is what actually gets through. A real connection failure tells you to check the network instead.",
    "Internal jargon is gone from the main message: no more 'anonymous quota is per IP' or route names like 'JSON + cookie'.",
  ],
} as const;
