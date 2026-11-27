// Published store listings for Reddit Reader. One source of truth so the
// homepage, blog CTAs and product page cannot drift apart.
export const REDDIT_READER = {
  slug: "reddit-viewer-extension",
  chrome:
    "https://chromewebstore.google.com/detail/akgmihlphnhaejbhpmcjckpdogbplcng",
  edge: "https://microsoftedge.microsoft.com/addons/detail/jfanggdobljmlaohcldjoafnigmhfogh",
  firefox: "https://addons.mozilla.org/en-US/firefox/addon/reddit-reader-clean-view/",
} as const;

// TabMem is Edge-only for now. Chrome is at its 2-item quota.
export const TABMEM = {
  slug: "tabmem",
  edge: "https://microsoftedge.microsoft.com/addons/detail/bphjigcpkkkgoccgpnnccojebmlpllnh",
} as const;

// Auto Refresh shipped on Edge first; Chrome slot is not available yet.
export const AUTO_REFRESH = {
  slug: "auto-refresh",
  edge: "https://microsoftedge.microsoft.com/addons/detail/ojgecmaoojmoaecppddnmejbjlliolpn",
} as const;