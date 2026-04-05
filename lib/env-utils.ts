export function getTrimmedEnv(name: string) {
  const value = process.env[name];

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
}

export function isTrimmedEnvFlagEnabled(name: string) {
  return getTrimmedEnv(name) === "true";
}
