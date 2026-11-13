import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { PRODUCT_EVENTS, recordProductEvent } from "@/lib/funnel";
import { getToolBySlug } from "@/lib/tools";

/**
 * 桌面工具报上来的"兴趣"计数。
 *
 * 只收三个字段：哪个工具、什么事件、设备指纹（服务端不落库，只用于去重口径）。
 * 不收查询词、不收结果、不收邮箱——工具端的 ReportEvent 也只发这些。
 *
 * 与 /api/license/auto-activate 一样，这个路径已在 middleware 里豁免地区拦截，
 * 否则国内机器第一次打开 License 页会拿到 403 而静默丢失计数。
 */
const eventSchema = z.object({
  toolSlug: z.string().trim().min(1).max(64),
  event: z.enum(PRODUCT_EVENTS),
  deviceId: z.string().trim().max(96).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const tool = getToolBySlug(parsed.data.toolSlug);
    if (!tool) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }

    await recordProductEvent({
      event: parsed.data.event,
      toolSlug: parsed.data.toolSlug,
    });

    return NextResponse.json({ ok: true });
  } catch {
    // 计数失败绝不能影响工具端：那边是 fire-and-forget，这里也不抛。
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
