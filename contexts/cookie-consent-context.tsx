"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ConsentType = {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
};

type CookieConsentContextType = {
    consent: ConsentType;
    updateConsent: (newConsent: Partial<ConsentType>) => void;
    acceptAll: () => void;
    acceptNecessary: () => void;
    showBanner: boolean;
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const CONSENT_KEY = "instantbackend_cookie_consent";

export const CookieConsentProvider = ({ children }: { children: React.ReactNode }) => {
    const [consent, setConsent] = useState<ConsentType>({
        necessary: true,
        analytics: false,
        marketing: false,
    });
    const [showBanner, setShowBanner] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem(CONSENT_KEY);
            if (stored) {
                try {
                    setConsent(JSON.parse(stored));
                } catch (e) {
                    console.error("Failed to parse cookie consent", e);
                }
            } else {
                setShowBanner(true);
            }
            setIsLoaded(true);
        }
    }, []);

    const saveConsent = (newConsent: ConsentType) => {
        setConsent(newConsent);
        if (typeof window !== "undefined") {
            localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent));
        }
        setShowBanner(false);
    };

    const updateConsent = (newConsent: Partial<ConsentType>) => {
        const updated = { ...consent, ...newConsent };
        saveConsent(updated);
    };

    const acceptAll = () => {
        saveConsent({ necessary: true, analytics: true, marketing: true });
    };

    const acceptNecessary = () => {
        saveConsent({ necessary: true, analytics: false, marketing: false });
    };



    return (
        <CookieConsentContext.Provider
            value={{ consent, updateConsent, acceptAll, acceptNecessary, showBanner }}
        >
            {children}
        </CookieConsentContext.Provider>
    );
};

export const useCookieConsent = () => {
    const context = useContext(CookieConsentContext);
    if (context === undefined) {
        throw new Error("useCookieConsent must be used within a CookieConsentProvider");
    }
    return context;
};
