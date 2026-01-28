"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useInstantBackend } from "@/contexts/instant-backend-context";

function CheckoutStartContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, jwtToken, bf } = useInstantBackend();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const plan = useMemo(() => {
    const p = searchParams.get("plan");
    if (p === "Personal" || p === "Basic" || p === "Professional") return p;
    return null;
  }, [searchParams]);

  const successUrl =
    process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL || "http://localhost:3000/checkout/success";
  const cancelUrl =
    process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL || "http://localhost:3000/checkout/cancel";
  const prices = {
    Personal: process.env.NEXT_PUBLIC_STRIPE_PRICE_PERSONAL || "",
    Basic: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || "price_1ScOvDQwusGQNJkIArSeN5js",
    Professional: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "price_1ScOxOQwusGQNJkIkVzMnm8m",
  };

  useEffect(() => {
    if (!plan) {
      setError("Missing plan parameter.");
      return;
    }
    if (!isAuthenticated || !jwtToken) {
      router.replace(`/login?plan=${encodeURIComponent(plan)}`);
      return;
    }
    if (!bf) {
      setError("SDK no inicializado. Intenta refrescar la página.");
      return;
    }

    const priceId = prices[plan];
    if (!priceId) {
      setError("Price not configured for this plan.");
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await bf.createCheckoutSession({
          priceId,
          successUrl,
          cancelUrl,
        });
        if (data?.url) {
          window.location.href = data.url as string;
        } else {
          throw new Error("Checkout URL not returned.");
        }
      } catch (err: any) {
        setError(err?.message ?? "Could not start checkout");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [plan, isAuthenticated, jwtToken, successUrl, cancelUrl, prices, router, bf]);

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
      <h1 className="text-2xl font-bold text-slate-900">Starting checkout…</h1>
      <p className="text-slate-700">
        We are preparing your Stripe checkout session for the selected plan.
      </p>
      {loading && <p className="text-sm text-slate-600">Redirecting…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
        >
          Back to home
        </a>
        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
        >
          Log in
        </a>
      </div>
    </div>
  );
}

export default function CheckoutStart() {
  return (
    <Suspense fallback={
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <h1 className="text-2xl font-bold text-slate-900">Starting checkout…</h1>
        <p className="text-slate-700">Loading...</p>
      </div>
    }>
      <CheckoutStartContent />
    </Suspense>
  );
}

