const { withContentlayer } = require("next-contentlayer2");
const { platformRedirects } = require("./platform-redirects.js");

import("./env.mjs");

/**
 * 纯静态导出模式（Cloudflare Pages 直传）。
 *
 * 该模式下 Next 不生成任何服务端代码；带函数的路由（/api、/ops、/go、studio 询盘）
 * 由 `scripts/build-static-export.mjs` 暂时移出后再构建，改由韩国服务器承接。
 */
const isStaticExport = process.env.WAPPKIT_STATIC_EXPORT === "1";
// 服务端模式（韩国服务器承接 /api、/go、/ops、checkout 成功页）。
const isStandalone = process.env.WAPPKIT_STANDALONE === "1";

const legacyRedirects = [
  {
    source: "/reddit-toolbox",
    destination: "/tools/reddit-toolbox",
    permanent: true,
  },
  // 原本由 vercel.json 在平台层处理；Next.js 不读该文件，迁出 Vercel 后
  // 必须在这里注册，否则 90 条老 URL 的 301 会全部变成 404。
  ...platformRedirects,
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 文章数已到 240+，单页静态生成在慢机器上可能超过默认 60 秒。
  staticPageGenerationTimeout: 180,
  // 导出模式产出纯 HTML，不含 server runtime；standalone 产出自带 server.js。
  ...(isStaticExport ? { output: "export" } : {}),
  ...(isStandalone ? { output: "standalone" } : {}),
  images: {
    // 图片一个月内不会变；默认 60 秒会让优化器反复回源，白白消耗 CPU 与回源流量。
    minimumCacheTTL: 31536000,
    // 静态托管与 Workers 都没有 sharp 运行时优化，直接输出原图 URL。
    // 本站最大单图约 1 MB，可接受。
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
  // 静态导出不支持 next.config 的 redirects；导出模式下改由 out/_redirects 承担。
  ...(isStaticExport
    ? {}
    : {
        async redirects() {
          return legacyRedirects;
        },
      }),
  // studio.wappkit.com -> /studio/* 的改写放在 middleware.ts。
  // 不用 next.config 的 rewrites()，因为它会连 /_next/static 一起改写，
  // 导致子域名上的 CSS/JS 404。
};

module.exports = withContentlayer(nextConfig);