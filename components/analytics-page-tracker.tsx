"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function AnalyticsPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  useEffect(() => {
    const pagePath = queryString ? `${pathname}?${queryString}` : pathname;

    trackEvent("page_view", {
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, queryString]);

  return null;
}
