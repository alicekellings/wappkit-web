import { NextRequest, NextResponse } from "next/server";

import { getRequestCountry, shouldBlockCountry } from "@/lib/geo-block";

/**
 * studio.wappkit.com 上的一切都改写到 /studio/* 命名空间。
 *
 * 为什么放在 middleware 而不是 next.config.js 的 rewrites()：
 * next.config 的 beforeFiles 改写对静态资源同样生效，会把
 * /_next/static/css/*.css 也改写成 /studio/_next/static/... ，
 * 结果是 CSS/JS 全 404，页面退化成裸 HTML。
 * middleware 的 matcher 已经排除了 /_next，静态资源不受影响。
 */
const STUDIO_HOST = "studio.wappkit.com";

export function middleware(request: NextRequest) {
  // /api/license/* 不做地区拦截：
  // 1) 授权本身受 key + 硬件绑定 + 限流保护，地区封锁挡不住滥用，只会挡住
  //    正常激活（作者本机就在 CN，测试时被 403 卡住过）；
  // 2) 免费 key 无商业损失，付费 key 走 Creem 结算，CN 用户本来就买不了。
  // 授权与结账接口都豁免地区拦截：它们是交易链路，不是内容浏览。
  // 结账最终跳 Creem 收银台，真正的风控在支付侧。
  const isLicenseApi =
    request.nextUrl.pathname.startsWith("/api/license/") ||
    request.nextUrl.pathname.startsWith("/api/checkout");

  // /ops 后台与 /api/admin/* 同样豁免：
  // 它们本来就要求 INTERNAL_ADMIN_TOKEN 登录态，安全性来自鉴权而不是地区封锁；
  // 而作者人在 CN，封锁等于让看板自己打不开——漏斗数据和激活列表正是要天天看的。
  const isAdminArea =
    request.nextUrl.pathname === "/ops" ||
    request.nextUrl.pathname.startsWith("/ops/") ||
    request.nextUrl.pathname.startsWith("/api/admin/");

  const country = getRequestCountry(request.headers);

  if (!isLicenseApi && !isAdminArea && shouldBlockCountry(country)) {
    return new NextResponse("Access unavailable from this region.", {
      status: 403,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex",
      },
    });
  }

  const host = (request.headers.get("host") ?? "").split(":")[0];
  const { pathname } = request.nextUrl;

  let response: NextResponse;

  // 子域名上、且不是 /studio 开头的路径，改写进 /studio 命名空间
  if (host === STUDIO_HOST && !pathname.startsWith("/studio")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/studio" : `/studio${pathname}`;
    response = NextResponse.rewrite(url);
  } else {
    response = NextResponse.next();
  }

  response.headers.set("X-Wappkit-Geo-Block", "active");
  return response;
}

export const config = {
  matcher: [
    // 排除整个 /_next（static / image / data），否则子域名改写会打碎静态资源
    "/((?!_next|\\.well-known|favicon.ico|opengraph-image.jpg|robots.txt|sitemap.xml|site.webmanifest).*)",
  ],
};
