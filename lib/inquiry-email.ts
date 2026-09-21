import { Resend } from "resend";

import { getTrimmedEnv } from "@/lib/env-utils";
import { escapeHtml } from "@/lib/input-utils";
import type { StudioInquiryInput } from "@/lib/validations/inquiry";

function getResendClient() {
  const apiKey = getTrimmedEnv("RESEND_API_KEY");

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

/** 咨询邮件发到哪里；默认回落到站点的 support 邮箱 */
function getInquiryRecipient() {
  return (
    getTrimmedEnv("STUDIO_INQUIRY_TO") ??
    getTrimmedEnv("NEXT_PUBLIC_SUPPORT_EMAIL") ??
    null
  );
}

export function canSendStudioInquiry() {
  return Boolean(
    getTrimmedEnv("RESEND_API_KEY") &&
      getTrimmedEnv("EMAIL_FROM") &&
      getInquiryRecipient(),
  );
}

type InquiryRow = { label: string; value?: string };

export async function sendStudioInquiryEmail(inquiry: StudioInquiryInput) {
  const resend = getResendClient();
  const emailFrom = getTrimmedEnv("EMAIL_FROM");
  const recipient = getInquiryRecipient();

  if (!resend || !emailFrom || !recipient) {
    throw new Error("Inquiry email delivery is not configured yet.");
  }

  const rows: InquiryRow[] = [
    { label: "Name", value: inquiry.name },
    { label: "Email", value: inquiry.email },
    { label: "Company", value: inquiry.company },
    { label: "Tier", value: inquiry.tier },
    { label: "Platform", value: inquiry.platform },
    { label: "Budget", value: inquiry.budget },
  ];

  const htmlRows = rows
    .filter((row) => row.value)
    .map(
      (row) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;">${escapeHtml(
          row.label,
        )}</td><td style="padding:4px 0;"><strong>${escapeHtml(
          row.value as string,
        )}</strong></td></tr>`,
    )
    .join("");

  const textRows = rows
    .filter((row) => row.value)
    .map((row) => `${row.label}: ${row.value}`)
    .join("\n");

  return resend.emails.send({
    from: emailFrom,
    to: recipient,
    reply_to: inquiry.email,
    subject: `Studio inquiry — ${inquiry.platform} (${inquiry.tier})`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h1 style="font-size: 20px;">New studio inquiry</h1>
        <table style="border-collapse: collapse; margin-bottom: 16px;">${htmlRows}</table>
        <p style="margin-bottom: 4px;"><strong>Problem</strong></p>
        <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(
          inquiry.problem,
        )}</pre>
      </div>
    `,
    text: `New studio inquiry\n\n${textRows}\n\nProblem\n-------\n${inquiry.problem}`,
  });
}
