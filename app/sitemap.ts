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
