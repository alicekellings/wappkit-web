import { MetadataRoute } from "next"

import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // AI 爬虫与聚合爬虫按页面深度抓全站，在 240+ 篇博客上每月产生百万级
    // ISR Reads 与大量 Fast Origin Transfer，是免费额度超支的主因之一。
    // 明确禁掉它们，Google/Bing 等 SEO 爬虫不受影响。
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "Bytespider",
          "CCBot",
          "Google-Extended",
          "PerplexityBot",
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
