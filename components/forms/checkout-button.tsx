"use client";

import { useState } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";

type CheckoutButtonProps = {
  toolSlug: string;
  label: string;
  className?: string;
  rounded?: ButtonProps["rounded"];
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
};

export function CheckoutButton({
  toolSlug,
  label,
  className,
  rounded = "full",
  size = "default",
  variant = "outline",
}: CheckoutButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    try {
      setIsPending(true);
      setError(null);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolSlug,
        }),
      });

      const payload = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !payload.checkoutUrl) {
        throw new Error(payload.error ?? "Failed to create checkout.");
      }

      window.location.href = payload.checkoutUrl;
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to start checkout.",
      );
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        className={className}
        rounded={rounded}
        size={size}
        variant={variant}
        onClick={handleCheckout}
        disabled={isPending}
      >
        {isPending ? "Redirecting..." : label}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
