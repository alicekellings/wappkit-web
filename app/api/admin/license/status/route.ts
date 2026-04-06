import { NextRequest, NextResponse } from "next/server";

import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import {
  findLicenseKeyRecord,
  getLicenseStore,
  setLicenseKeyAvailability,
} from "@/lib/licenses";
import { adminLicenseStatusSchema } from "@/lib/validations/license";

export async function POST(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json(
      { success: false, message: "Admin login required." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const parsed = adminLicenseStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Enter a valid license action request." },
        { status: 400 },
      );
    }

    const store = getLicenseStore();
    const record = await store.findByLicenseKey({
      licenseKey: parsed.data.licenseKey,
    });

    if (!record) {
      return NextResponse.json(
        { success: false, message: "This license key could not be matched." },
        { status: 404 },
      );
    }

    const license = findLicenseKeyRecord(record, parsed.data.licenseKey);
    if (!license) {
      return NextResponse.json(
        { success: false, message: "This license key could not be matched." },
        { status: 404 },
      );
    }

    const nextStatus = parsed.data.action === "disable" ? "disabled" : "inactive";
    const updatedRecord = setLicenseKeyAvailability(
      record,
      parsed.data.licenseKey,
      nextStatus,
    );

    if (!updatedRecord) {
      return NextResponse.json(
        { success: false, message: "This license key could not be updated." },
        { status: 500 },
      );
    }

    await store.save(updatedRecord);
    const updatedLicense = findLicenseKeyRecord(updatedRecord, parsed.data.licenseKey);

    return NextResponse.json({
      success: true,
      message:
        parsed.data.action === "disable"
          ? "The license has been disabled and any device binding was cleared."
          : "The license has been re-enabled and is ready to activate again.",
      data: {
        licenseKey: updatedLicense?.key ?? parsed.data.licenseKey,
        status: updatedLicense?.status ?? nextStatus,
        boundDevice: updatedLicense?.boundDevice ?? null,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update the license status.",
      },
      { status: 500 },
    );
  }
}
