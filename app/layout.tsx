import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "InstantBackend",
  description: "MVP frontend para InstantBackend BaaS",
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  );
}

