"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics/react";

type PurchaseCompleteTrackerProps = {
  checkoutId: string;
  toolSlug: string;
};

export function PurchaseCompleteTracker({
  checkoutId,
  toolSlug,
}: PurchaseCompleteTrackerProps) {
  useEffect(() => {
    if (!checkoutId) {
      return;
    }

    const storageKey = `wappkit.purchase-complete.${checkoutId}`;

    if (window.sessionStorage.getItem(storageKey)) {
      return;
    }

    window.sessionStorage.setItem(storageKey, "1");
    track("purchase_completed", { tool: toolSlug || "unknown" });
  }, [checkoutId, toolSlug]);

  return null;
}
