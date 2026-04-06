import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type MarketingBadge = {
  label: string;
  tone?: "warm" | "muted" | "default";
};

type MarketingStat = {
  label: string;
  value: string;
};

const badgeToneClasses: Record<NonNullable<MarketingBadge["tone"]>, string> = {
  warm: "border-orange-200 bg-orange-50 text-orange-700",
  muted: "bg-muted text-muted-foreground",
  default: "border border-border/70 bg-background/80 text-muted-foreground",
};

export function MarketingPageShell({
  children,
  className,
  containerClassName,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.2),transparent_28%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.14),transparent_24%),linear-gradient(to_bottom,#ffffff,#fffbf5_42%,#ffffff)]" />
      <div
        className={cn("container max-w-6xl py-16 md:py-20", containerClassName)}
      >
        {children}
      </div>
    </div>
  );
}

export function MarketingHero({
  eyebrow,
  title,
  description,
  badges,
  actions,
  stats,
  rightContent,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  badges?: MarketingBadge[];
  actions?: ReactNode;
  stats?: MarketingStat[];
  rightContent?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/90 p-8 shadow-[0_24px_80px_-32px_rgba(15,23,42,0.22)] md:p-10 lg:p-12",
        className,
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent" />
      <div
        className={cn(
          "gap-10",
          rightContent
            ? "grid lg:grid-cols-[1.08fr_0.92fr] lg:items-center"
            : "flex flex-col",
        )}
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-heading text-4xl leading-tight text-foreground md:text-5xl xl:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            {description}
          </p>

          {badges?.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={cn(
                    "rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
                    badgeToneClasses[badge.tone ?? "default"],
                  )}
                >
                  {badge.label}
                </span>
              ))}
            </div>
          ) : null}

          {actions ? (
            <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
          ) : null}

          {stats?.length ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-border/70 bg-background/90 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-base font-semibold text-foreground">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {children ? <div className="mt-8">{children}</div> : null}
        </div>

        {rightContent ? <div className="relative">{rightContent}</div> : null}
      </div>
    </section>
  );
}

export function MarketingCard({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "dark" | "warm" | "soft";
}) {
  const toneClasses = {
    default: "border border-border/70 bg-card text-foreground",
    dark: "border border-slate-800 bg-slate-950 text-white",
    warm: "border border-orange-200 bg-orange-50/70 text-foreground",
    soft: "border border-border/70 bg-background/85 text-foreground",
  } as const;

  return (
    <div
      className={cn(
        "rounded-[1.8rem] p-8 shadow-sm",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MarketingSectionIntro({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-heading text-3xl text-foreground md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function MarketingCtaBand({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[1.8rem] border border-orange-200 bg-[linear-gradient(135deg,rgba(255,247,237,0.95),rgba(255,255,255,0.98))] p-8 md:p-10",
        className,
      )}
    >
      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-700">
            {eyebrow}
          </p>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl text-foreground md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
        </div>
        {children ? children : null}
      </div>
    </section>
  );
}
