import Link from "next/link";

import { redditToolboxDesktopRelease } from "@/lib/desktop-release";
import { tools } from "@/lib/tools";
import { constructMetadata, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  MarketingCard,
  MarketingHero,
  MarketingPageShell,
  MarketingSectionIntro,
} from "@/components/marketing/page-shell";

export const metadata = constructMetadata({
  title: "Download Center | Wappkit",
  description:
    "Download the latest Wappkit desktop build, verify the release, and jump into product pages for setup and licensing details.",
});

export default function DownloadPage() {
  const upcomingTools = tools.filter((tool) => tool.slug !== "reddit-toolbox");

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Download Center"
        title="Download the latest Reddit Toolbox desktop build."
        description="This is the clean handoff for users who already want the Windows installer, GitHub release, checksum, and activation details in one place."
        badges={[
          { label: "Windows release", tone: "warm" },
          {
            label: `Version ${redditToolboxDesktopRelease.version}`,
            tone: "muted",
          },
          {
            label: `Released ${formatDate(redditToolboxDesktopRelease.releasedAt)}`,
          },
        ]}
        actions={
          <>
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
          </>
        }
        stats={[
          { label: "File", value: redditToolboxDesktopRelease.fileName },
          { label: "Size", value: redditToolboxDesktopRelease.fileSizeLabel },
          { label: "Checksum", value: "SHA256 published" },
        ]}
        rightContent={
          <MarketingCard tone="dark" className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Release highlights
            </p>
            <div className="space-y-3">
              {redditToolboxDesktopRelease.changelog.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </MarketingCard>
        }
      >
        <div className="rounded-3xl border border-orange-200 bg-orange-50/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-700">
            SHA256
          </p>
          <p className="mt-3 break-all font-mono text-sm text-foreground">
            {redditToolboxDesktopRelease.sha256}
          </p>
          <Link
            href={redditToolboxDesktopRelease.checksumUrl}
            className="mt-4 inline-block text-sm font-medium text-orange-700"
          >
            Download SHA256 file
          </Link>
        </div>
      </MarketingHero>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <MarketingCard tone="soft">
          <MarketingSectionIntro
            eyebrow="After download"
            title="Install first, unlock later when the workflow proves itself."
            description="Users can start with the free Reddit collector, then activate the paid license inside the desktop app when they want the full workflow."
          />
          <div className="mt-6 flex flex-wrap gap-3">
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
        </MarketingCard>

        <MarketingCard tone="warm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
            Verification tip
          </p>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Compare the SHA256 shown here against the downloaded checksum file
            before distributing or archiving the installer.
          </p>
        </MarketingCard>
      </section>

      <section className="mt-10">
        <MarketingSectionIntro
          eyebrow="Other tools"
          title="More Wappkit products can grow into the same download surface."
          description="The release infrastructure is already in place, so future desktop tools can slot into this page without inventing a new pattern."
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {upcomingTools.map((tool) => (
            <MarketingCard key={tool.slug} tone="soft" className="p-6">
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
            </MarketingCard>
          ))}
        </div>
      </section>
    </MarketingPageShell>
  );
}
