import Link from "next/link";
import { Post } from "contentlayer/generated";

import { cn, formatDate, placeholderBlurhash } from "@/lib/utils";
import BlurImage from "@/components/shared/blur-image";

import Author from "./author";

export function BlogCard({
  data,
  priority,
  horizontale = false,
  compact = false,
}: {
  data: Post & {
    blurDataURL: string;
  };
  priority?: boolean;
  horizontale?: boolean;
  /**
   * 紧凑模式：只输出标题、日期和链接，不渲染配图与摘要。
   *
   * 博客索引原先为 269 篇文章都渲染完整卡片，页面上重复嵌入 996 次同一个
   * blurhash 占位图，单页 HTML 达 2.68 MB。索引页后半部分几乎不会被看，
   * 但每一条链接都必须留在 HTML 里供搜索引擎抓取，所以保留链接、砍掉装饰。
   */
  compact?: boolean;
}) {
  if (compact) {
    return (
      <article className="flex items-baseline justify-between gap-4 border-b border-border/60 py-2.5 last:border-0">
        <h2 className="text-sm font-medium leading-6">
          <Link href={data.slug} prefetch={false} className="hover:underline">
            {data.title}
          </Link>
        </h2>
        {data.date && (
          <time
            dateTime={data.date}
            className="shrink-0 text-xs tabular-nums text-muted-foreground"
          >
            {formatDate(data.date)}
          </time>
        )}
      </article>
    );
  }

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[1.6rem] border border-border/70 bg-background/90 p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)]",
        horizontale
          ? "grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6"
          : "flex flex-col space-y-2",
      )}
    >
      {data.image && (
        <div className="w-full overflow-hidden rounded-[1.2rem] border border-border/70">
          <BlurImage
            alt={data.title}
            blurDataURL={data.blurDataURL ?? placeholderBlurhash}
            className={cn(
              "size-full object-cover object-center",
              horizontale ? "lg:h-72" : null,
            )}
            width={800}
            height={400}
            priority={priority}
            placeholder="blur"
            src={data.image}
            sizes="(max-width: 768px) 750px, 600px"
          />
        </div>
      )}
      <div
        className={cn(
          "flex flex-1 flex-col",
          horizontale ? "justify-center" : "justify-between",
        )}
      >
        <div className="w-full">
          <h2 className="my-1.5 line-clamp-2 font-heading text-2xl">
            {data.title}
          </h2>
          {data.description && (
            <p className="line-clamp-2 text-muted-foreground">
              {data.description}
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center space-x-3">
          <div className="flex items-center -space-x-2">
            {data.authors.map((author) => (
              <Author username={author} key={data._id + author} imageOnly />
            ))}
          </div>

          {data.date && (
            <p className="text-sm text-muted-foreground">
              {formatDate(data.date)}
            </p>
          )}
        </div>
      </div>
      <Link href={data.slug} prefetch={false} className="absolute inset-0">
        <span className="sr-only">View Article</span>
      </Link>
    </article>
  );
}
