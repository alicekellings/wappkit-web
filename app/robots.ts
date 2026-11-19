import { MetadataRoute } from "next"

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // 只挡训练型爬虫；搜索/引用型（OAI-SearchBot、ChatGPT-User、PerplexityBot）
    // 会带流量和链接，必须放开。
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "Bytespider",
          "CCBot",
          "Google-Extended",
          "Perplexity-User",
          "Amazonbot",
          "Applebot-Extended",
          "FacebookBot",
          "meta-externalagent",
          "ImagesiftBot",
          "DuckAssistBot",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
