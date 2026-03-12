"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

type AnalyticsValue = string | number | boolean | null | undefined;

type TrackEventOnMountProps = {
  event: string;
  params?: Record<string, AnalyticsValue>;
};

export function TrackEventOnMount({ event, params }: TrackEventOnMountProps) {
  useEffect(() => {
    trackEvent(event, params);
  }, [event, params]);

  return null;
}
