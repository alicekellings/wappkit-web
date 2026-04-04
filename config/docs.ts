import { DocsConfig } from "types";

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
    },
    {
      title: "License Center",
      href: "/license",
    },
  ],
  sidebarNav: [
    {
      title: "Getting Started",
      items: [
        {
          title: "Introduction",
          href: "/docs",
        },
        {
          title: "Installation",
          href: "/docs/installation",
        },
        {
          title: "Checkout and Activation",
          href: "/docs/checkout-and-activation",
        },
        {
          title: "License Retrieval",
          href: "/docs/license-retrieval",
        },
      ],
    },
  ],
};
