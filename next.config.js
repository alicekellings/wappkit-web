const { withContentlayer } = require("next-contentlayer2");

import("./env.mjs");

/**
 * studio.wappkit.com 上的一切都改写到 /studio/* 命名空间。
 * 表单提交的 /api/inquiry 因此会落到 /studio/api/inquiry（见 app/(studio)/studio/api/inquiry）。
 * 注意：Next.js 的 has.value 只接受字符串，不接受数组。
 */
const STUDIO_HOST = "studio.wappkit.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
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
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/:path*",
          has: [{ type: "host", value: STUDIO_HOST }],
          destination: "/studio/:path*",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

module.exports = withContentlayer(nextConfig);
