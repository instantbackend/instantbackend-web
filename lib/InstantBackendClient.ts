import { InstantBackend } from "@/lib/InstantBackendSDK";
import { extractApiKeyFromToken } from "@/lib/jwt";

const API_KEY = process.env.NEXT_PUBLIC_INSTANTBACKEND_API_KEY || "";

const isAuthError = (error: unknown) => {
  const status = (error as any)?.status;
  return status === 401 || status === 403;
};

const throwResponseError = (message: string, status?: number) => {
  const err: any = new Error(message);
  err.status = status;
  throw err;
};

export type CollectionSummary = { name: string; count?: number };
export type UsageInfo = {
  used: number;
  limit: number;
  storageBytes?: number | null;
  totalCost?: number | null;
  costByAction?: Record<string, number> | null;
  costByService?: Record<string, number> | null;
  period?: { startDate?: string; endDate?: string } | null;
};

export function instantiateWithToken(jwtToken?: string | null, apiKeyOverride?: string | null) {
  const apiKeyToUse = apiKeyOverride || API_KEY;
  return new InstantBackend(apiKeyToUse, jwtToken ?? null);
}

export async function login(username: string, password: string) {
  const client = instantiateWithToken(null);
  const authResponse = await client.login(username, password);
  const token = client.jwtToken || authResponse?.token;
  const apiKeyFromToken = extractApiKeyFromToken(token);
  const clientWithToken = instantiateWithToken(token, apiKeyFromToken || undefined);
  return { client: clientWithToken, token, raw: authResponse, apiKey: apiKeyFromToken };
}

export async function registerUser({
  username,
  password,
  email,
  fullName,
}: {
  username: string;
  password: string;
  email?: string;
  fullName?: string;
}) {
  const client = instantiateWithToken(null);
  const result = await client.register({ username, password, email, fullName });
  return result;
}

export async function requestPasswordReset({
  email,
  username,
}: {
  email?: string;
  username?: string;
}) {
  const client = instantiateWithToken(null);
  const result = await client.requestPasswordReset({ email, username });
  return result;
}

export async function resetPassword({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
  const client = instantiateWithToken(null);
  const result = await client.resetPassword({ token, password });
  return result;
}

export async function getCollections(client: InstantBackend): Promise<CollectionSummary[]> {
  try {
    const result = await client.collection("collections").get();
    const rawList: Array<any> = Array.isArray(result?.collections)
      ? result.collections
      : Array.isArray(result?.items)
      ? result.items
      : [];

    const normalized = rawList
      .map((item) => {
        if (typeof item === "string") return item;
        return item?.name ?? item?.collection ?? null;
      })
      .filter(Boolean) as string[];

    const filtered = normalized.filter((name) => {
      const lower = name.toLowerCase();
      return name !== "usage" && !lower.startsWith("stripe_");
    });

    if (filtered.length > 0) {
      return filtered.map((name) => ({ name }));
    }
  } catch (error) {
    if (isAuthError(error)) {
      throw error;
    }
    console.warn("Failed to fetch collections, using mock:", error);
  }
  return [];
}

export async function getUsage(client: InstantBackend): Promise<UsageInfo> {
  try {
    const now = new Date();
    const startOfMonthUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    const normalizedBase =
      (client as any)?.baseUrl?.replace(/\/$/, "") ||
      (process.env.NEXT_PUBLIC_INSTANTBACKEND_BASE_URL || "https://api.instantbackend.dev").replace(
        /\/$/,
        ""
      );
    const url = new URL(`${normalizedBase}/usage/summary`);
    url.searchParams.set("startDate", startOfMonthUtc.toISOString());
    url.searchParams.set("endDate", now.toISOString());

    const response = await fetch(url.toString(), {
      headers: {
        ...client.getAuthHeaders(),
        Accept: "application/json",
      },
    });

    if (typeof (client as any).handleAuthRedirect === "function") {
      await (client as any).handleAuthRedirect(response);
    }

    if (!response.ok) {
      throwResponseError("Failed to fetch usage summary", response.status);
    }

    const payload = await response.json();
    const summary =
      payload?.data ||
      (Array.isArray(payload?.items) && payload.items.length > 0 ? payload.items[0] : null) ||
      payload?.summary ||
      payload;

    const toNumberOrNull = (value: unknown) => {
      const num = Number(value);
      return Number.isFinite(num) ? num : null;
    };

    const envLimit =
      toNumberOrNull(process.env.NEXT_PUBLIC_PLAN_LIMIT_PERSONAL) ??
      toNumberOrNull(process.env.NEXT_PUBLIC_INSTANTBACKEND_REQUESTS_LIMIT) ??
      null;

    const pickFirstNumber = (...values: unknown[]) => {
      for (const value of values) {
        const num = toNumberOrNull(value);
        if (num !== null) return num;
      }
      return null;
    };

    const used = pickFirstNumber(
      summary?.used,
      summary?.requestsUsed,
      summary?.requests,
      summary?.totalRequests,
      summary?.requestCount,
      summary?.count
    );
    const storageBytes = pickFirstNumber(summary?.storageBytes, summary?.storage);
    const limit = pickFirstNumber(
      summary?.limit,
      summary?.requestsLimit,
      summary?.planLimit,
      summary?.allowedRequests,
      summary?.quota,
      payload?.limit,
      payload?.requestsLimit,
      envLimit
    );

    return {
      used: used ?? 0,
      limit: limit ?? envLimit ?? 1000,
      storageBytes: storageBytes ?? null,
      totalCost: pickFirstNumber(summary?.totalCost, payload?.totalCost),
      costByAction: summary?.costByAction || null,
      costByService: summary?.costByService || null,
      period: summary?.period || null,
    };
  } catch (error) {
    if (isAuthError(error)) {
      throw error;
    }
    console.warn("Failed to fetch usage summary, using mock:", error);
  }
  const envLimit =
    Number(process.env.NEXT_PUBLIC_PLAN_LIMIT_PERSONAL) ||
    Number(process.env.NEXT_PUBLIC_INSTANTBACKEND_REQUESTS_LIMIT) ||
    1000;
  return {
    used: 120,
    limit: envLimit,
    storageBytes: null,
    totalCost: null,
    costByAction: null,
    costByService: null,
    period: null,
  };
}
