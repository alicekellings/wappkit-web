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
    file_size_bytes: redditToolboxDesktopRelease.fileSizeBytes,
    sha256: redditToolboxDesktopRelease.sha256,
    // 指向 GitHub Release 上的 .sha256 文件。与上面的 sha256 分属不同域，
    // 客户端会做双源比对：两者不一致即拒绝执行安装包，避免单点被篡改。
    checksum_url: redditToolboxDesktopRelease.checksumUrl,
    update_required: false,
  });
}
