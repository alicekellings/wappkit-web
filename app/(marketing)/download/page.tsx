import Link from "next/link";

import { aiEcomVisualStudioRelease } from "@/lib/ai-ecom-visual-studio-release";
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
    "Download Wappkit desktop tools, verify releases, and jump into product pages for setup and licensing details.",
});

export default function DownloadPage() {
  const otherTools = tools.filter((tool) => tool.slug !== "reddit-toolbox");

  return (
    <MarketingPageShell>
      <MarketingHero
        eyebrow="Download Center"
        title="Download Wappkit desktop tools from one place."
        description="Use this page as the clean handoff for Windows installers, release checksums, product pages, and activation details as each tool becomes ready for distribution."
        badges={[
          { label: "Windows tools", tone: "warm" },
          {
            label: `Reddit Toolbox ${redditToolboxDesktopRelease.version}`,
            tone: "muted",
          },
          {
            label: `Latest release ${formatDate(redditToolboxDesktopRelease.releasedAt)}`,
          },
          {
            label: `Image Studio ${aiEcomVisualStudioRelease.version}`,
            tone: "muted",
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
            <Link href="/tools">
              <Button rounded="full" size="lg" variant="ghost">
                Browse Product Pages
              </Button>
            </Link>
          </>
        }
        stats={[
          { label: "Ready download", value: "Reddit Toolbox" },
          { label: "File", value: redditToolboxDesktopRelease.fileName },
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

      <section className="mt-10">
        <MarketingSectionIntro
          eyebrow="Desktop tools"
          title="Each product can ship on the same download surface."
          description="Tools with a packaged installer get direct download buttons. Tools that are still being packaged stay visible here with their product page, purchase flow, and release status."
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <MarketingCard id="reddit-toolbox" tone="soft" className="p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                Installer ready
              </span>
              <span className="text-sm text-muted-foreground">
                {redditToolboxDesktopRelease.fileSizeLabel}
              </span>
            </div>
            <h2 className="mt-5 font-heading text-2xl text-foreground">
              Reddit Toolbox
            </h2>
            <p className="mt-3 text-muted-foreground">
              Download the current Windows installer and verify it with the
              published SHA256 checksum.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={redditToolboxDesktopRelease.directDownloadUrl}>
                <Button rounded="full">Download</Button>
              </Link>
              <Link href="/tools/reddit-toolbox">
                <Button rounded="full" variant="outline">
                  Product Page
                </Button>
              </Link>
            </div>
          </MarketingCard>

          {otherTools.map((tool) => {
            const isImageStudio = tool.slug === aiEcomVisualStudioRelease.toolSlug;
            const hasImageStudioInstaller =
              isImageStudio && aiEcomVisualStudioRelease.directDownloadUrl;

            return (
              <MarketingCard
                key={tool.slug}
                id={tool.slug}
                tone="soft"
                className="p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {hasImageStudioInstaller
                      ? "Installer ready"
                      : tool.status === "live"
                        ? "Packaging"
                        : "Planned"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {isImageStudio
                      ? aiEcomVisualStudioRelease.fileSizeLabel
                      : tool.platform}
                  </span>
                </div>
                <h2 className="mt-5 font-heading text-2xl text-foreground">
                  {tool.name}
                </h2>
                <p className="mt-3 text-muted-foreground">
                  {isImageStudio
                    ? hasImageStudioInstaller
                      ? "Download the current Windows installer, then buy or retrieve a Wappkit license when the paid workflow is needed."
                      : "The release API is ready. Upload the signed installer and set AI_ECOM_VISUAL_STUDIO_DOWNLOAD_URL to show the public download button."
                    : tool.status === "live"
                      ? "The product page and checkout path are being prepared. The public installer link should be added after the signed build is uploaded."
                      : tool.shortDescription}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {hasImageStudioInstaller ? (
                    <Link href={aiEcomVisualStudioRelease.directDownloadUrl!}>
                      <Button rounded="full">Download</Button>
                    </Link>
                  ) : null}
                  <Link href={`/tools/${tool.slug}`}>
                    <Button
                      rounded="full"
                      variant={hasImageStudioInstaller ? "outline" : "outline"}
                    >
                      Product Page
                    </Button>
                  </Link>
                  <Link href={tool.docsHref}>
                    <Button rounded="full" variant="ghost">
                      Activation Guide
                    </Button>
                  </Link>
                </div>
              </MarketingCard>
            );
          })}
        </div>
      </section>

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
          eyebrow="Release checklist"
          title="Before a new installer becomes public, keep the release details explicit."
          description="For AI E-commerce Visual Studio, the next website step is to upload a signed Windows build, publish its checksum, then replace the packaging note with a direct download button."
        />
      </section>
    </MarketingPageShell>
  );
}
