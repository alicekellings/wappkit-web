import { NextRequest, NextResponse } from "next/server";

import { redditToolboxDesktopRelease } from "@/lib/desktop-release";
import { recordDownloadClick } from "@/lib/funnel";

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("source");

  await recordDownloadClick(source);

  return NextResponse.redirect(redditToolboxDesktopRelease.directDownloadUrl, {
    status: 302,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
