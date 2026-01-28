"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { InstantBackend } from "@/lib/InstantBackendSDK";
import { instantiateWithToken } from "@/lib/InstantBackendClient";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { extractApiKeyFromToken, parseJwt } from "@/lib/jwt";

type BackendFlowContextValue = {
  bf: InstantBackend | null;
  jwtToken: string | null;
  isAuthenticated: boolean;
  apiKey: string | null;
  username: string | null;
  setAuth: (token: string, client?: InstantBackend) => void;
  subscriptionStatus: any | null;
  refreshSubscriptionStatus: (clientOverride?: InstantBackend | null) => Promise<any | null>;
  logout: () => void;
};

const BackendFlowContext = createContext<BackendFlowContextValue | undefined>(
  undefined
);

export function BackendFlowProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [bf, setBf] = useState<InstantBackend | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const handleAuthError = (error: any) => {
    const status = error?.status;
    if (status === 401 || status === 403) {
      logout();
      router.replace("/login");
      return true;
    }
    return false;
  };

  useEffect(() => {
    const tokenFromCookie = Cookies.get(AUTH_COOKIE_NAME);
    if (tokenFromCookie && !bf) {
      const apiKeyFromToken = extractApiKeyFromToken(tokenFromCookie);
      const payload = parseJwt(tokenFromCookie);
      const usernameFromToken =
        (payload as any)?.user?.username || (payload as any)?.username || (payload as any)?.email || null;
      const client = instantiateWithToken(tokenFromCookie, apiKeyFromToken || undefined);
      setJwtToken(tokenFromCookie);
      setBf(client);
      setApiKey(apiKeyFromToken || null);
      setUsername(typeof usernameFromToken === "string" ? usernameFromToken : null);
    }
  }, [bf]);

  useEffect(() => {
    if (bf && jwtToken) {
      void refreshSubscriptionStatus(bf);
    }
  }, [bf, jwtToken]);

  const refreshSubscriptionStatus = async (clientOverride?: InstantBackend | null) => {
    const clientToUse = clientOverride || bf;
    if (!clientToUse) return null;
    try {
      const status = await clientToUse.getSubscriptionStatus();
      setSubscriptionStatus(status);
      return status;
    } catch (error) {
      if (handleAuthError(error)) {
        return null;
      }
      console.warn("No se pudo obtener el estado de la suscripción", error);
      setSubscriptionStatus(null);
      return null;
    }
  };

  const setAuth = (token: string, client?: InstantBackend) => {
    Cookies.set(AUTH_COOKIE_NAME, token, {
      expires: 7,
      sameSite: "lax",
      secure: typeof window !== "undefined" && window.location.protocol === "https:",
      path: "/",
    });
    setJwtToken(token);
    const apiKeyFromToken = extractApiKeyFromToken(token);
    const payload = parseJwt(token);
    const usernameFromToken =
      (payload as any)?.user?.username || (payload as any)?.username || (payload as any)?.email || null;
    setApiKey(apiKeyFromToken || null);
    setUsername(typeof usernameFromToken === "string" ? usernameFromToken : null);
    const instance = client ?? instantiateWithToken(token, apiKeyFromToken || undefined);
    setBf(instance);
    void refreshSubscriptionStatus(instance);
  };

  const logout = () => {
    Cookies.remove(AUTH_COOKIE_NAME);
    setJwtToken(null);
    setApiKey(null);
    setUsername(null);
    setBf(null);
    setSubscriptionStatus(null);
  };

  const value = useMemo(
    () => ({
      bf,
      jwtToken,
      isAuthenticated: Boolean(jwtToken),
      apiKey,
      username,
      setAuth,
      subscriptionStatus,
      refreshSubscriptionStatus,
      logout,
    }),
    [bf, jwtToken, apiKey, username, subscriptionStatus]
  );

  return (
    <BackendFlowContext.Provider value={value}>
      {children}
    </BackendFlowContext.Provider>
  );
}

export function useBackendFlow() {
  const ctx = useContext(BackendFlowContext);
  if (!ctx) {
    throw new Error("useBackendFlow must be used within BackendFlowProvider");
  }
  return ctx;
}

export { AUTH_COOKIE_NAME as COOKIE_NAME };

