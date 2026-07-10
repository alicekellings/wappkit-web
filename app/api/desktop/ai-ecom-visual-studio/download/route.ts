import { NextResponse } from "next/server";

import { aiEcomVisualStudioRelease } from "@/lib/ai-ecom-visual-studio-release";

export const runtime = "edge";

export async function GET() {
  return NextResponse.redirect(
    aiEcomVisualStudioRelease.hostedInstallerUrl,
    307,
  );
}
