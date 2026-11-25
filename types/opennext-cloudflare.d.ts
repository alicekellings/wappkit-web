/**
 * Type shim for the static-assets incremental cache.
 *
 * The package's exports map ("./*" -> "./dist/api/*.js") resolves this subpath
 * at runtime, but the project's `moduleResolution` cannot pick up the adjacent
 * .d.ts. Declaring the module here keeps `next build` type-checking happy
 * without changing the global TypeScript configuration.
 */
declare module "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache" {
  import type { IncrementalCache } from "@opennextjs/aws/dist/types/overrides";

  const cache: IncrementalCache;
  export default cache;
}
