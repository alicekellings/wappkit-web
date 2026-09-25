import test from "node:test";
import assert from "node:assert/strict";

import {
  bindDeviceToLicenseKey,
  createLicenseRecordFromCreemCheckout,
  createMemoryLicenseStore,
  mergeLicenseRecordFromCheckout,
  setLicenseKeyAvailability,
  type CreemCheckoutPayload,
  type LicenseRecord,
} from "../lib/licenses";

/**
 * 回归测试：Creem webhook 重放必须幂等
 *
 * Creem 在超时/5xx 时会重放同一个 `checkout.completed` 事件，而
 * `createLicenseRecordFromCreemCheckout()` 每次都会造一条全新记录
 * （设备绑定为空、createdAt 重置）。修复前 webhook 直接 `store.save()` 全量覆盖，
 * 于是每次重放都会抹掉设备绑定、清空换机冷却期、并复活被封禁的 key。
 *
 * 这些用例锁定 `mergeLicenseRecordFromCheckout` 的保守合并语义。
 */

const checkoutPayload: CreemCheckoutPayload = {
  id: "chk_replay",
  request_id: "req_replay",
  order: {
    id: "ord_replay",
    customer: {
      id: "cus_replay",
      email: "Buyer@Example.com",
      name: "Buyer",
    },
  },
  product: {
    id: "prod_reddit_toolbox",
    name: "Reddit Toolbox",
  },
  license_keys: [
    {
      id: "lic_replay_1",
      key: "WAAP-REPLAY-KEY-1",
      status: "active",
    },
  ],
  metadata: {
    toolSlug: "reddit-toolbox",
  },
};

function buildFreshRecord(payload: CreemCheckoutPayload = checkoutPayload) {
  return createLicenseRecordFromCreemCheckout(payload);
}

/** 造一条「已经被用户在设备上激活过」的记录 */
function buildActivatedRecord(): LicenseRecord {
  const fresh = buildFreshRecord();
  const bound = bindDeviceToLicenseKey(fresh, "WAAP-REPLAY-KEY-1", {
    deviceId: `hwid_${"a".repeat(64)}`,
    deviceName: "Alice-Laptop",
    recordDeviceTransfer: true,
  });

  assert.ok(bound, "expected the license key to be bound");

  // 把 createdAt 拨到过去，方便验证重放不会把它改成「现在」
  return { ...bound, createdAt: "2026-01-01T00:00:00.000Z" };
}

test("首次入库（库里没有记录）时直接采用新记录", () => {
  const incoming = buildFreshRecord();
  const merged = mergeLicenseRecordFromCheckout(null, incoming);
  assert.deepEqual(merged, incoming);
});

test("重放 webhook 不会抹掉已绑定的设备", () => {
  const existing = buildActivatedRecord();
  const originalDevice = existing.licenseKeys[0]?.boundDevice;

  assert.equal(originalDevice?.deviceName, "Alice-Laptop");

  // 模拟 Creem 重放：payload 完全相同，推导出的记录设备字段是空的
  const replay = buildFreshRecord();
  assert.equal(replay.licenseKeys[0]?.boundDevice, null);

  const merged = mergeLicenseRecordFromCheckout(existing, replay);

  assert.deepEqual(
    merged.licenseKeys[0]?.boundDevice,
    originalDevice,
    "设备绑定必须原样保留，否则已付费客户会被要求重新激活",
  );
});

test("重放 webhook 不会清空换机冷却期（防止绕过 30 天限制）", () => {
  const existing = buildActivatedRecord();
  const originalTransferAt = existing.licenseKeys[0]?.lastDeviceTransferAt;

  assert.ok(originalTransferAt, "前置条件：激活时应写入 lastDeviceTransferAt");

  const merged = mergeLicenseRecordFromCheckout(existing, buildFreshRecord());

  assert.equal(
    merged.licenseKeys[0]?.lastDeviceTransferAt,
    originalTransferAt,
    "冷却期时间戳被清空就等于允许无限换机",
  );
});

