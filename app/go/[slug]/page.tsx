import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { getStoreTools, resolveGoSlug } from "@/lib/go-links";
import { constructMetadata } from "@/lib/utils";

/**
 * 站外链接的中转页。
 *
 * 页面本身很轻：产品是什么、三件它真做的事、一个去商店的按钮。
 * 不放站点头尾导航，来的都是冷流量，多一个出口就少一次点击。
 *
 * 点击计数在 /go/[slug]/out 里做，服务端写 Upstash，
 * 广告拦截器和禁用 JS 都拦不掉。
 */
/**
 * 缓存策略：ISR，不再是 force-dynamic。
 *
 * 原来的 force-dynamic 让每一次点击都现场渲染一整页，响应体全部计入
 * Vercel 的 Fast Origin Transfer（CDN → 函数方向的出站流量）。
 *
 * 渠道 slug 是任意字符串（<工具>-<渠道>，见 lib/go-links.ts），构建时无法
 * 全量枚举，所以不能纯静态化。折中方案：
 *   - 裸工具 slug（filededupe、renamer…）构建时就生成好
 *   - 带渠道的 slug 第一次访问时生成，之后 24 小时内走 CDN 缓存
 *
 * 链接格式、页面内容、/out 的点击计数都不变，只是不再每次点击都回源。
 */
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams() {
  return getStoreTools().map((tool) => ({ slug: tool.slug }));
}

type GoPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: GoPageProps) {
  const target = resolveGoSlug(params.slug);

  if (!target) {
    return constructMetadata({
      title: "Page not found | Wappkit",
      noIndex: true,
    });
  }

  return constructMetadata({
    title: `${target.tool.name} for Windows | Wappkit`,
    description: target.tool.shortDescription,
    noIndex: true,
  });
}

export default function GoPage({ params }: GoPageProps) {
  const target = resolveGoSlug(params.slug);

  if (!target) {
    notFound();
  }

  const { tool, outHref } = target;
  const points = (tool.featureNotes ?? tool.features).slice(0, 3);
  const isFree = tool.priceLabel === "Free" || !tool.checkoutEnabled;

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-6 py-16 md:py-24">
      <div className="w-full max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Wappkit
        </p>

        <h1 className="mt-4 font-heading text-4xl leading-tight text-foreground">
          {tool.name}
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">{tool.tagline}</p>

        <ul className="mt-8 space-y-3">
          {points.map((point) => (
            <li key={point} className="flex gap-3 text-sm leading-6">
              <Check className="mt-0.5 size-4 shrink-0 text-orange-600" />
              <span className="text-foreground">{point}</span>
            </li>
          ))}
        </ul>

        <a
          href={outHref}
          className={buttonVariants({
            size: "lg",
            rounded: "full",
            className: "mt-9 w-full gap-2 sm:w-auto",
          })}
        >
          Get it from Microsoft Store
          <ArrowUpRight className="size-4" />
        </a>

        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          {isFree
            ? "Free, no account and no sign-in. Opens the Microsoft Store page."
            : `${tool.priceLabel ?? "Free to install"}. The app installs free, Pro is optional. Opens the Microsoft Store page.`}
        </p>

        <p className="mt-6 border-t pt-6 text-xs leading-6 text-muted-foreground">
          If the button does not open, start the Microsoft Store app on Windows
          and search for <span className="text-foreground">{tool.name}</span>.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline"
        >
          More Windows tools from Wappkit
        </Link>
      </div>
    </main>
  );
}
