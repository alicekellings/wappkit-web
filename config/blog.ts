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

export const BLOG_AUTHORS = {
  wappkit: {
    name: "Wappkit Team",
    image: "/_static/avatars/mickasmt.png",
    twitter: "wappkit",
  },
};