test("重放 webhook 不会复活被管理员封禁的 key", () => {
  const existing = buildActivatedRecord();
  const disabled = setLicenseKeyAvailability(
    existing,
    "WAAP-REPLAY-KEY-1",
    "disabled",
  );

  assert.ok(disabled);
  assert.equal(disabled.licenseKeys[0]?.status, "disabled");

  // 重放里 Creem 仍然报 active
  const replay = buildFreshRecord();
  assert.equal(replay.licenseKeys[0]?.status, "active");

  const merged = mergeLicenseRecordFromCheckout(disabled, replay);

  assert.equal(
    merged.licenseKeys[0]?.status,
    "disabled",
    "封禁状态绝不能被 webhook 重放覆盖成 active",
  );
});

test("重放 webhook 不会改写 createdAt（审计时间线保持稳定）", () => {
  const existing = buildActivatedRecord();
  const merged = mergeLicenseRecordFromCheckout(existing, buildFreshRecord());

  assert.equal(
    merged.createdAt,
    "2026-01-01T00:00:00.000Z",
    "createdAt 必须保留首次入库时间，不能被重放时间覆盖",
  );
  // updatedAt 应被刷新到当下；不断言「不等于原值」——
  // 同一毫秒内完成合并不可能产生差值，那样断言会不稳定。
  assert.equal(
    Date.parse(merged.updatedAt) >= Date.parse(merged.createdAt),
    true,
    "updatedAt 不应早于 createdAt",
  );
  assert.equal(
    Date.parse(merged.updatedAt) >= Date.parse(existing.updatedAt),
    true,
    "updatedAt 只能前进",
  );
});

test("已有但本次 payload 未携带的 key 会被保留", () => {
  const existing = buildActivatedRecord();
  const partialPayload: CreemCheckoutPayload = {
    ...checkoutPayload,
    license_keys: [], // 部分 payload：这次没带 key
  };
  const partial = buildFreshRecord(partialPayload);
  assert.equal(partial.licenseKeys.length, 0);

  const merged = mergeLicenseRecordFromCheckout(existing, partial);

  assert.equal(
    merged.licenseKeys.length,
    1,
    "payload 里没有 key 不等于删掉 key，必须保留",
  );
  assert.equal(merged.licenseKeys[0]?.key, "WAAP-REPLAY-KEY-1");
});

test("描述性字段以 Creem 最新数据为准，metadata 合并键", () => {
  const existing = buildActivatedRecord();
  const renamed: CreemCheckoutPayload = {
    ...checkoutPayload,
    product: { id: "prod_reddit_toolbox", name: "Reddit Toolbox Pro" },
    metadata: { toolSlug: "reddit-toolbox", plan: "pro" },
  };

  const merged = mergeLicenseRecordFromCheckout(
    existing,
    buildFreshRecord(renamed),
  );

  assert.equal(merged.productName, "Reddit Toolbox Pro");
  assert.equal(merged.metadata.plan, "pro");
  assert.equal(merged.metadata.toolSlug, "reddit-toolbox");
});

test("store.mergeAndSave 连续重放保持设备绑定不变（端到端）", async () => {
  const store = createMemoryLicenseStore();

  // 1) 首次 webhook 落库
  await store.mergeAndSave(buildFreshRecord());

  // 2) 客户端激活
  const first = await store.getByOrderId("ord_replay");
  assert.ok(first);
  const bound = bindDeviceToLicenseKey(first, "WAAP-REPLAY-KEY-1", {
    deviceId: `hwid_${"b".repeat(64)}`,
    deviceName: "Workstation",
    recordDeviceTransfer: true,
  });
  assert.ok(bound);
  await store.save(bound);

  // 3) Creem 重放三次
  for (let i = 0; i < 3; i += 1) {
    await store.mergeAndSave(buildFreshRecord());
  }

  const after = await store.getByOrderId("ord_replay");
  assert.ok(after);
  assert.equal(after.licenseKeys[0]?.boundDevice?.deviceName, "Workstation");
  assert.equal(after.licenseKeys[0]?.status, "active");
  assert.ok(after.licenseKeys[0]?.lastDeviceTransferAt);

  // 换机冷却期仍然生效
  const eligibility = after.licenseKeys[0];
  assert.ok(eligibility);
  assert.equal(
    new Date(
      Date.parse(eligibility.lastDeviceTransferAt as string) +
        30 * 24 * 60 * 60 * 1000,
    ).toISOString() > new Date().toISOString(),
    true,
    "重放之后换机冷却期应仍然未到期",
  );
});
