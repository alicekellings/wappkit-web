import crypto from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import {
  createLicenseRecordFromCreemCheckout,
  getLicenseStore,
  type CreemCheckoutPayload,
} from "@/lib/licenses";
import { getToolBySlug } from "@/lib/tools";
import { adminCreateQaLicenseSchema } from "@/lib/validations/license";

const PRODUCT_ID_BY_TOOL: Record<string, string> = {
  "ai-ecom-visual-studio": "prod_internal_ai_ecom_visual_studio",
  "wappkit-app-setup": "prod_internal_wappkit_app_setup",
  "reddit-toolbox": "prod_internal_reddit_toolbox",
};

function randomKeyPart(length: number) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.randomBytes(length);

  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function createQaLicenseKey(toolSlug: string) {
  const prefix =
    toolSlug === "ai-ecom-visual-studio"
      ? "WAPPKIT-AIECOM"
      : toolSlug === "wappkit-app-setup"
        ? "WAPPKIT-APPSETUP"
        : "WAPPKIT-QA";

  return `${prefix}-${randomKeyPart(5)}-${randomKeyPart(5)}-${randomKeyPart(5)}`;
}

export async function POST(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json(
      { success: false, message: "Admin login required." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const parsed = adminCreateQaLicenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "Invalid QA license request.",
        },
        { status: 400 },
      );
    }

    const tool = getToolBySlug(parsed.data.toolSlug);
    if (!tool) {
      return NextResponse.json(
        { success: false, message: "Unknown tool slug." },
        { status: 404 },
      );
    }

    const now = new Date().toISOString();
    const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 16);
    const licenseKey = createQaLicenseKey(tool.slug);
    const checkoutPayload: CreemCheckoutPayload = {
      id: `ch_internal_qa_${suffix}`,
      request_id: `req_internal_qa_${suffix}`,
      order: {
        id: `ord_internal_qa_${suffix}`,
        customer: {
          id: `cust_internal_qa_${suffix}`,
          email: "internal-license-test@wappkit.com",
          name: "Wappkit Internal QA",
        },
      },
      product: {
        id: PRODUCT_ID_BY_TOOL[tool.slug] ?? `prod_internal_${tool.slug}`,
        name: tool.name,
      },
      metadata: {
        toolSlug: tool.slug,
        source: "internal-qa-manual",
        createdAt: now,
      },
      license_keys: [
        {
          id: `lic_internal_qa_${suffix}`,
          key: licenseKey,
          status: "inactive",
        },
      ],
    };

    const record = createLicenseRecordFromCreemCheckout(checkoutPayload);
    await getLicenseStore().save(record);

    return NextResponse.json({
      success: true,
      message: "Internal QA license created.",
      data: {
        orderId: record.orderId,
        customerEmail: record.customerEmail,
        productName: tool.name,
        toolSlug: tool.slug,
        licenseKey,
        status: "inactive",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create the internal QA license.",
      },
      { status: 500 },
    );
  }
}
