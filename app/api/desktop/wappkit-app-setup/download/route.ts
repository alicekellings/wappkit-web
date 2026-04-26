import { NextResponse } from "next/server";

import { env } from "@/env.mjs";

export const runtime = "edge";

export async function GET() {
  if (!env.WAPPKIT_APP_SETUP_DOWNLOAD_URL) {
    return NextResponse.json(
      {
        error: "download_not_configured",
        message:
          "Set WAPPKIT_APP_SETUP_DOWNLOAD_URL in the deployment environment before publishing downloads.",
      },
      { status: 503 },
    );
  }

  return NextResponse.redirect(env.WAPPKIT_APP_SETUP_DOWNLOAD_URL, 307);
}
