import type { Metadata } from "next";
import "./globals.css";
import "prismjs/themes/prism-tomorrow.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  metadataBase: new URL("https://instantbackend.dev"),
  title: {
    default: "InstantBackend - Backend as a Service for Frontend Developers",
    template: "%s | InstantBackend"
  },
  description: "Ship your app in minutes with InstantBackend. The simplest BaaS with authentication, database, and usage tracking in a single lightweight SDK.",
  keywords: ["BaaS", "Backend as a Service", "InstantBackend", "NoSQL", "API", "SDK", "Serverless", "Database", "Authentication"],
  authors: [{ name: "InstantBackend Team" }],
  creator: "InstantBackend",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://instantbackend.dev",
    title: "InstantBackend - Backend as a Service without friction",
    description: "Authenticate users, manage collections, and track usage with a lightweight SDK. Ship your backend in minutes.",
    siteName: "InstantBackend",
    images: [
      {
        url: "/img/og-image.png", // Ensure this image exists or use a placeholder
        width: 1200,
        height: 630,
        alt: "InstantBackend - Simple BaaS for Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InstantBackend - Backend as a Service without friction",
    description: "Authenticate users, manage collections, and track usage with a lightweight SDK. Ship your backend in minutes.",
    images: ["/img/og-image.png"],
    creator: "@instantbackend",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      {
        url: "/img/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/img/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: "/img/favicon_io/apple-touch-icon.png",
    shortcut: "/img/favicon_io/favicon.ico",
  },
  manifest: "/img/favicon_io/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { CookieConsentWrapper } from "@/components/cookie-consent-wrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CookieConsentWrapper>
          <Providers>
            <SiteHeader />
            <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
            <footer className="border-t border-slate-200">
              <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row">
                <span>© {new Date().getFullYear()} InstantBackend</span>
                <div className="flex items-center gap-4">
                  <a href="/terms" className="hover:text-slate-900">
                    Terms
                  </a>
                  <a href="/privacy" className="hover:text-slate-900">
                    Privacy
                  </a>
                  <a href="/support" className="hover:text-slate-900">
                    Support
                  </a>
                </div>
              </div>
            </footer>
          </Providers>
        </CookieConsentWrapper>
      </body>
    </html>
  );
}

