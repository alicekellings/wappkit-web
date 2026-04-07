import { SidebarNavItem, SiteConfig } from "types";
import { env } from "@/env.mjs";

const site_url = env.NEXT_PUBLIC_APP_URL;

export const siteConfig: SiteConfig = {
  name: "Wappkit",
  description:
    "Wappkit is a multi-tool product site for focused desktop and web utilities, with clear docs, simple licensing, and practical guides.",
  url: site_url,
  ogImage: `${site_url}/_static/og.jpg`,
  links: {
    twitter: "https://x.com/wappkit",
    github: "https://github.com/alicekellings/wappkit-web",
  },
  mailSupport: env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "asphero@gmail.com",
};

export const footerLinks: SidebarNavItem[] = [
  {
    title: "Platform",
    items: [
      { title: "Home", href: "/" },
      { title: "Tools", href: "/tools" },
      { title: "Blog", href: "/blog" },
      { title: "Docs", href: "/docs" },
    ],
  },
  {
    title: "Support",
    items: [
      { title: "License Center", href: "/license" },
      { title: "Retrieve License", href: "/license/retrieve" },
      { title: "Contact", href: "/contact" },
      { title: "Terms", href: "/terms" },
      { title: "Privacy", href: "/privacy" },
    ],
  },
  {
    title: "Products",
    items: [
      { title: "Reddit Toolbox", href: "/tools/reddit-toolbox" },
      { title: "Download Center", href: "/download" },
      { title: "Activation Guide", href: "/docs/checkout-and-activation" },
      { title: "License Retrieval", href: "/docs/license-retrieval" },
    ],
  },
];
