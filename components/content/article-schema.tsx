import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/lib/utils";

type ArticleSchemaPost = {
  title: string;
  description?: string | null;
  image: string;
  date: string;
  updated?: string | null;
  slugAsParams: string;
};

type ArticleSchemaCategory = {
  title: string;
  slug: string;
};

export function ArticleSchema({
  post,
  category,
}: {
  post: ArticleSchemaPost;
  category: ArticleSchemaCategory;
}) {
  const url = absoluteUrl(`/blog/${post.slugAsParams}`);
  const categoryUrl = absoluteUrl(`/blog/category/${category.slug}`);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description ?? undefined,
        image: [absoluteUrl(post.image)],
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        author: [
          {
            "@type": "Organization",
            name: "Wappkit Team",
          },
        ],
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/_static/favicons/android-chrome-512x512.png"),
            width: 512,
            height: 512,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        articleSection: category.title,
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: absoluteUrl("/blog"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: category.title,
            item: categoryUrl,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: post.title,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
