import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts } from "contentlayer/generated";

import { BLOG_CATEGORIES } from "@/config/blog";
import { getTableOfContents } from "@/lib/toc";
import {
  constructMetadata,
  formatDate,
  getBlurDataURL,
  placeholderBlurhash,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Author from "@/components/content/author";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";
import BlurImage from "@/components/shared/blur-image";
import { DashboardTableOfContents } from "@/components/shared/toc";

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

  const { title, description, image } = post;

  return constructMetadata({
    title: `${title} | Wappkit Blog`,
    description,
    image,
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

  const [thumbnailBlurhash, images] = await Promise.all([
    getBlurDataURL(post.image),
    await Promise.all(
      post.images.map(async (src: string) => ({
        src,
        blurDataURL: await getBlurDataURL(src),
      })),
    ),
  ]);

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Wappkit Blog"
        title={post.title}
        description={post.description ?? "Read this Wappkit article and guide."}
        badges={[
          { label: category.title, tone: "warm" },
          { label: formatDate(post.date), tone: "muted" },
          { label: "Long-form guide" },
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
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Article context
              </p>
              <h2 className="mt-3 font-heading text-2xl text-white">
                Read the guide inside the same Wappkit surface as the product.
              </h2>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Authors
              </p>
              <div className="mt-4 space-y-4">
                {post.authors.map((author) => (
                  <Author username={author} key={post._id + author} />
                ))}
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm leading-6 text-slate-300">
                Practical content, product pages, activation docs, and downloads
                should feel like one connected trust path instead of scattered
                templates.
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
          <div className="sticky top-20">
            <MarketingCard tone="soft" className="p-6">
              <DashboardTableOfContents toc={toc} />
            </MarketingCard>
          </div>
        </div>
      </section>

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
