"use client";

import { useCookieConsent } from "@/contexts/cookie-consent-context";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function CookieConsentBanner() {
    const { showBanner, acceptAll, acceptNecessary } = useCookieConsent();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (showBanner) {
            // Small delay for animation
            const timer = setTimeout(() => setIsVisible(true), 500);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [showBanner]);

    if (!showBanner && !isVisible) return null;

    return (
        <div
            className={cn(
                "fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-lg border border-slate-800 bg-slate-950 p-6 text-slate-300 shadow-2xl transition-all duration-500 ease-in-out md:bottom-8 md:right-8",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
        >
            <div className="mb-4 space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    Cookie Consent
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                    We use cookies to analyze traffic via Google Tag Manager. Essential cookies for Stripe
                    and Auth are always active.
                </p>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs">
                <button
                    onClick={acceptAll}
                    className="group flex w-full items-center justify-between rounded bg-white px-3 py-2 text-slate-950 transition hover:bg-slate-200"
                >
                    <span>Accept All</span>
                    <span className="opacity-50 group-hover:opacity-100">[cmd+enter]</span>
                </button>
                <button
                    onClick={acceptNecessary}
                    className="group flex w-full items-center justify-between rounded border border-slate-800 bg-transparent px-3 py-2 text-slate-400 transition hover:border-slate-700 hover:text-white"
                >
                    <span>Necessary Only</span>
                    <span className="opacity-50 group-hover:opacity-100">[esc]</span>
                </button>
            </div>
        </div>
    );
}
