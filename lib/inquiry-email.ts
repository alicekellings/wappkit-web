import { getTrimmedEnv } from "@/lib/env-utils";
import { escapeHtml } from "@/lib/input-utils";
import type { StudioInquiryInput } from "@/lib/validations/inquiry";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

/** 把 "Wappkit <support@wappkit.com>" 或 "support@wappkit.com" 解析成 Brevo 要的 {name, email} */
function parseSender(raw: string) {
  const match = raw.match(/^\s*(.*?)\s*<\s*([^>]+)\s*>\s*$/);

  if (match) {
    return { name: match[1] || undefined, email: match[2].trim() };
  }

  return { name: undefined, email: raw.trim() };
}

function getInquiryRecipient() {
  return (
    getTrimmedEnv("STUDIO_INQUIRY_TO") ??
    getTrimmedEnv("NEXT_PUBLIC_SUPPORT_EMAIL") ??
    null
  );
}

export function canSendStudioInquiry() {
  return Boolean(
    getTrimmedEnv("BREVO_API_KEY") &&
      getTrimmedEnv("EMAIL_FROM") &&
      getInquiryRecipient(),
  );
}

type InquiryRow = { label: string; value?: string };

export async function sendStudioInquiryEmail(inquiry: StudioInquiryInput) {
  const apiKey = getTrimmedEnv("BREVO_API_KEY");
  const emailFrom = getTrimmedEnv("EMAIL_FROM");
  const recipient = getInquiryRecipient();

  if (!apiKey || !emailFrom || !recipient) {
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

  const present = rows.filter((row) => row.value);

  const htmlRows = present
    .map(
      (row) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;">${escapeHtml(
          row.label,
        )}</td><td style="padding:4px 0;"><strong>${escapeHtml(
          row.value as string,
        )}</strong></td></tr>`,
    )
    .join("");

  const textRows = present.map((row) => `${row.label}: ${row.value}`).join("\n");

  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: parseSender(emailFrom),
      to: [{ email: recipient }],
      replyTo: { email: inquiry.email, name: inquiry.name },
      subject: `Studio inquiry — ${inquiry.platform} (${inquiry.tier})`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h1 style="font-size: 20px;">New studio inquiry</h1>
          <table style="border-collapse: collapse; margin-bottom: 16px;">${htmlRows}</table>
          <p style="margin-bottom: 4px;"><strong>Problem</strong></p>
          <pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(
            inquiry.problem,
          )}</pre>
        </div>
      `,
      textContent: `New studio inquiry\n\n${textRows}\n\nProblem\n-------\n${inquiry.problem}`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Brevo rejected the message (${response.status}): ${detail.slice(0, 300)}`,
    );
  }

  return response.json().catch(() => ({ ok: true }));
}
