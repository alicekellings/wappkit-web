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
  // Desk bylines: accountable editorial identities, not fabricated individuals.
  // Each desk owns a content type, so readers can tell research from walkthroughs.
  "wappkit-research": {
    name: "Wappkit Research Desk",
    image: "/_static/favicons/android-chrome-512x512.png",
  },
  "wappkit-product": {
    name: "Wappkit Product Notes",
    image: "/_static/favicons/android-chrome-512x512.png",
  },
  "wappkit-editorial": {
    name: "Wappkit Editorial",
    image: "/_static/favicons/android-chrome-512x512.png",
  },
};
