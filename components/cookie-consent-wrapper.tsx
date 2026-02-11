"use client";

import { CookieConsentProvider } from "@/contexts/cookie-consent-context";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { GoogleTagManagerNoscript, GoogleTagManager } from "@/components/google-tag-manager";

export function CookieConsentWrapper({ children }: { children: React.ReactNode }) {
    return (
        <CookieConsentProvider>
            <GoogleTagManager />
            <GoogleTagManagerNoscript />
            {children}
            <CookieConsentBanner />
        </CookieConsentProvider>
    );
}
