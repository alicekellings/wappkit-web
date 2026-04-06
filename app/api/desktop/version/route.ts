import { NextResponse } from "next/server";

import { redditToolboxDesktopRelease } from "@/lib/desktop-release";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    latest_version: redditToolboxDesktopRelease.version,
    min_supported_version: redditToolboxDesktopRelease.minSupportedVersion,
    download_url: redditToolboxDesktopRelease.directDownloadUrl,
    changelog: redditToolboxDesktopRelease.changelog,
    release_date: redditToolboxDesktopRelease.releasedAt,
    file_size: redditToolboxDesktopRelease.fileSizeLabel,
    sha256: redditToolboxDesktopRelease.sha256,
    update_required: false,
  });
}
