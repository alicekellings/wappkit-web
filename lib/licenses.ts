export type LicenseStatus = "active" | "inactive" | "disabled" | "unknown";

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
  getByOrderId(orderId: string): Promise<LicenseRecord | null>;
  findByOrderAndEmail(input: LicenseLookupInput): Promise<LicenseRecord | null>;
  findByLicenseKey(input: LicenseKeyLookupInput): Promise<LicenseRecord | null>;
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
      })),
    createdAt: now,
    updatedAt: now,
  };
}

export function findLicenseKeyRecord(record: LicenseRecord, licenseKey: string) {
  return record.licenseKeys.find(
    (item) => item.key.trim().toUpperCase() === normalizeLicenseKey(licenseKey),
  );
}

export function bindDeviceToLicenseKey(
  record: LicenseRecord,
  licenseKey: string,
  input: {
    deviceId: string;
    deviceName: string;
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
        boundAt: item.boundDevice?.boundAt ?? now,
        lastValidatedAt: now,
      },
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

  return {
    async save(record) {
      const recordKey = buildLicenseRecordKey(record.orderId);
      const lookupKey = buildLicenseLookupKey(record.orderId, record.customerEmail);

      state.records.set(recordKey, record);
      state.lookups.set(lookupKey, recordKey);
      for (const license of record.licenseKeys) {
        state.licenseKeys.set(buildLicenseKeyLookupKey(license.key), recordKey);
      }
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
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Upstash request failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as { result?: T; error?: string };
    if (payload.error) {
      throw new Error(payload.error);
    }

    return payload.result ?? null;
  }

  return {
    async save(record) {
      const recordKey = buildLicenseRecordKey(record.orderId);
      const lookupKey = buildLicenseLookupKey(record.orderId, record.customerEmail);

      await run(["SET", recordKey, JSON.stringify(record)]);
      await run(["SET", lookupKey, recordKey]);
      for (const license of record.licenseKeys) {
        await run(["SET", buildLicenseKeyLookupKey(license.key), recordKey]);
      }
    },
    async getByOrderId(orderId) {
      const raw = await run<string>(["GET", buildLicenseRecordKey(orderId)]);
      return raw ? (JSON.parse(raw) as LicenseRecord) : null;
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
