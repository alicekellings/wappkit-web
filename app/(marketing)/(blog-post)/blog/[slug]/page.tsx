import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";

import { BLOG_AUTHORS, BLOG_CATEGORIES } from "@/config/blog";
import { getTableOfContents } from "@/lib/toc";
import {
  constructMetadata,
  formatDate,
  getReadingTime,
  placeholderBlurhash,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArticleSchema } from "@/components/content/article-schema";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";
import BlurImage from "@/components/shared/blur-image";
import { DashboardTableOfContents } from "@/components/shared/toc";
import { BlogProductPromo } from "@/components/content/blog-product-promo";

import "@/styles/mdx.css";

import { Mdx } from "@/components/content/mdx-components";

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slugAsParams,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const post = allPosts.find((post) => post.slugAsParams === params.slug);
  if (!post) {
    return;
  }

  const { title, description, image, date, updated, authors, categories } =
    post;
  const category = BLOG_CATEGORIES.find(
    (item) => item.slug === categories[0],
  );

  return constructMetadata({
    title: `${title} | Wappkit Blog`,
    description,
    image,
    canonical: post.slug,
    keywords: [category?.title ?? "Guides", "Wappkit"],
    article: {
      publishedTime: date,
      modifiedTime: updated ?? date,
      authors: authors.map(
        (username) => BLOG_AUTHORS[username]?.name ?? username,
      ),
      section: category?.title,
      tags: categories,
    },
  });
}

export default async function PostPage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const post = allPosts.find((post) => post.slugAsParams === params.slug);

  if (!post) {
    notFound();
  }

  const category = BLOG_CATEGORIES.find(
    (category) => category.slug === post.categories[0],
  )!;

  const relatedArticles =
    (post.related &&
      post.related
        .map((slug) => allPosts.find((post) => post.slugAsParams === slug))
        .filter((relatedPost): relatedPost is (typeof allPosts)[number] =>
          Boolean(relatedPost),
        )) ||
    [];

  const toc = await getTableOfContents(post.body.raw);
  const hasToc = Boolean(toc.items?.length);
  const readingMinutes = getReadingTime(post.body.raw);
  const authorNames = post.authors
    .map((username) => BLOG_AUTHORS[username]?.name ?? username)
    .join(", ");

  // 构建期不再逐篇请求外部图床生成模糊占位图：
  // 240+ 篇文章会让静态生成耗时逼近构建超时，改用常量占位图。
  const thumbnailBlurhash = placeholderBlurhash;
  const images = post.images.map((src: string) => ({
    src,
    blurDataURL: placeholderBlurhash,
  }));

  return (
    <MarketingPageShell>
      <ArticleSchema post={post} category={category} />
      <MarketingHero
        eyebrow="Wappkit Blog"
        title={post.title}
        description={post.description ?? "Read this Wappkit article and guide."}
        badges={[
          { label: category.title, tone: "warm" },
          { label: formatDate(post.date), tone: "muted" },
          { label: `${readingMinutes} min read` },
          ...(post.updated
            ? [
                {
                  label: `Updated ${formatDate(post.updated)}`,
                  tone: "muted" as const,
                },
              ]
            : []),
        ]}
        actions={
          <>
            <Link href="/blog">
              <Button rounded="full" variant="outline">
                Back to Blog
              </Button>
            </Link>
            <Link href={`/blog/category/${category.slug}`}>
              <Button rounded="full" variant="ghost">
                More in {category.title}
              </Button>
            </Link>
          </>
        }
        rightContent={
          <MarketingCard tone="dark" className="space-y-5">
            <div className="flex items-center gap-3">
              <BlurImage
                src={BLOG_AUTHORS.wappkit.image}
                alt=""
                width={44}
                height={44}
                className="size-11 rounded-2xl border border-white/10"
              />
              <div>
                <p className="font-semibold text-white">{authorNames}</p>
                <p className="text-sm text-slate-400">Publisher</p>
              </div>
            </div>

            <dl className="space-y-3 rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-400">Published</dt>
                <dd className="text-slate-200">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </dd>
              </div>
              {post.updated ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-slate-400">Updated</dt>
                  <dd className="text-slate-200">
                    <time dateTime={post.updated}>
                      {formatDate(post.updated)}
                    </time>
                  </dd>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-400">Reading time</dt>
                <dd className="text-slate-200">{readingMinutes} min</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-400">Category</dt>
                <dd className="text-slate-200">{category.title}</dd>
              </div>
            </dl>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm leading-6 text-slate-300">
                Part of the Wappkit practical guide series for Reddit workflows
                and Wappkit tools.
              </p>
            </div>
          </MarketingCard>
        }
      />

      <section className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <MarketingCard tone="soft" className="overflow-hidden p-0">
          <BlurImage
            alt={post.title}
            blurDataURL={thumbnailBlurhash ?? placeholderBlurhash}
            className="aspect-[1200/630] border-b border-border/70 object-cover"
            width={1200}
            height={630}
            priority
            placeholder="blur"
            src={post.image}
            sizes="(max-width: 768px) 100vw, 900px"
          />
          <div className="px-5 py-8 md:p-10">
            <Mdx code={post.body.code} images={images} />
          </div>
        </MarketingCard>

        <div className="hidden xl:block">
          <div className="sticky top-20 space-y-4">
            {hasToc ? (
              <MarketingCard tone="soft" className="p-6">
                <DashboardTableOfContents toc={toc} />
              </MarketingCard>
            ) : null}
            <BlogProductPromo
              seed={post.slugAsParams}
              title={post.title}
              categories={post.categories}
            />
          </div>
        </div>
      </section>

      <div className="mt-6 xl:hidden">
        <BlogProductPromo
          seed={post.slugAsParams}
          title={post.title}
          categories={post.categories}
        />
      </div>

      {relatedArticles.length > 0 && (
        <section className="mt-6">
          <MarketingCard tone="soft">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              More articles
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {relatedArticles.map((post) => (
                <Link
                  key={post.slug}
                  href={post.slug}
                  className="rounded-[1.4rem] border border-border/70 bg-background/80 p-5 transition hover:-translate-y-0.5 hover:border-orange-300"
                >
                  <h3 className="font-heading text-xl text-foreground">
                    {post.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-[15px] text-muted-foreground">
                    {post.description}
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {formatDate(post.date)}
                  </p>
                </Link>
              ))}
            </div>
          </MarketingCard>
        </section>
      )}
    </MarketingPageShell>
  );
}
