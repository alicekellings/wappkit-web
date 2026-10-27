export const redditToolboxDesktopRelease = {
  version: "1.3.3",
  releasedAt: "2026-10-27",
  minSupportedVersion: "1.2.0",
  fileName: "RedditToolbox-Windows-v1.3.3.exe",
  fileSizeBytes: 48_067_749,
  fileSizeLabel: "45.8 MB",
  sha256:
    "45ceb7d11c491a78ee784cc9ccf89cee3d3711fbe7e327d014b442847bc44c6c",
  releaseUrl:
    "https://github.com/alicekellings/wappkit-web/releases/tag/reddit-toolbox-v1.3.3",
  directDownloadUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.3.3/RedditToolbox-Windows-v1.3.3.exe",
  checksumUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.3.3/RedditToolbox-Windows-v1.3.3.exe.sha256",
  changelog: [
    "Right-click a post in Scrape Posts to download its images. Galleries keep their original order as 01, 02, 03.",
    "Files already in the folder are skipped, so running it twice does not download twice.",
    "Video is not supported yet: Reddit serves video and audio as two streams, and the menu says so instead of producing a silent file.",
  ],
} as const;
