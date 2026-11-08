import { NextRequest, NextResponse } from "next/server";

import { recordToolDownload } from "@/lib/funnel";

const APK_PATH = "/downloads/reddit-reader/Wappkit-Reddit-Reader-0.1.apk";

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("source") ?? "direct";

  await recordToolDownload("reddit-reader-android", source);

  return NextResponse.redirect(new URL(APK_PATH, request.url), {
    status: 302,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
