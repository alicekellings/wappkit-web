import { Post } from "@/.contentlayer/generated";

import { BlogCard } from "./blog-card";

// 索引页只为靠前的文章渲染完整图文卡片；其余用紧凑列表，
// 既保留全部文章链接（利于抓取与内链），又不让页面膨胀到数 MB。
const FEATURED_COUNT = 9;

export function BlogPosts({
  posts,
}: {
  posts: (Post & {
    blurDataURL: string;
  })[];
}) {
  const featured = posts.slice(0, FEATURED_COUNT);
  const rest = posts.slice(FEATURED_COUNT);

  return (
    <main className="space-y-8">
      {featured.length > 0 && (
        <>
          <BlogCard data={featured[0]} horizontale priority />

          <div className="grid gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-10 xl:grid-cols-3">
            {featured.slice(1).map((post, idx) => (
              <BlogCard data={post} key={post._id} priority={idx <= 2} />
            ))}
          </div>
        </>
      )}

      {rest.length > 0 && (
        <section aria-label="More articles">
          <h2 className="mb-2 font-heading text-lg text-foreground">
            All articles
          </h2>
          <div>
            {rest.map((post) => (
              <BlogCard data={post} key={post._id} compact />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}