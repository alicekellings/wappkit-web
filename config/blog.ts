export const BLOG_CATEGORIES: {
  title: string;
  slug: "guides" | "updates";
  description: string;
}[] = [
  {
    title: "Guides",
    slug: "guides",
    description: "Practical walkthroughs for Wappkit tools, licensing, and activation.",
  },
  {
    title: "Updates",
    slug: "updates",
    description: "Product updates, release notes, and changes across Wappkit.",
  },
];

export type BlogAuthor = {
  name: string;
  image: string;
  twitter?: string;
};

export const BLOG_AUTHORS: Record<string, BlogAuthor> = {
  wappkit: {
    name: "Wappkit Team",
    image: "/_static/favicons/android-chrome-512x512.png",
    twitter: "wappkit",
  },
};
