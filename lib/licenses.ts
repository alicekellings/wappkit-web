export type LicenseStatus = "active" | "inactive" | "disabled" | "unknown";

import { getSafeUrlOrigin, serializeError } from "@/lib/error-utils";
import { getTrimmedEnv } from "@/lib/env-utils";

export type LicenseBoundDevice = {
  deviceId: string;
  deviceName: string;
  boundAt: string;
  lastValidatedAt: string;
};

export type LicenseKeyRecord = {
  id: string;
  key: string;
  status: LicenseStatus;
  boundDevice?: LicenseBoundDevice | null;
  lastDeviceTransferAt?: string | null;
};

export type LicenseRecord = {
  checkoutId: string;
  requestId: string | null;
  orderId: string;
  customerId: string | null;
  customerEmail: string;
  customerName: string | null;
  productId: string;
  productName: string;
  toolSlug: string;
  metadata: Record<string, string>;
  licenseKeys: LicenseKeyRecord[];
  createdAt: string;
  updatedAt: string;
};

export type LicenseListEntry = {
  id: string;
  key: string;
  status: LicenseStatus;
  boundDevice?: LicenseBoundDevice | null;
  lastDeviceTransferAt?: string | null;
  checkoutId: string;
  requestId: string | null;
  orderId: string;
  customerEmail: string;
  customerName: string | null;
  productName: string;
  toolSlug: string;
  createdAt: string;
  updatedAt: string;
};

export const DEVICE_TRANSFER_COOLDOWN_MS = 30 * 24 * 60 * 60 * 1000;

export function getDeviceTransferEligibility(
  license: LicenseKeyRecord,
  now = Date.now(),
) {
  const lastTransferAt = license.lastDeviceTransferAt
    ? Date.parse(license.lastDeviceTransferAt)
    : Number.NaN;

  if (!Number.isFinite(lastTransferAt)) {
    return {
      allowed: true,
      nextTransferAt: null,
    };
  }

  const nextTransferAtMs = lastTransferAt + DEVICE_TRANSFER_COOLDOWN_MS;
  return {
    allowed: now >= nextTransferAtMs,
    nextTransferAt: new Date(nextTransferAtMs).toISOString(),
  };
}

export type CreemCheckoutPayload = {
  id: string;
  mode?: string | null;
  status?: string | null;
  request_id?: string | null;
  order?: {
    id?: string | null;
    customer?:
      | string
      | {
          id?: string | null;
          email?: string | null;
          name?: string | null;
        }
      | null;
  } | null;
  customer?:
    | string
    | {
        id?: string | null;
        email?: string | null;
        name?: string | null;
      }
    | null;
  product?:
    | string
    | {
        id?: string | null;
        name?: string | null;
      }
    | null;
  metadata?: Record<string, string | number | boolean | null | undefined> | null;
  license_keys?:
    | Array<{
        id?: string | null;
        key?: string | null;
        status?: string | null;
      }>
    | null;
};

export type LicenseLookupInput = {
  orderId: string;
  email: string;
};

export type LicenseKeyLookupInput = {
  licenseKey: string;
  toolSlug?: string;
};

export interface LicenseStore {
  save(record: LicenseRecord): Promise<void>;
  /**
   * 读-改-写：按 orderId 取出已有记录，经 `mergeLicenseRecordFromCheckout`
   * 合并后落库，返回最终写入的记录。
   *
   * **webhook 必须走这个方法**，不能直接 `save()` —— 否则重放会抹掉设备绑定、
   * 清空换机冷却期、复活被封禁的 key（详见 `mergeLicenseRecordFromCheckout`）。
   */
  mergeAndSave(record: LicenseRecord): Promise<LicenseRecord>;
  getByOrderId(orderId: string): Promise<LicenseRecord | null>;
  findByOrderAndEmail(input: LicenseLookupInput): Promise<LicenseRecord | null>;
  findByLicenseKey(input: LicenseKeyLookupInput): Promise<LicenseRecord | null>;
  listAllRecords(): Promise<LicenseRecord[]>;
}

