export type FaqItem = { q: string; a: string };

/**
 * FAQ copy shared by the visible block and the FAQPage JSON-LD. Keeping one
 * source prevents the structured data from drifting away from the page.
 */
export const FAQ_BY_KEY: Record<string, FaqItem[]> = {
  "best-reddit-viewers-2025": [
    {
      q: "What is the best free Reddit viewer in 2026?",
      a: "It depends on what you want to do. For reading public threads in a browser without logging in, the free tier of Reddit Reader covers reader mode, one highlighted keyword and three Markdown exports. If you need CSV data, filtering or bulk collection, a desktop tool fits better than a browser viewer.",
    },
    {
      q: "Can I read Reddit without an account?",
      a: "Public threads can be read without signing in. Reddit shows a login prompt and app banners over the page, which a reader mode hides. Private, quarantined and age-restricted communities still require an account, and no viewer can change that.",
    },
    {
      q: "Do Reddit viewers still work after the 2023 API changes?",
      a: "Proxied frontends such as Teddit and Libreddit lost most of their public instances. Tools that read the page you already opened, like a browser extension, keep working because they do not depend on a hosted API. Tools that call the API on your behalf are the ones that break.",
    },
    {
      q: "Is a Reddit viewer browser extension safe to install?",
      a: "Check the permissions rather than the description. Reddit Reader asks for activeTab, scripting and storage, and it reads the current tab only after you click its toolbar icon. It does not run in the background or on other websites.",
    },
    {
      q: "Does Reddit Reader work in Microsoft Edge?",
      a: "Yes. It is published on both the Chrome Web Store and Microsoft Edge Add-ons. Installation is the same: add it from the store, then click the toolbar icon on a Reddit thread.",
    },
    {
      q: "How is a viewer different from the browser's own find function?",
      a: "Ctrl+F jumps between matches one at a time and forgets them when you close the bar. A keyword viewer keeps your words highlighted across the post and its comments while you scroll, which is what makes long threads readable.",
    },
  ],
  "tools/reddit-viewer-extension": [
    {
      q: "Is Reddit Reader free?",
      a: "Yes. The free tier includes reader mode, one highlighted keyword and three Markdown exports. Pro is a one-time $4.99 license, not a subscription.",
    },
    {
      q: "What does Pro unlock?",
      a: "Pro removes the keyword limit and the export limit. Reader mode, the toolbar flow and the Markdown format are the same in both tiers.",
    },
    {
      q: "Does it work without a Reddit account?",
      a: "Yes. The extension reads the thread you already opened, so you can stay logged out. Private and quarantined communities still need an account, and the extension does not bypass that.",
    },
    {
      q: "Which browsers and systems are supported?",
      a: "Chrome and Microsoft Edge on Windows, macOS and Linux. There is no installer and no separate Wappkit account; installation happens in the browser store.",
    },
    {
      q: "Does it send my Reddit data anywhere?",
      a: "No. The page content is processed locally in the tab. The only network call is license validation against wappkit.com, which sends the license key, a random device ID and a fixed device name.",
    },
  ],
};

export function getFaq(key: string): FaqItem[] | undefined {
  return FAQ_BY_KEY[key];
}