import { NextResponse } from "next/server";

import { env } from "@/env.mjs";

export const runtime = "edge";

export async function GET() {
  if (!env.AI_ECOM_VISUAL_STUDIO_DOWNLOAD_URL) {
    return NextResponse.json(
      {
        error: "download_not_configured",
        message:
          "Set AI_ECOM_VISUAL_STUDIO_DOWNLOAD_URL in the deployment environment before publishing downloads.",
      },
      { status: 503 },
    );
  }

  return NextResponse.redirect(env.AI_ECOM_VISUAL_STUDIO_DOWNLOAD_URL, 307);
}
