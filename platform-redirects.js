/**
 * Build the Vercel platform redirects into a Next.js config array.
 * Vercel reads vercel.json redirects itself; Next.js does not. Without this,
 * all 90 legacy 301s become 404s after leaving Vercel.
 */
const { readFileSync } = require("node:fs");
const { join } = require("node:path");

const platformRedirects = (() => {
  try {
    const raw = readFileSync(join(__dirname, "vercel.json"), "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.redirects)) return [];
    return parsed.redirects.map((entry) => ({
      source: entry.source,
      destination: entry.destination,
      permanent: entry.statusCode === 301 || entry.permanent === true,
    }));
  } catch {
    return [];
  }
})();

module.exports = { platformRedirects };
