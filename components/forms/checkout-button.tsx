"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type CheckoutButtonProps = {
  toolSlug: string;
  label: string;
};

export function CheckoutButton({ toolSlug, label }: CheckoutButtonProps) {
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

      const payload = (await response.json()) as { checkoutUrl?: string; error?: string };

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
        rounded="full"
        variant="outline"
        onClick={handleCheckout}
        disabled={isPending}
      >
        {isPending ? "Redirecting..." : label}
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
