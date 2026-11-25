import { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";

import { BLOG_CATEGORIES } from "@/config/blog";
import { constructMetadata, placeholderBlurhash } from "@/lib/utils";
import { BlogCard } from "@/components/content/blog-card";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";

export const dynamicParams = false;

export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const category = BLOG_CATEGORIES.find((entry) => entry.slug === params.slug);
  if (!category) {
    return;
  }

  return constructMetadata({
    title: `${category.title} Posts | Wappkit`,
    description: category.description,
  });
}

export default async function BlogCategory({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const category = BLOG_CATEGORIES.find((entry) => entry.slug === params.slug);

  if (!category) {
    notFound();
  }

  // 列表页不再逐篇抓取远程模糊占位图：
  // 分类下可能有 200+ 篇文章，每篇一次外部请求会让静态生成超时。
  // 这里统一用常量占位图，视觉差异极小，构建时间从分钟级降到秒级。
  const articles = allPosts
    .filter((post) => post.categories.includes(category.slug))
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post) => ({
      ...post,
      blurDataURL: placeholderBlurhash,
    }));

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Blog category"
        title={category.title}
        description={category.description}
        badges={[
          { label: `${articles.length} posts`, tone: "warm" },
          { label: "Wappkit writing", tone: "muted" },
        ]}
      />

      <div className="mt-10">
        <MarketingCard tone="soft">
          {/* 与总索引同理：前 6 篇用图文卡片，其余用紧凑列表。
              分类页最多 200+ 篇，全部渲染完整卡片会让单页 HTML 超过 1 MB。 */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article, idx) => (
              <BlogCard key={article._id} data={article} priority={idx <= 2} />
            ))}
          </div>
          {articles.length > 6 && (
            <div className="mt-8 border-t border-border/60 pt-4">
              {articles.slice(6).map((article) => (
                <BlogCard key={article._id} data={article} compact />
              ))}
            </div>
          )}
        </MarketingCard>
      </div>
    </MarketingPageShell>
  );
}
