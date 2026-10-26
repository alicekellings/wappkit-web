export const redditToolboxDesktopRelease = {
  version: "1.3.0",
  releasedAt: "2026-10-26",
  minSupportedVersion: "1.2.0",
  fileName: "RedditToolbox-Windows-v1.3.0.exe",
  fileSizeBytes: 48_045_702,
  fileSizeLabel: "45.8 MB",
  sha256:
    "583de3b12c39d2e72fc33f3fda254552c2d4c5aec6468024cf62376ec7b36155",
  releaseUrl:
    "https://github.com/alicekellings/wappkit-web/releases/tag/reddit-toolbox-v1.3.0",
  directDownloadUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.3.0/RedditToolbox-Windows-v1.3.0.exe",
  checksumUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.3.0/RedditToolbox-Windows-v1.3.0.exe.sha256",
  changelog: [
    "New Alerts tab: watch a subreddit for new posts that match your keywords while the app is open.",
    "Each rule has its own check interval and minimum score. The first check only builds a baseline, so you never get a hundred old posts at once.",
    "Free plan: one rule at a thirty minute interval. A licence raises it to five rules at five minutes.",
  ],
} as const;
