const ENV_EDGE_NOISE_PATTERN =
  /^[\s\u200B-\u200D\u2060\uFEFF]+|[\s\u200B-\u200D\u2060\uFEFF]+$/g;

export function normalizeEnvValue(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.replace(ENV_EDGE_NOISE_PATTERN, "");

  return normalized.length > 0 ? normalized : undefined;
}

export function getTrimmedEnv(name: string) {
  return normalizeEnvValue(process.env[name]);
}

export function isTrimmedEnvFlagEnabled(name: string) {
  return getTrimmedEnv(name)?.toLowerCase() === "true";
}
