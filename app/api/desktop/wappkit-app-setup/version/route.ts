import { NextResponse } from "next/server";

import { wappkitAppSetupRelease } from "@/lib/wappkit-app-setup-release";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    latest_version: wappkitAppSetupRelease.version,
    min_supported_version: wappkitAppSetupRelease.minSupportedVersion,
    download_url: wappkitAppSetupRelease.directDownloadUrl,
    release_url: wappkitAppSetupRelease.releaseUrl,
    checksum_url: wappkitAppSetupRelease.checksumUrl,
    changelog: wappkitAppSetupRelease.changelog,
    release_date: wappkitAppSetupRelease.releasedAt,
    file_name: wappkitAppSetupRelease.fileName,
    file_size: wappkitAppSetupRelease.fileSizeLabel,
    sha256: wappkitAppSetupRelease.sha256,
    update_required: false,
    message: wappkitAppSetupRelease.directDownloadUrl
      ? "Latest Wappkit App Setup release metadata is available."
      : "Release metadata is live, but the hosted installer URL still needs to be configured.",
  });
}
