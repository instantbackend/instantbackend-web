"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBackendFlow } from "@/contexts/backend-flow-context";
import Cookies from "js-cookie";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated } = useBackendFlow();

  useEffect(() => {
    const hasCookie = Boolean(Cookies.get(AUTH_COOKIE_NAME));
    if (!isAuthenticated && !hasCookie) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);
}

