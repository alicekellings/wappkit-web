/**
 * Post-build: expose prerendered pages to the worker through static assets.
 *
 * The static-assets incremental cache reads pages from
 * `cdn-cgi/_next_cache/<buildId>/<route>.cache` inside the ASSETS bundle,
 * while OpenNext writes them to `.open-next/cache/<buildId>/`.
 * Without this copy every prerendered route 404s.
 */
const { cpSync, existsSync, readFileSync, rmSync } = require("node:fs");
const { join } = require("node:path");

const root = __dirname;
const buildId = readFileSync(join(root, ".next", "BUILD_ID"), "utf8").trim();
const source = join(root, ".open-next", "cache", buildId);
const target = join(root, ".open-next", "assets", "cdn-cgi", "_next_cache", buildId);

if (!existsSync(source)) {
  console.error(`[postbuild] cache source missing: ${source}`);
  process.exit(1);
}

rmSync(join(root, ".open-next", "assets", "cdn-cgi"), { recursive: true, force: true });
cpSync(source, target, { recursive: true });
console.log(`[postbuild] mounted prerendered pages: ${buildId} -> cdn-cgi/_next_cache/${buildId}`);
