 "use client";

import Link from "next/link";
import { useState, useRef, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useBackendFlow } from "@/contexts/backend-flow-context";

interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
  const { isAuthenticated, username, logout, subscriptionStatus, bf } = useBackendFlow();
  const [open, setOpen] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const planOrder: Array<"Personal" | "Basic" | "Professional"> = ["Personal", "Basic", "Professional"];
  const prices = {
    Personal: process.env.NEXT_PUBLIC_STRIPE_PRICE_PERSONAL || "",
    Basic: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || "price_1ScOvDQwusGQNJkIArSeN5js",
    Professional: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "price_1ScOxOQwusGQNJkIkVzMnm8m",
  };

  const currentPlan = useMemo(() => {
    const subscriptionData = (subscriptionStatus as any)?.subscription || subscriptionStatus;
    
    if (subscriptionStatus?.hasSubscription === false) {
      return "Personal";
    }

    const priceIdFromStatus =
      subscriptionData?.priceId ||
      subscriptionData?.price_id ||
      subscriptionData?.stripePriceId ||
      subscriptionData?.planId;
    const planFromPrice = Object.entries(prices).find(
      ([, value]) => value && priceIdFromStatus && value === priceIdFromStatus
    );
    const planFromStatus =
      subscriptionData?.plan ||
      subscriptionData?.name ||
      subscriptionData?.planName ||
      null;
    const resolvedPlan = (planFromPrice?.[0] as "Personal" | "Basic" | "Professional" | undefined) || planFromStatus;
    return resolvedPlan && planOrder.includes(resolvedPlan as any)
      ? (resolvedPlan as "Personal" | "Basic" | "Professional")
      : null;
  }, [subscriptionStatus, prices]);

  const hasPaidPlan = currentPlan === "Basic" || currentPlan === "Professional";

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  const handleManageSubscription = async () => {
    if (!bf) return;
    setOpen(false);
    setLoadingPortal(true);
    try {
      const returnUrl = window.location.origin + window.location.pathname;
      const data = await bf.createBillingPortalSession({
        returnUrl,
      });
      if (data?.url) {
        window.location.href = data.url as string;
      }
    } catch (error: any) {
      console.error("Error opening billing portal:", error);
      setLoadingPortal(false);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-bold">
          <span className="bg-gradient-to-br from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            InstantBackend
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
          <Link href="/docs" className="hover:text-slate-900">
            Docs
          </Link>
          {!isAuthenticated && (
            <>
              <Link href="/register" className="hover:text-slate-900">
                Register
              </Link>
              <Link href="/login" className="hover:text-slate-900">
                Login
              </Link>
            </>
          )}
          {isAuthenticated && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-semibold">
                  {username ? username[0]?.toUpperCase() : "U"}
                </span>
                <span className="max-w-[120px] truncate">{username || "User"}</span>
                <svg
                  className={cn("h-4 w-4 text-slate-500 transition-transform", open && "rotate-180")}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                  <Link
                    href="/app"
                    className="block px-3 py-2 text-sm text-slate-800 hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {hasPaidPlan && (
                    <button
                      onClick={handleManageSubscription}
                      disabled={loadingPortal}
                      className="block w-full px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingPortal ? "Loading..." : "Manage subscription"}
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

