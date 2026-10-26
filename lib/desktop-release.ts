export const redditToolboxDesktopRelease = {
  version: "1.3.2",
  releasedAt: "2026-10-26",
  minSupportedVersion: "1.2.0",
  fileName: "RedditToolbox-Windows-v1.3.2.exe",
  fileSizeBytes: 48_053_992,
  fileSizeLabel: "45.8 MB",
  sha256:
    "646ef6f92cc387e863251dad2f860d88c003780a0253407251f612f13a09db31",
  releaseUrl:
    "https://github.com/alicekellings/wappkit-web/releases/tag/reddit-toolbox-v1.3.2",
  directDownloadUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.3.2/RedditToolbox-Windows-v1.3.2.exe",
  checksumUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.3.2/RedditToolbox-Windows-v1.3.2.exe.sha256",
  changelog: [
    "Save a filtered post list as a Markdown archive from Scrape Posts.",
    "The saved file keeps the complete post text, plus author, score, comment count, date, and permalink. Text only: no images or video, and no comments.",
    "Saves the filtered list rather than the whole result set, so what you filtered is what you get.",
  ],
} as const;
