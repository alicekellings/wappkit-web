"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Icons } from "./icons";

interface CopyButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string;
  idleLabel?: string;
  copiedLabel?: string;
  showText?: boolean;
}

export function CopyButton({
  value,
  className,
  idleLabel = "Copy",
  copiedLabel = "Copied",
  showText = false,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (!hasCopied) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setHasCopied(false);
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [hasCopied]);

  const handleCopyValue = async (nextValue: string) => {
    await navigator.clipboard.writeText(nextValue);
    setHasCopied(true);
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      className={cn(
        showText
          ? "z-10 h-10 gap-2 rounded-full border border-input bg-background px-4 text-foreground hover:bg-accent"
          : "z-10 size-[30px] border border-white/25 bg-zinc-900 p-1.5 text-primary-foreground hover:text-foreground dark:text-foreground",
        className,
      )}
      onClick={() => {
        void handleCopyValue(value);
      }}
      {...props}
    >
      <span className="sr-only">{hasCopied ? copiedLabel : idleLabel}</span>
      {hasCopied ? (
        <Icons.check className="size-4" />
      ) : (
        <Icons.copy className="size-4" />
      )}
      {showText ? (
        <span className="text-sm font-medium">
          {hasCopied ? copiedLabel : idleLabel}
        </span>
      ) : null}
    </Button>
  );
}
