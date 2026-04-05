import { Resend } from "resend";

import { getTrimmedEnv } from "@/lib/env-utils";
import type { LicenseRecord } from "@/lib/licenses";
import { getDisplayProductName } from "@/lib/tools";

function getResendClient() {
  const apiKey = getTrimmedEnv("RESEND_API_KEY");

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

export function canSendLicenseEmail() {
  return Boolean(getTrimmedEnv("RESEND_API_KEY") && getTrimmedEnv("EMAIL_FROM"));
}

export async function sendLicenseEmail(record: LicenseRecord) {
  const resend = getResendClient();
  const emailFrom = getTrimmedEnv("EMAIL_FROM");
  const productName = getDisplayProductName(record.toolSlug, record.productName);

  if (!resend || !emailFrom) {
    throw new Error("Email delivery is not configured yet.");
  }

  const licenseList = record.licenseKeys
    .map((item) => `<li><code>${item.key}</code> <span>(${item.status})</span></li>`)
    .join("");

  const textList = record.licenseKeys
    .map((item) => `- ${item.key} (${item.status})`)
    .join("\n");

  return resend.emails.send({
    from: emailFrom,
    to: record.customerEmail,
    subject: `Your Wappkit license for ${productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="font-size: 20px;">Your Wappkit license</h1>
        <p>Here is a copy of the license for <strong>${productName}</strong>.</p>
        <ul>${licenseList}</ul>
        <p>Order ID: <strong>${record.orderId}</strong></p>
        <p>If you did not request this email, you can ignore it.</p>
      </div>
    `,
    text: `Your Wappkit license for ${productName}\n\n${textList}\n\nOrder ID: ${record.orderId}`,
  });
}
