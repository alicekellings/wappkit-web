const { withContentlayer } = require("next-contentlayer2");
const { platformRedirects } = require("./platform-redirects.js");

import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 文章数已到 240+，单页静态生成在慢机器上可能超过默认 60 秒。
  staticPageGenerationTimeout: 180,
  images: {
    // 图片一个月内不会变；默认 60 秒会让优化器反复回源，白白消耗 CPU 与回源流量。
    minimumCacheTTL: 31536000,
    // Cloudflare Workers 不运行 sharp 等原生 Node 模块，运行时无法做图片优化。
    // 关闭优化后 next/image 直接输出原图 URL；本站最大单图约 1 MB，可接受。
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
  async redirects() {
    return [
      {
        source: "/reddit-toolbox",
        destination: "/tools/reddit-toolbox",
        permanent: true,
      },
      // 原本由 vercel.json 在平台层处理；Next.js 不读该文件，迁出 Vercel 后
      // 必须在这里注册，否则 90 条老 URL 的 301 会全部变成 404。
      ...platformRedirects,
    ];
  },
  // studio.wappkit.com -> /studio/* 的改写放在 middleware.ts。
  // 不用 next.config 的 rewrites()，因为它会连 /_next/static 一起改写，
  // 导致子域名上的 CSS/JS 404。
};

module.exports = withContentlayer(nextConfig);
