import { NextRequest, NextResponse } from "next/server";

import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import { getLicenseStore, type LicenseRecord } from "@/lib/licenses";
import { getDisplayProductName } from "@/lib/tools";
import { adminLicenseSearchSchema } from "@/lib/validations/license";

export async function POST(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json(
      { success: false, message: "Admin login required." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const parsed = adminLicenseSearchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            parsed.error.issues[0]?.message ??
            "Enter a valid order lookup or license key.",
        },
        { status: 400 },
      );
    }

    const store = getLicenseStore();
    let record: LicenseRecord | null = null;
    let lookupMode: "licenseKey" | "orderId" | "orderAndEmail" = "orderId";

    if (parsed.data.licenseKey) {
      lookupMode = "licenseKey";
      record = await store.findByLicenseKey({
        licenseKey: parsed.data.licenseKey,
      });
    } else if (parsed.data.email) {
      lookupMode = "orderAndEmail";
      record = await store.findByOrderAndEmail({
        orderId: parsed.data.orderId!,
        email: parsed.data.email,
      });
    } else {
      record = await store.getByOrderId(parsed.data.orderId!);
    }

    if (!record) {
      return NextResponse.json(
        {
          success: false,
          message: "No matching license record was found for that admin lookup.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        lookupMode,
        orderId: record.orderId,
        customerEmail: record.customerEmail,
        customerName: record.customerName,
        productName: getDisplayProductName(record.toolSlug, record.productName),
        toolSlug: record.toolSlug,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        licenseKeys: record.licenseKeys,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load the license record.",
      },
      { status: 500 },
    );
  }
}
