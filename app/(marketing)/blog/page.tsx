import { allPosts } from "contentlayer/generated";

import { constructMetadata, placeholderBlurhash } from "@/lib/utils";
import { BlogPosts } from "@/components/content/blog-posts";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";

export const metadata = constructMetadata({
  title: "Wappkit Blog",
  description:
    "English-first guides, launch notes, and product updates for Wappkit tools.",
});

export default async function BlogPage() {
  // 首页列出全部文章，不再逐篇请求远程模糊占位图（200+ 次外部请求会让构建超时）。
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((post) => ({
      ...post,
      blurDataURL: placeholderBlurhash,
    }));

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Wappkit Blog"
        title="Practical launch notes, guides, and product thinking that match the product surface."
        description="The blog should feel connected to the same Wappkit system as the tool pages, not like a separate template. This index now shares the same warm hero, strong card rhythm, and calmer product framing."
        badges={[
          { label: "Guides", tone: "warm" },
          { label: "Launch notes", tone: "muted" },
          { label: "Product updates" },
        ]}
      />

      <div className="mt-10">
        <MarketingCard tone="soft">
          <BlogPosts posts={posts} />
        </MarketingCard>
      </div>
    </MarketingPageShell>
  );
}
