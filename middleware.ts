import { NextRequest, NextResponse } from "next/server";

/**
 * 地区拦截已从 middleware 移到 Vercel Firewall。
 *
 * middleware 是一次边缘计算调用，每个命中 matcher 的请求都要付一次
 * Fast Origin Transfer；Firewall 在边缘直接拒绝，不进计算层，成本为零。
 * 拦截规则（当前只有 CN，且带路径豁免）改由 Firewall → Rules 里的一条
 * Country = China 的 Deny 规则承担。
 *
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
  // 豁免清单（Firewall 规则里要同样排除，否则交易链路和后台会被挡）：
  //   /api/license/*      授权接口：受 key + 硬件绑定 + 限流保护，且作者本机在 CN
  //   /api/checkout       结账：跳 Creem 收银台，真正的风控在支付侧
  //   /ops、/api/admin/*  后台：靠 INTERNAL_ADMIN_TOKEN 鉴权，作者在 CN 要天天看
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

  return response;
}

export const config = {
  matcher: [
    // 排除 /_next（static / image / data）与一切带扩展名的静态文件。
    // 图片、字体、xml 不需要地区拦截，也没必要走边缘函数，否则每个图片请求
    // 都会白白消耗一次边缘调用。
    "/((?!_next|\\.well-known|.*\\..*).*)",
  ],
};