type MemoryState = {
  records: Map<string, LicenseRecord>;
  lookups: Map<string, string>;
  licenseKeys: Map<string, string>;
};

declare global {
  // eslint-disable-next-line no-var
  var __wappkitLicenseMemoryState__: MemoryState | undefined;
}

function getMemoryState(): MemoryState {
  if (!globalThis.__wappkitLicenseMemoryState__) {
    globalThis.__wappkitLicenseMemoryState__ = {
      records: new Map<string, LicenseRecord>(),
      lookups: new Map<string, string>(),
      licenseKeys: new Map<string, string>(),
    };
  }

  return globalThis.__wappkitLicenseMemoryState__;
}

export function normalizeLicenseEmail(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeOrderId(value: string) {
  return value.trim();
}

export function normalizeLicenseKey(value: string) {
  return value.trim().toUpperCase();
}

export function normalizeDeviceId(value: string) {
  return value.trim();
}

// ---------------------------------------------------------------------------
// 设备 ID 形态判断（与桌面端 utils/device_identity.py 保持一致）
//
//   v1.0.1 及更早：device_ + 32 位十六进制 —— 随机 UUID，写在 config.json 里，
//                  删掉文件就等于换机，因此设备绑定实际上没生效。
//   v1.0.2 起    ：hwid_   + 64 位十六进制 —— MachineGuid + 卷序列号 + 主板
//                  序列号 经 HMAC-SHA256 派生，删配置文件不会改变。
//
// 两者格式不同，服务端据此识别「老客户端升级」并允许一次性迁移。
// ---------------------------------------------------------------------------
const LEGACY_DEVICE_ID_PATTERN = /^device_[0-9a-f]{32}$/i;
const HARDWARE_DEVICE_ID_PATTERN = /^hwid_[0-9a-f]{64}$/i;

export function isLegacyDeviceId(value: string | null | undefined): boolean {
  return typeof value === "string" && LEGACY_DEVICE_ID_PATTERN.test(value.trim());
}

export function isHardwareDeviceId(value: string | null | undefined): boolean {
  return typeof value === "string" && HARDWARE_DEVICE_ID_PATTERN.test(value.trim());
}

export function buildLicenseRecordKey(orderId: string) {
  return `license:record:${normalizeOrderId(orderId)}`;
}

export function buildLicenseLookupKey(orderId: string, email: string) {
  return `license:lookup:${normalizeLicenseEmail(email)}:${normalizeOrderId(orderId)}`;
}

export function buildLicenseKeyLookupKey(licenseKey: string) {
  return `license:key:${normalizeLicenseKey(licenseKey)}`;
}

export function createLicenseRecordFromCreemCheckout(
  payload: CreemCheckoutPayload,
): LicenseRecord {
  const customer = getCheckoutCustomer(payload);
  const product = getCheckoutProduct(payload);
  const metadataEntries = Object.entries(payload.metadata ?? {}).filter(
    (entry): entry is [string, string | number | boolean] => entry[1] != null,
  );
  const toolSlug = String(payload.metadata?.toolSlug ?? payload.metadata?.tool_slug ?? "unknown-tool");
  const now = new Date().toISOString();
  const orderId = payload.order?.id ?? payload.id;
  const customerEmail = customer?.email;
  const productId = product?.id;

  if (!orderId) {
    throw new Error("Creem payload is missing an order id.");
  }

  if (!customerEmail) {
    throw new Error("Creem payload is missing a customer email.");
  }

  if (!productId) {
    throw new Error("Creem payload is missing a product id.");
  }

  return {
    checkoutId: payload.id,
    requestId: payload.request_id ?? null,
    orderId,
    customerId: customer?.id ?? null,
    customerEmail: normalizeLicenseEmail(customerEmail),
    customerName: customer?.name ?? null,
    productId,
    productName: product?.name ?? "Untitled Product",
    toolSlug,
    metadata: Object.fromEntries(
      metadataEntries.map(([key, value]) => [key, String(value)]),
    ),
    licenseKeys: (payload.license_keys ?? [])
      .filter((item) => item?.key)
      .map((item, index) => ({
        id: item.id ?? `${payload.id}-license-${index + 1}`,
        key: String(item.key),
        status: normalizeLicenseStatus(item.status),
        boundDevice: null,
        lastDeviceTransferAt: null,
      })),
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * 把「由结算单推导出来的记录」合并进「库里已经存在的记录」。
 *
 * 为什么必须有这一步
 * ------------------
 * Creem 在响应超时或返回 5xx 时会**重放**同一个 `checkout.completed` 事件；
 * 而 `createLicenseRecordFromCreemCheckout()` 每次都会造一条全新记录
 * （`boundDevice` / `lastDeviceTransferAt` 恒为 null，`createdAt` 重置为当前时间）。
 * 早期实现直接 `store.save(record)` 全量覆盖，于是**每一次重放**都会：
 *
 *   1. 抹掉用户的设备绑定          -> 已付费激活的客户被要求重新激活
 *   2. 清空 `lastDeviceTransferAt` -> 30 天换机冷却期被绕过，等于无限换机
 *   3. 把 `createdAt` 改成重放时间 -> 审计时间线失真
 *   4. 把管理员手工 disable 的 key 复活成 active -> 封禁失效，风控形同虚设
 *
 * 合并规则（保守优先：宁可保留旧状态，也不丢掉安全约束）
 * ------------------------------------------------------
 *   - 设备绑定类字段（boundDevice / lastDeviceTransferAt）：已有值优先
 *   - `disabled` 状态：已有值为 disabled 就保持 disabled，webhook 无权解封
 *   - 已有但本次 payload 未出现的 key：原样保留（部分 payload ≠ 删除 key）
 *   - `createdAt`：保留已有值
 *   - 其余描述性字段：以 Creem 的最新数据为准（orderId / productName / email 等）
 */
export function mergeLicenseRecordFromCheckout(
  existing: LicenseRecord | null,
  incoming: LicenseRecord,
): LicenseRecord {
  // 首次入库：直接用新记录
  if (!existing) {
    return incoming;
  }

  const now = new Date().toISOString();
  const existingByKey = new Map<string, LicenseKeyRecord>();
  for (const item of existing.licenseKeys) {
    existingByKey.set(normalizeLicenseKey(item.key), item);
  }

  const mergedKeys: LicenseKeyRecord[] = [];
  const seenKeys = new Set<string>();

  for (const item of incoming.licenseKeys) {
    const token = normalizeLicenseKey(item.key);
    seenKeys.add(token);
    const previous = existingByKey.get(token);

    if (!previous) {
      mergedKeys.push(item);
      continue;
    }

    mergedKeys.push({
      id: previous.id ?? item.id,
      key: item.key,
      // 解封只能走 setLicenseKeyAvailability / 后台，绝不能被 webhook 重放复活
      status: previous.status === "disabled" ? "disabled" : item.status,
      boundDevice: previous.boundDevice ?? item.boundDevice ?? null,
      lastDeviceTransferAt:
        previous.lastDeviceTransferAt ?? item.lastDeviceTransferAt ?? null,
    });
  }

  // 已有但本次 payload 未携带的 key 必须保留
  for (const previous of existing.licenseKeys) {
    if (!seenKeys.has(normalizeLicenseKey(previous.key))) {
      mergedKeys.push(previous);
    }
  }

  return {
    ...incoming,
    customerId: incoming.customerId ?? existing.customerId,
    customerName: incoming.customerName ?? existing.customerName,
    requestId: incoming.requestId ?? existing.requestId,
    // 新数据优先，旧数据补齐新 payload 缺失的键
    metadata: { ...existing.metadata, ...incoming.metadata },
    licenseKeys: mergedKeys,
    createdAt: existing.createdAt,
    updatedAt: now,
  };
}

export function findLicenseKeyRecord(record: LicenseRecord, licenseKey: string) {
  return record.licenseKeys.find(
    (item) => item.key.trim().toUpperCase() === normalizeLicenseKey(licenseKey),
  );
}

export function flattenLicenseRecordEntries(record: LicenseRecord): LicenseListEntry[] {
  return record.licenseKeys.map((license) => ({
    id: license.id,
    key: license.key,
    status: license.status,
    boundDevice: license.boundDevice ?? null,
    lastDeviceTransferAt: license.lastDeviceTransferAt ?? null,
    checkoutId: record.checkoutId,
    requestId: record.requestId,
    orderId: record.orderId,
    customerEmail: record.customerEmail,
    customerName: record.customerName,
    productName: record.productName,
    toolSlug: record.toolSlug,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  }));
}

export function bindDeviceToLicenseKey(
  record: LicenseRecord,
  licenseKey: string,
  input: {
    deviceId: string;
    deviceName: string;
    /** 本次绑定是否算作「设备迁移」；是则写入 lastDeviceTransferAt 启动冷却期。 */
    recordDeviceTransfer?: boolean;
  },
) {
  const normalizedLicenseKey = normalizeLicenseKey(licenseKey);
  const normalizedDeviceId = normalizeDeviceId(input.deviceId);
  const trimmedDeviceName = input.deviceName.trim();
  const now = new Date().toISOString();
  let didUpdate = false;

  const licenseKeys: LicenseKeyRecord[] = record.licenseKeys.map((item) => {
    if (normalizeLicenseKey(item.key) !== normalizedLicenseKey) {
      return item;
    }

    didUpdate = true;
    return {
      ...item,
      status: item.status === "disabled" ? "disabled" : "active",
      boundDevice: {
        deviceId: normalizedDeviceId,
        deviceName: trimmedDeviceName,
        boundAt: input.recordDeviceTransfer
          ? now
          : item.boundDevice?.boundAt ?? now,
        lastValidatedAt: now,
      },
      lastDeviceTransferAt: input.recordDeviceTransfer
        ? now
        : item.lastDeviceTransferAt ?? null,
    };
  });

  if (!didUpdate) {
    return null;
  }

  return {
    ...record,
    licenseKeys,
    updatedAt: now,
  };
}

export function unbindDeviceFromLicenseKey(
  record: LicenseRecord,
  licenseKey: string,
  options: {
    recordDeviceTransfer?: boolean;
  } = {},
) {
  const normalizedLicenseKey = normalizeLicenseKey(licenseKey);
  const now = new Date().toISOString();
  let didUpdate = false;

  const licenseKeys: LicenseKeyRecord[] = record.licenseKeys.map((item) => {
    if (normalizeLicenseKey(item.key) !== normalizedLicenseKey) {
      return item;
    }

    didUpdate = true;
    return {
      ...item,
      status: item.status === "disabled" ? "disabled" : "inactive",
      boundDevice: null,
      lastDeviceTransferAt:
        options.recordDeviceTransfer === false
          ? item.lastDeviceTransferAt ?? null
          : now,
    };
  });

  if (!didUpdate) {
    return null;
  }

  return {
    ...record,
    licenseKeys,
    updatedAt: now,
  };
}

export function setLicenseKeyAvailability(
  record: LicenseRecord,
  licenseKey: string,
  nextStatus: "disabled" | "inactive",
) {
  const normalizedLicenseKey = normalizeLicenseKey(licenseKey);
  const now = new Date().toISOString();
  let didUpdate = false;

  const licenseKeys: LicenseKeyRecord[] = record.licenseKeys.map((item) => {
    if (normalizeLicenseKey(item.key) !== normalizedLicenseKey) {
      return item;
    }

    didUpdate = true;
    return {
      ...item,
      status: nextStatus,
      boundDevice: null,
    };
  });

  if (!didUpdate) {
    return null;
  }

  return {
    ...record,
    licenseKeys,
    updatedAt: now,
  };
}

export function hasLicenseKeys(payload: CreemCheckoutPayload) {
  return Array.isArray(payload.license_keys) && payload.license_keys.length > 0;
}

function getCheckoutCustomer(payload: CreemCheckoutPayload) {
  const orderCustomer = payload.order?.customer;

  if (orderCustomer && typeof orderCustomer === "object") {
    return orderCustomer;
  }

  if (payload.customer && typeof payload.customer === "object") {
    return payload.customer;
  }

  return null;
}

function getCheckoutProduct(payload: CreemCheckoutPayload) {
  if (payload.product && typeof payload.product === "object") {
    return payload.product;
  }

  return null;
}

function normalizeLicenseStatus(value: string | null | undefined): LicenseStatus {
  if (!value) {
    return "unknown";
  }

  if (value === "active" || value === "inactive" || value === "disabled") {
    return value;
  }

  return "unknown";
}

export function createMemoryLicenseStore(): LicenseStore {
  const state = getMemoryState();

  function writeRecord(record: LicenseRecord) {
    const recordKey = buildLicenseRecordKey(record.orderId);
    const lookupKey = buildLicenseLookupKey(record.orderId, record.customerEmail);

    state.records.set(recordKey, record);
    state.lookups.set(lookupKey, recordKey);
    for (const license of record.licenseKeys) {
      state.licenseKeys.set(buildLicenseKeyLookupKey(license.key), recordKey);
    }
  }

  return {
    async save(record) {
      writeRecord(record);
    },
    async mergeAndSave(record) {
      const existing =
        state.records.get(buildLicenseRecordKey(record.orderId)) ?? null;
      const merged = mergeLicenseRecordFromCheckout(existing, record);
      writeRecord(merged);
      return merged;
    },
    async getByOrderId(orderId) {
      return state.records.get(buildLicenseRecordKey(orderId)) ?? null;
    },
    async findByOrderAndEmail({ orderId, email }) {
      const recordKey = state.lookups.get(buildLicenseLookupKey(orderId, email));
      if (!recordKey) {
        return null;
      }

      return state.records.get(recordKey) ?? null;
    },
    async findByLicenseKey({ licenseKey, toolSlug }) {
      const recordKey = state.licenseKeys.get(buildLicenseKeyLookupKey(licenseKey));
      if (!recordKey) {
        return null;
      }

      const record = state.records.get(recordKey) ?? null;
      if (!record) {
        return null;
      }

      if (toolSlug && record.toolSlug !== toolSlug) {
        return null;
      }

      return record;
    },
    async listAllRecords() {
      return Array.from(state.records.values()).sort((left, right) =>
        right.updatedAt.localeCompare(left.updatedAt),
      );
    },
  };
}

type UpstashClientOptions = {
  url: string;
  token: string;
};

function createUpstashLicenseStore({
  url,
  token,
}: UpstashClientOptions): LicenseStore {
  async function run<T>(command: Array<string>) {
    const operation = command[0] ?? "UNKNOWN";
    let response: Response;

    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
        cache: "no-store",
      });
    } catch (error) {
      console.error("Upstash license store request failed before response.", {
        operation,
        commandPreview: command.slice(0, 3),
        upstashOrigin: getSafeUrlOrigin(url),
        error: serializeError(error),
      });
      throw error;
    }

    if (!response.ok) {
      const responseText = await response.text();

      console.error("Upstash license store returned non-ok response.", {
        operation,
        commandPreview: command.slice(0, 3),
        upstashOrigin: getSafeUrlOrigin(url),
        status: response.status,
        responseText,
      });
      throw new Error(`Upstash request failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as { result?: T; error?: string };
    if (payload.error) {
      console.error("Upstash license store returned command error.", {
        operation,
        commandPreview: command.slice(0, 3),
        upstashOrigin: getSafeUrlOrigin(url),
        payloadError: payload.error,
      });
      throw new Error(payload.error);
    }

    return payload.result ?? null;
  }

  async function readRecord(orderId: string): Promise<LicenseRecord | null> {
    const raw = await run<string>(["GET", buildLicenseRecordKey(orderId)]);
    return raw ? (JSON.parse(raw) as LicenseRecord) : null;
  }

  async function writeRecord(record: LicenseRecord) {
    const recordKey = buildLicenseRecordKey(record.orderId);
    const lookupKey = buildLicenseLookupKey(record.orderId, record.customerEmail);

    await run(["SET", recordKey, JSON.stringify(record)]);
    await run(["SET", lookupKey, recordKey]);
    for (const license of record.licenseKeys) {
      await run(["SET", buildLicenseKeyLookupKey(license.key), recordKey]);
    }
  }

  return {
    async save(record) {
      await writeRecord(record);
    },
    // 读-改-写。这里不是原子操作，理论上存在「webhook 重放」与「客户端激活」
    // 并发时互相覆盖的窄窗口（一次 REST 往返，约百毫秒级）。可以接受，因为：
    //   * 客户端每次启动都会调 /api/license/validate，绑定会被自动重建（自愈）
    //   * 冷却期只可能被「同一瞬间的并发」清掉，攻击者无法按需触发 Creem 重放
    // 相比原来 100% 会丢绑定的全量覆盖，这里已经消除了确定性问题。
    async mergeAndSave(record) {
      const existing = await readRecord(record.orderId);
      const merged = mergeLicenseRecordFromCheckout(existing, record);
      await writeRecord(merged);
      return merged;
    },
    async getByOrderId(orderId) {
      return readRecord(orderId);
    },
    async findByOrderAndEmail({ orderId, email }) {
      const recordKey = await run<string>([
        "GET",
        buildLicenseLookupKey(orderId, email),
      ]);

      if (!recordKey) {
        return null;
      }

      const raw = await run<string>(["GET", recordKey]);
      return raw ? (JSON.parse(raw) as LicenseRecord) : null;
    },
    async findByLicenseKey({ licenseKey, toolSlug }) {
      const recordKey = await run<string>([
        "GET",
        buildLicenseKeyLookupKey(licenseKey),
      ]);

      if (!recordKey) {
        return null;
      }

      const raw = await run<string>(["GET", recordKey]);
      const record = raw ? (JSON.parse(raw) as LicenseRecord) : null;

      if (!record) {
        return null;
      }

      if (toolSlug && record.toolSlug !== toolSlug) {
        return null;
      }

      return record;
    },
    async listAllRecords() {
      const recordKeys = new Set<string>();
      let cursor = "0";

      do {
        const scanResult = await run<[string, string[]]>([
          "SCAN",
          cursor,
          "MATCH",
          "license:record:*",
          "COUNT",
          "200",
        ]);

        const nextCursor =
          Array.isArray(scanResult) && scanResult[0] != null
            ? String(scanResult[0])
            : "0";
        const batchKeys =
          Array.isArray(scanResult) && Array.isArray(scanResult[1])
            ? scanResult[1]
            : [];

        for (const recordKey of batchKeys) {
          if (typeof recordKey === "string") {
            recordKeys.add(recordKey);
          }
        }

        cursor = nextCursor;
      } while (cursor !== "0");

      const records = await Promise.all(
        Array.from(recordKeys).map(async (recordKey) => {
          const raw = await run<string>(["GET", recordKey]);
          return raw ? (JSON.parse(raw) as LicenseRecord) : null;
        }),
      );

      return records
        .filter((record): record is LicenseRecord => record != null)
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
    },
  };
}

export function getLicenseStore(): LicenseStore {
  const url = getTrimmedEnv("UPSTASH_REDIS_REST_URL");
  const token = getTrimmedEnv("UPSTASH_REDIS_REST_TOKEN");

  if (url && token) {
    return createUpstashLicenseStore({ url, token });
  }

  return createMemoryLicenseStore();
}
