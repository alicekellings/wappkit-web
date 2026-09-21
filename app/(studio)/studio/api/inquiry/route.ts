import { NextRequest, NextResponse } from "next/server";

import { canSendStudioInquiry, sendStudioInquiryEmail } from "@/lib/inquiry-email";
import { studioInquirySchema } from "@/lib/validations/inquiry";

/**
 * Studio 咨询表单的接收端点。
 *
 * 注意路径：页面跑在 studio.wappkit.com 子域上时，
 * next.config.js 会把 /api/inquiry 改写成 /studio/api/inquiry，
 * 因此本文件位于 app/(studio)/studio/api/inquiry。
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = studioInquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please check the form and try again." },
        { status: 400 },
      );
    }

    // 蜜罐命中：当成功返回，但不做任何事，避免给爬虫反馈
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    if (!canSendStudioInquiry()) {
      console.error("Studio inquiry email is not configured.", {
        hasResendKey: Boolean(process.env.RESEND_API_KEY),
        hasEmailFrom: Boolean(process.env.EMAIL_FROM),
        hasRecipient: Boolean(
          process.env.STUDIO_INQUIRY_TO ?? process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
        ),
      });

      return NextResponse.json(
        { error: "Inquiries are temporarily unavailable. Please email us directly." },
        { status: 503 },
      );
    }

    await sendStudioInquiryEmail(parsed.data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to handle studio inquiry.", { error });

    return NextResponse.json(
      { error: "Something went wrong. Please email us directly." },
      { status: 500 },
    );
  }
}
