import { NextRequest, NextResponse } from "next/server";

import { isAdminRequestAuthenticated } from "@/lib/admin-auth";
import {
  findLicenseKeyRecord,
  getLicenseStore,
  unbindDeviceFromLicenseKey,
} from "@/lib/licenses";
import { adminLicenseUnbindSchema } from "@/lib/validations/license";

export async function POST(request: NextRequest) {
  if (!isAdminRequestAuthenticated(request)) {
    return NextResponse.json(
      { success: false, message: "Admin login required." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const parsed = adminLicenseUnbindSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Enter a valid license key." },
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

    if (!license.boundDevice) {
      return NextResponse.json({
        success: true,
        message: "This license is already not bound to a device.",
        data: {
          licenseKey: license.key,
          status: license.status,
          boundDevice: null,
        },
      });
    }

    const updatedRecord = unbindDeviceFromLicenseKey(record, parsed.data.licenseKey);
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
      message: "The device binding has been removed from this license.",
      data: {
        licenseKey: updatedLicense?.key ?? parsed.data.licenseKey,
        status: updatedLicense?.status ?? "inactive",
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
            : "Failed to remove the device binding.",
      },
      { status: 500 },
    );
  }
}
