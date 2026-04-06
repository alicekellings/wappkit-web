import { Metadata } from "next";
import { notFound } from "next/navigation";
import { allPages } from "contentlayer/generated";

import { constructMetadata, getBlurDataURL } from "@/lib/utils";
import { Mdx } from "@/components/content/mdx-components";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
} from "@/components/marketing/page-shell";

import "@/styles/mdx.css";

export async function generateStaticParams() {
  return allPages.map((page) => ({
    slug: page.slugAsParams,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const page = allPages.find((entry) => entry.slugAsParams === params.slug);
  if (!page) {
    return;
  }

  return constructMetadata({
    title: `${page.title} | Wappkit`,
    description: page.description,
  });
}

export default async function PagePage({
  params,
}: {
  params: {
    slug: string;
  };
}) {
  const page = allPages.find((entry) => entry.slugAsParams === params.slug);

  if (!page) {
    notFound();
  }

  const images = await Promise.all(
    page.images.map(async (src: string) => ({
      src,
      blurDataURL: await getBlurDataURL(src),
    })),
  );

  return (
    <MarketingPageShell containerClassName="max-w-5xl py-16 md:py-20">
      <MarketingHero
        eyebrow="Wappkit page"
        title={page.title}
        description={
          page.description ?? "Read the details for this Wappkit page."
        }
      />

      <div className="mt-10">
        <MarketingCard
          tone="soft"
          className="prose prose-slate max-w-none p-8 md:p-10"
        >
          <Mdx code={page.body.code} images={images} />
        </MarketingCard>
      </div>
    </MarketingPageShell>
  );
}
