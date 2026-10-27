export const redditToolboxDesktopRelease = {
  version: "1.4.0",
  releasedAt: "2026-10-27",
  minSupportedVersion: "1.2.0",
  fileName: "RedditToolbox-Windows-v1.4.0.exe",
  fileSizeBytes: 48_074_280,
  fileSizeLabel: "45.8 MB",
  sha256:
    "caf912de16cb76c4f23d864d67af4f958cb8d84d2392ab39aaf8da992a18b2e5",
  releaseUrl:
    "https://github.com/alicekellings/wappkit-web/releases/tag/reddit-toolbox-v1.4.0",
  directDownloadUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.4.0/RedditToolbox-Windows-v1.4.0.exe",
  checksumUrl:
    "https://github.com/alicekellings/wappkit-web/releases/download/reddit-toolbox-v1.4.0/RedditToolbox-Windows-v1.4.0.exe.sha256",
  changelog: [
    "Video download is here. Right-click a video post and the app fetches both the picture and the sound track, then merges them into one file when ffmpeg is available on your machine.",
    "Without ffmpeg, the two files are kept side by side with a note explaining how to combine them, instead of quietly handing you a silent video.",
    "Network refusals now also cover HTTP 403: the app says the network is refusing anonymous requests and suggests a cookie, instead of blaming your connection.",
  ],
} as const;
