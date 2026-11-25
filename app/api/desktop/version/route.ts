import { NextResponse } from "next/server";

import { redditToolboxDesktopRelease } from "@/lib/desktop-release";

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
    // 鎸囧悜 GitHub Release 涓婄殑 .sha256 鏂囦欢銆備笌涓婇潰鐨?sha256 鍒嗗睘涓嶅悓鍩燂紝
    // 瀹㈡埛绔細鍋氬弻婧愭瘮瀵癸細涓よ€呬笉涓€鑷村嵆鎷掔粷鎵ц瀹夎鍖咃紝閬垮厤鍗曠偣琚鏀广€?
    checksum_url: redditToolboxDesktopRelease.checksumUrl,
    update_required: false,
  });
}
