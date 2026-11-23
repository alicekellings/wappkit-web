// Published store listings for Reddit Reader. One source of truth so the
// homepage, blog CTAs and product page cannot drift apart.
export const REDDIT_READER = {
  slug: "reddit-viewer-extension",
  chrome:
    "https://chromewebstore.google.com/detail/akgmihlphnhaejbhpmcjckpdogbplcng",
  edge: "https://microsoftedge.microsoft.com/addons/detail/jfanggdobljmlaohcldjoafnigmhfogh",
} as const;