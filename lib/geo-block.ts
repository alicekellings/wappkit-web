const BLOCKED_COUNTRIES = new Set(["CN"]);

export function normalizeCountryCode(country: string | null | undefined) {
  const value = country?.trim();
  return value ? value.toUpperCase() : null;
}

export function getRequestCountry(headers: Headers) {
  return (
    normalizeCountryCode(headers.get("x-vercel-ip-country")) ??
    normalizeCountryCode(headers.get("cf-ipcountry")) ??
    normalizeCountryCode(headers.get("x-country-code"))
  );
}

export function shouldBlockCountry(country: string | null | undefined) {
  const normalized = normalizeCountryCode(country);
  return normalized ? BLOCKED_COUNTRIES.has(normalized) : false;
}
