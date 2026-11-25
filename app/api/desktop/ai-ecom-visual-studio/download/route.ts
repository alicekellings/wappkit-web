import { NextResponse } from "next/server";

import { aiEcomVisualStudioRelease } from "@/lib/ai-ecom-visual-studio-release";

export async function GET() {
  return NextResponse.redirect(
    aiEcomVisualStudioRelease.hostedInstallerUrl,
    307,
  );
}
