"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useCookieConsent } from "@/contexts/cookie-consent-context";

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

type ConsentValue = "granted" | "denied";

function getConsentState(enabled: boolean): ConsentValue {
    return enabled ? "granted" : "denied";
}

export function GoogleTagManager() {
    const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
    const { consent } = useCookieConsent();

    useEffect(() => {
        if (!gtmId || typeof window === "undefined") return;

        window.dataLayer = window.dataLayer || [];

        const gtag =
            window.gtag ||
            function gtag(...args: unknown[]) {
                window.dataLayer?.push(args);
            };

        window.gtag = gtag;

        gtag("consent", "update", {
            analytics_storage: getConsentState(consent.analytics),
            ad_storage: getConsentState(consent.marketing),
            ad_user_data: getConsentState(consent.marketing),
            ad_personalization: getConsentState(consent.marketing),
        });
    }, [gtmId, consent.analytics, consent.marketing]);

    if (!gtmId) return null;

    return (
        <>
            <Script id="google-tag-manager-consent-default" strategy="beforeInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
        `}
            </Script>
            <Script id="google-tag-manager" strategy="afterInteractive">
                {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtmId}');
        `}
            </Script>
        </>
    );
}

export function GoogleTagManagerNoscript() {
    const gtmId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

    if (!gtmId) return null;

    return (
        <noscript>
            <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
            />
        </noscript>
    );
}
