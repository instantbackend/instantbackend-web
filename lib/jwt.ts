type JwtPayload = Record<string, any> | null;

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    return window.atob(padded);
  }
  return Buffer.from(padded, "base64").toString("binary");
}

export function parseJwt(token?: string | null): JwtPayload {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload);
  } catch (error) {
    console.warn("No se pudo parsear el JWT", error);
    return null;
  }
}

export function extractApiKeyFromToken(token?: string | null): string | null {
  const payload = parseJwt(token);
  const apiKey = payload?.user?.apiKey || payload?.apiKey;
  return typeof apiKey === "string" ? apiKey : null;
}

