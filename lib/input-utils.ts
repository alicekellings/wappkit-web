const SAFE_ID_PATTERN = /^[A-Za-z0-9_-]+$/;
const SAFE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function trimInput(value: unknown) {
  return typeof value === "string" ? value.trim() : value;
}

export function normalizeEmailInput(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : value;
}

export function isSafeIdentifier(value: string) {
  return SAFE_ID_PATTERN.test(value);
}

export function isSafeSlug(value: string) {
  return SAFE_SLUG_PATTERN.test(value);
}

export function getTrimmedSearchParam(
  value: string | string[] | undefined,
  options?: {
    allowPattern?: RegExp;
    maxLength?: number;
  },
) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return undefined;
  }

  if (options?.maxLength && trimmed.length > options.maxLength) {
    return undefined;
  }

  if (options?.allowPattern && !options.allowPattern.test(trimmed)) {
    return undefined;
  }

  return trimmed;
}

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
