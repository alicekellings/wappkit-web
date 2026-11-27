"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

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
    trackEvent("purchase_completed", {
      tool: toolSlug || "unknown",
      campaign_source:
        window.sessionStorage.getItem("wappkit.campaign-source") ?? "direct",
    });
  }, [checkoutId, toolSlug]);

  return null;
}
