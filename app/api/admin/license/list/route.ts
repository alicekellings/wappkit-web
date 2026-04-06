import { NextRequest, NextResponse } from "next/server";

import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import { flattenLicenseRecordEntries, getLicenseStore } from "@/lib/licenses";
import { getDisplayProductName } from "@/lib/tools";

export async function GET(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json(
      { success: false, message: "Admin login required." },
      { status: 401 },
    );
  }

  try {
    const store = getLicenseStore();
    const records = await store.listAllRecords();
    const items = records
      .flatMap((record) => flattenLicenseRecordEntries(record))
      .map((item) => ({
        ...item,
        productName: getDisplayProductName(item.toolSlug, item.productName),
      }))
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

    return NextResponse.json({
      success: true,
      data: {
        items,
        summary: {
          total: items.length,
          active: items.filter((item) => item.status === "active").length,
          inactive: items.filter((item) => item.status === "inactive").length,
          disabled: items.filter((item) => item.status === "disabled").length,
          bound: items.filter((item) => item.boundDevice).length,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load license records.",
      },
      { status: 500 },
    );
  }
}
