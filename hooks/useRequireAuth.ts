"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInstantBackend } from "@/contexts/instant-backend-context";
import Cookies from "js-cookie";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated } = useInstantBackend();

  useEffect(() => {
    const hasCookie = Boolean(Cookies.get(AUTH_COOKIE_NAME));
    if (!isAuthenticated && !hasCookie) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);
}

