import { MetadataRoute } from "next";
import { allDocs, allPosts } from "contentlayer/generated";

import { BLOG_CATEGORIES } from "@/config/blog";
import { siteConfig } from "@/config/site";
import { tools } from "@/lib/tools";

const baseUrl = siteConfig.url;

function toAbsoluteUrl(path: string) {
  return `${baseUrl}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: toAbsoluteUrl("/tools"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl("/download"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      // 「reddit viewer」是 GSC 里展示量最大、排名最靠后的意图词（1752 展示 / 平均 24 位），
      // 单独给它一个落地页，priority 低于 /tools 但高于通用营销页。
      url: toAbsoluteUrl("/reddit-viewer"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      // 「reddit alerts / monitoring」405 展示 0 点击：有需求没有承接页，
      // 1.3.0 的告警功能上线后配这个页面。
      url: toAbsoluteUrl("/reddit-alerts"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      // 「redditsave alternative」意图簇：215 展示 0 点击。
      // 页面明确只做文字存档、不做媒体下载，避免引来错误期待。
      url: toAbsoluteUrl("/reddit-save"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      // GummySearch 2024 年底关停后留下的大量「找替代品」搜索。
      // 这类词的意图是「正在选工具」，转化率远高于 viewer/save 类词。
      url: toAbsoluteUrl("/gummysearch-alternative"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl("/pricing"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl("/license"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl("/license/retrieve"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl("/tools/wappkit-app-setup/support"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: toAbsoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: toAbsoluteUrl("/privacy"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: toAbsoluteUrl("/terms"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const toolRoutes: MetadataRoute.Sitemap = tools.map((tool) => ({
    url: toAbsoluteUrl(`/tools/${tool.slug}`),
    lastModified: now,
    changeFrequency: tool.status === "live" ? "weekly" : "monthly",
    priority: tool.status === "live" ? 0.85 : 0.7,
  }));

  const blogCategoryRoutes: MetadataRoute.Sitemap = BLOG_CATEGORIES.map((category) => ({
    url: toAbsoluteUrl(`/blog/category/${category.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const blogPostRoutes: MetadataRoute.Sitemap = allPosts
    .filter((post) => post.published)
    .map((post) => ({
      url: toAbsoluteUrl(`/blog/${post.slugAsParams}`),
      lastModified: new Date(post.date),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const docRoutes: MetadataRoute.Sitemap = allDocs
    .filter((doc) => doc.published)
    .map((doc) => ({
      url: toAbsoluteUrl(doc.slug),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: doc.slugAsParams === "" ? 0.8 : 0.7,
    }));

  return [
    ...staticRoutes,
    ...toolRoutes,
    ...blogCategoryRoutes,
    ...blogPostRoutes,
    ...docRoutes,
  ];
}
