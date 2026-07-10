import { NextResponse } from "next/server";

import { aiEcomVisualStudioRelease } from "@/lib/ai-ecom-visual-studio-release";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    tool_slug: aiEcomVisualStudioRelease.toolSlug,
    latest_version: aiEcomVisualStudioRelease.version,
    min_supported_version: aiEcomVisualStudioRelease.minSupportedVersion,
    download_url: aiEcomVisualStudioRelease.directDownloadUrl,
    release_url: aiEcomVisualStudioRelease.releaseUrl,
    checksum_url: aiEcomVisualStudioRelease.checksumUrl,
    changelog: aiEcomVisualStudioRelease.changelog,
    release_date: aiEcomVisualStudioRelease.releasedAt,
    file_name: aiEcomVisualStudioRelease.fileName,
    file_size: aiEcomVisualStudioRelease.fileSizeLabel,
    sha256: aiEcomVisualStudioRelease.sha256,
    update_required: false,
    message: aiEcomVisualStudioRelease.directDownloadUrl
      ? "Latest AI E-commerce Visual Studio release metadata is available."
      : "Release metadata is live, but the hosted installer URL still needs to be configured.",
  });
}
