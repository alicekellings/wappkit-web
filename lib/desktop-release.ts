export const redditToolboxDesktopRelease = {
  version: "1.3.4",
  releasedAt: "2026-10-27",
  minSupportedVersion: "1.2.0",
  fileName: "RedditToolbox-Windows-v1.3.4.exe",
  fileSizeBytes: 48_070_730,
  fileSizeLabel: "45.8 MB",
  sha256:
    "e2d0d431de82e38a96263f8644bbcb18fcc49728bb3c4e0965629c387671b839",
  releaseUrl:
    "https://github.com/alicekellings/wappkit-web/releases/tag/reddit-toolbox-v1.3.4",
  directDownloadUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.3.4/RedditToolbox-Windows-v1.3.4.exe",
  checksumUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.3.4/RedditToolbox-Windows-v1.3.4.exe.sha256",
  changelog: [
    "Alert rules can be edited now: double-click a rule, or use Edit selected. Changing the subreddit, keywords, or score floor resets that rule so it rebuilds its baseline.",
    "Fixed UI overflow on narrower windows: the Comments header is no longer clipped, Created shows the full timestamp, and the export buttons are no longer cut off.",
    "The page-count dropdown keeps all options and explains why it is disabled on the Free plan, instead of offering a single choice.",
  ],
} as const;
