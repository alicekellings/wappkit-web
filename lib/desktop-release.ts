export const redditToolboxDesktopRelease = {
  version: "1.3.1",
  releasedAt: "2026-10-26",
  minSupportedVersion: "1.2.0",
  fileName: "RedditToolbox-Windows-v1.3.1.exe",
  fileSizeBytes: 48_048_461,
  fileSizeLabel: "45.8 MB",
  sha256:
    "c9e136b28e04c96bfb6b560efa9d9fa8ad7bac34808654628c6862f49540dffd",
  releaseUrl:
    "https://github.com/alicekellings/wappkit-web/releases/tag/reddit-toolbox-v1.3.1",
  directDownloadUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.3.1/RedditToolbox-Windows-v1.3.1.exe",
  checksumUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.3.1/RedditToolbox-Windows-v1.3.1.exe.sha256",
  changelog: [
    "The post list is sortable now: click a column header to sort by score, comments, or date.",
    "Posts with unknown values (RSS mode) stay at the bottom of a sort instead of mixing into the number column.",
    "Fixed a bug where acting on a post from page two onward could open or analyse the wrong post.",
  ],
} as const;
