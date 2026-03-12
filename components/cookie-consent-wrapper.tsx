"use client";

import { Suspense } from "react";
import { CookieConsentProvider } from "@/contexts/cookie-consent-context";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { GoogleTagManagerNoscript, GoogleTagManager } from "@/components/google-tag-manager";
import { AnalyticsPageTracker } from "@/components/analytics-page-tracker";

export function CookieConsentWrapper({ children }: { children: React.ReactNode }) {
    return (
        <CookieConsentProvider>
            <GoogleTagManager />
            <GoogleTagManagerNoscript />
            <Suspense fallback={null}>
                <AnalyticsPageTracker />
            </Suspense>
            {children}
            <CookieConsentBanner />
        </CookieConsentProvider>
    );
}
