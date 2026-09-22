const { withContentlayer } = require("next-contentlayer2");

import("./env.mjs");

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
  // studio.wappkit.com -> /studio/* 的改写放在 middleware.ts。
  // 不用 next.config 的 rewrites()，因为它会连 /_next/static 一起改写，
  // 导致子域名上的 CSS/JS 404。
};

module.exports = withContentlayer(nextConfig);
