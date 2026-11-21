import { NextResponse, type NextRequest } from "next/server";

import { recordToolDownload } from "@/lib/funnel";
import { resolveGoSlug } from "@/lib/go-links";

/**
 * /go/<tool>-<channel>/out
 *
 * 先记一笔再跳商店。记录走 Upstash（lib/funnel 的 recordToolDownload），
 * 所以计数不受广告拦截器、cookie 同意弹窗、禁用 JS 影响。
 *
 * 跳转目标只来自 lib/tools 的注册表，不接受外部 URL，避免变成开放重定向。
 */
export const dynamic = "force-dynamic";

export function GET(
  request: NextRequest,
  { params }: { params: { slug: string } },
) {
  return handle(request, params.slug);
}

async function handle(request: NextRequest, rawSlug: string) {
  const target = resolveGoSlug(rawSlug);

  if (!target) {
    return NextResponse.redirect(new URL("/", request.url), 302);
  }

  const override = request.nextUrl.searchParams.get("src");
  const channel = (override?.trim() || target.channel)
    .toLowerCase()
    .replace(/[^a-z0-9:_-]/g, "")
    .slice(0, 64);

  try {
    await recordToolDownload(target.toolSlug, `go:${channel || "direct"}`);
  } catch (error) {
    // 计数失败不能挡住下载。Upstash 挂了也要照常跳转。
    console.error("go_link.track_failed", {
      slug: rawSlug,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return NextResponse.redirect(target.storeHref, 302);
}
