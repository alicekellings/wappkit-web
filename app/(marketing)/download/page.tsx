import Link from "next/link";

import { redditToolboxDesktopRelease } from "@/lib/desktop-release";
import { constructMetadata, formatDate } from "@/lib/utils";
import { tools } from "@/lib/tools";
import { Button } from "@/components/ui/button";

export const metadata = constructMetadata({
  title: "Download Center | Wappkit",
  description:
    "Download the latest Wappkit desktop build, verify the release, and jump into product pages for setup and licensing details.",
});

export default function DownloadPage() {
  const upcomingTools = tools.filter((tool) => tool.slug !== "reddit-toolbox");

  return (
    <div className="container max-w-6xl py-16 md:py-20">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Download Center
        </p>
        <h1 className="font-heading text-4xl text-foreground md:text-5xl">
          Download the latest Reddit Toolbox desktop build.
        </h1>
        <p className="text-lg text-muted-foreground">
          The main buying flow still lives on the product page. This download
          center is the clean handoff for users who already want the Windows
          build, release notes, and verification details in one place.
        </p>
      </div>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border bg-card p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Windows release
            </span>
            <span className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Version {redditToolboxDesktopRelease.version}
            </span>
            <span className="rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Released {formatDate(redditToolboxDesktopRelease.releasedAt)}
            </span>
          </div>

          <h2 className="mt-6 font-heading text-3xl text-foreground md:text-4xl">
            Reddit Toolbox for Windows
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Download the current production desktop build, activate it with your
            Wappkit license key, and keep the release URL stable for future app
            updates.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={redditToolboxDesktopRelease.directDownloadUrl}>
              <Button rounded="full" size="lg">
                Download `.exe`
              </Button>
            </Link>
            <Link href={redditToolboxDesktopRelease.releaseUrl}>
              <Button rounded="full" size="lg" variant="outline">
                View GitHub Release
              </Button>
            </Link>
            <Link href="/tools/reddit-toolbox">
              <Button rounded="full" size="lg" variant="ghost">
                Open Product Page
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                File
              </p>
              <p className="mt-3 text-sm font-medium text-foreground">
                {redditToolboxDesktopRelease.fileName}
              </p>
            </div>
            <div className="rounded-3xl border bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Size
              </p>
              <p className="mt-3 text-sm font-medium text-foreground">
                {redditToolboxDesktopRelease.fileSizeLabel}
              </p>
            </div>
            <div className="rounded-3xl border bg-background p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Checksum
              </p>
              <Link
                href={redditToolboxDesktopRelease.checksumUrl}
                className="mt-3 block text-sm font-medium text-primary"
              >
                Download SHA256 file
              </Link>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              SHA256
            </p>
            <p className="mt-3 break-all font-mono text-sm text-foreground">
              {redditToolboxDesktopRelease.sha256}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border bg-card p-6">
            <h3 className="font-heading text-2xl text-foreground">
              Release highlights
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
              {redditToolboxDesktopRelease.changelog.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border bg-card p-6">
            <h3 className="font-heading text-2xl text-foreground">
              After download
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Install the app, try the free Reddit collector, then activate your
              paid license inside the desktop app when you want the full
              workflow.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/license">
                <Button rounded="full" variant="outline">
                  License Guide
                </Button>
              </Link>
              <Link href="/license/retrieve">
                <Button rounded="full" variant="ghost">
                  Retrieve License
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Other tools
          </p>
          <h2 className="mt-2 font-heading text-3xl text-foreground">
            More Wappkit products can be added here later.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {upcomingTools.map((tool) => (
            <div key={tool.slug} className="rounded-3xl border bg-card p-6">
              <h3 className="font-heading text-2xl text-foreground">
                {tool.name}
              </h3>
              <p className="mt-3 text-muted-foreground">
                {tool.shortDescription}
              </p>
              <div className="mt-6">
                <Link href={`/tools/${tool.slug}`}>
                  <Button rounded="full" variant="outline">
                    Open Product Page
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
