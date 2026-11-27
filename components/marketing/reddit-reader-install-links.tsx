import { Download } from "lucide-react";

import { REDDIT_READER } from "@/lib/store-links";
import { buttonVariants } from "@/components/ui/button";

const stores = [
  { id: "chrome", label: "Chrome" },
  { id: "edge", label: "Edge" },
  { id: "firefox", label: "Firefox" },
] as const;

export function RedditReaderInstallLinks({
  source,
  includeFirefox,
  compact = false,
}: {
  source: "tool_hero" | "article_top";
  includeFirefox: boolean;
  compact?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label="Install Reddit Reader"
      className="flex flex-wrap gap-2"
    >
      {stores
        .filter(({ id }) => id !== "firefox" || includeFirefox)
        .map(({ id, label }) => (
          <a
            key={id}
            href={REDDIT_READER[id]}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({
              rounded: "full",
              size: compact ? "sm" : "default",
              variant: id === "chrome" ? "default" : "outline",
            })}
            data-umami-event="extension_install_clicked"
            data-umami-event-store={id}
            data-umami-event-source={source}
          >
            {id === "chrome" && (
              <Download aria-hidden="true" className="mr-1.5 size-4" />
            )}
            Add to {label}
          </a>
        ))}
    </div>
  );
}
