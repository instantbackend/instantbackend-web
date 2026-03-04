"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useInstantBackend } from "@/contexts/instant-backend-context";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, jwtToken, bf, subscriptionStatus, logout } = useInstantBackend();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"Personal" | "Basic" | "Professional" | null>(null);

  const successUrl =
    process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL || "http://localhost:3000/checkout/success";
  const cancelUrl =
    process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL || "http://localhost:3000/checkout/cancel";
  const prices = {
    Personal: process.env.NEXT_PUBLIC_STRIPE_PRICE_PERSONAL || "",
    Basic: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || "price_1ScOvDQwusGQNJkIArSeN5js",
    Professional: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "price_1ScOxOQwusGQNJkIkVzMnm8m",
  };
  const priceLabels = {
    Personal: process.env.NEXT_PUBLIC_PLAN_PRICE_PERSONAL || "0€",
    Basic: process.env.NEXT_PUBLIC_PLAN_PRICE_BASIC || "10€",
    Professional: process.env.NEXT_PUBLIC_PLAN_PRICE_PRO || "50€",
  };
  const planOrder: Array<"Personal" | "Basic" | "Professional"> = ["Personal", "Basic", "Professional"];

  const deriveCurrentPlan = () => {
    const subscriptionData = (subscriptionStatus as any)?.subscription || subscriptionStatus;

    // If the backend says there is no subscription, assume Personal.
    if (subscriptionStatus?.hasSubscription === false) {
      return "Personal";
    }

    const priceIdFromStatus =
      subscriptionData?.priceId ||
      subscriptionData?.price_id ||
      subscriptionData?.stripePriceId ||
      subscriptionData?.planId;
    const planFromPrice = Object.entries(prices).find(
      ([, value]) => value && priceIdFromStatus && value === priceIdFromStatus
    );
    const planFromStatus =
      subscriptionData?.plan ||
      subscriptionData?.name ||
      subscriptionData?.planName ||
      null;
    const resolvedPlan = (planFromPrice?.[0] as "Personal" | "Basic" | "Professional" | undefined) || planFromStatus;
    return resolvedPlan && planOrder.includes(resolvedPlan as any)
      ? (resolvedPlan as "Personal" | "Basic" | "Professional")
      : null;
  };

  const currentPlan = deriveCurrentPlan();
  const currentPlanIndex = currentPlan ? planOrder.indexOf(currentPlan) : null;

  const startCheckout = async (planName: "Personal" | "Basic" | "Professional") => {
    setCheckoutError(null);
    setSelectedPlan(planName);
    const priceId = prices[planName];
    if (!priceId) {
      setCheckoutError("Price not configured for this plan.");
      return;
    }
    if (!isAuthenticated || !jwtToken) {
      setShowAuthModal(true);
      return;
    }
    if (!bf) {
      setCheckoutError("SDK not initialized. Try refreshing the page.");
      return;
    }

    // Determinar si es un upgrade al plan Professional
    const planIndex = planOrder.indexOf(planName);
    const hasPlan = currentPlanIndex !== null && currentPlanIndex >= 0;
    const isHigherThanCurrent = hasPlan && planIndex > (currentPlanIndex ?? -1);
    const isUpgradeToProfessional = isHigherThanCurrent && planName === "Professional";

    setLoadingPlan(planName);
    try {
      let data;
      if (isUpgradeToProfessional) {
        // Usar billing portal solo para upgrades al plan Professional
        const returnUrl = window.location.origin + window.location.pathname;
        data = await bf.createBillingPortalSession({
          returnUrl,
        });
      } else {
        // Usar checkout para nuevas suscripciones y otros upgrades
        data = await bf.createCheckoutSession({
          priceId,
          successUrl,
          cancelUrl,
        });
      }

      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        throw new Error("URL not returned.");
      }
    } catch (error: any) {
      const status = error?.status;
      if (status === 401 || status === 403) {
        logout();
        router.replace("/login");
        return;
      }
      setCheckoutError(error?.message ?? "Could not start checkout");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "name": "InstantBackend",
                "url": "https://instantbackend.dev",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://instantbackend.dev/docs?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@type": "SoftwareApplication",
                "name": "InstantBackend",
                "applicationCategory": "DeveloperApplication",
                "operatingSystem": "Any",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "EUR",
                },
                "description": "The backend built for AI-generated apps. AI-native backend for Cursor, Claude, and ChatGPT. Auth, collections, and usage—no custom backend.",
              },
            ],
          }),
        }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-600 to-purple-600 px-6 py-16 text-white shadow-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_35%)]" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-center">
          <div className="space-y-6 lg:w-1/2">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
              InstantBackend · Built for AI-generated apps
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              The backend built for AI-generated apps
            </h1>
            <p className="text-lg text-blue-50">
              Use InstantBackend in your Cursor, Claude, or ChatGPT prompts. Auth, collections, and usage tracking—no custom backend, no extra config.
            </p>
            <ul className="space-y-2 text-sm text-blue-100">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                One API key. Login, CRUD, and usage out of the box.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Prompts for React, Flutter, Swift, Kotlin, Unity, Godot.
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Docs and OpenAPI tuned for LLM consumption.
              </li>
            </ul>
            <div className="flex flex-col gap-3 sm:flex-row">
              {!isAuthenticated && (
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Get your API key
                </a>
              )}
              <a
                href="/ai-prompts"
                className="inline-flex items-center justify-center rounded-lg border border-white/70 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Use this prompt
              </a>
              <a
                href="/docs"
                className="inline-flex items-center justify-center rounded-lg border border-white/50 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
              >
                View docs
              </a>
            </div>
          </div>
          <div className="relative lg:w-1/2">
            <div className="rounded-2xl bg-white/10 p-6 backdrop-blur shadow-2xl ring-1 ring-white/30">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-300" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <pre className="overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-900/70 p-4 text-sm leading-relaxed text-slate-50 shadow-inner">
                {`import { InstantBackend } from "instantbackend-sdk";

const sdk = new InstantBackend(process.env.NEXT_PUBLIC_INSTANTBACKEND_API_KEY);

await sdk.login("user", "password");

await sdk.collection("tasks").add({
  title: "Send proposal",
  status: "open",
});

const openTasks = await sdk
  .collection("tasks")
  .where("status", "==", "open")
  .limit(10)
  .get();`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* AI-first positioning */}
      <section className="space-y-6">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            AI-native infrastructure
          </p>
          <h2 className="text-3xl font-bold text-slate-900">AI-native backend infrastructure</h2>
          <p className="mx-auto max-w-2xl text-slate-600">
            Designed for AI coding agents. When the model generates your app, it uses InstantBackend—not a custom server or a maze of config.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Explicit in the prompt", desc: "You tell the agent to use InstantBackend; it does." },
            { title: "No custom backend", desc: "Forbidden in our prompts. One less thing to debug." },
            { title: "Env-based", desc: "INSTANTBACKEND_API_KEY in .env; the agent knows the pattern." },
            { title: "Predictable API", desc: "Login → JWT; collections → GET/POST with filters. Same shape everywhere." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why AI agents love it */}
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50/50 px-6 py-10">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            For AI coding agents
          </p>
          <h2 className="text-3xl font-bold text-slate-900">Why AI agents love it</h2>
          <p className="mx-auto max-w-2xl text-slate-600">
            Minimal surface area, consistent responses, and docs that agents actually use.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Tiny API surface", desc: "Login, signup, /{collection} (list/create), /{collection}/{id} (get). No RLS or security rules to generate." },
            { title: "Stable JSON", desc: "Same response shape for list (items + nextToken), single item, and errors." },
            { title: "OpenAPI + examples", desc: "Swagger and copy-paste examples in every prompt." },
            { title: "Multi-platform prompts", desc: "Ready prompts for web, mobile, and game engines." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product primitives */}
      <section className="space-y-6">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Product
          </p>
          <h2 className="text-3xl font-bold text-slate-900">Primitives you need. Nothing more.</h2>
          <p className="text-slate-600">
            Auth, collections, usage, and payments. No servers, no schema migrations.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Auth", desc: "POST /login, POST /signup. JWT in response. Use Authorization: Bearer <token>." },
            { title: "Collections", desc: "GET /{collection}?field=value&limit=10, POST /{collection} with body. Optional nextToken, sort=asc|desc." },
            { title: "Single item", desc: "GET /{collection}/{id}." },
            { title: "Usage", desc: "Usage endpoint for progress bars and limits." },
            { title: "Payments", desc: "createPaymentIntent, createSubscription, billing portal in SDK." },
            { title: "Docs & Swagger", desc: "Public reference at /docs with OpenAPI." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-center">
          <a href="/docs#swagger" className="text-brand-600 font-semibold hover:underline">
            See API reference →
          </a>
        </p>
      </section>

      {/* Pricing */}
      <section className="space-y-6">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Pricing
          </p>
          <h2 className="text-3xl font-bold text-slate-900">Choose your plan</h2>
          <p className="text-slate-600">
            Start free, scale when you need more requests, storage, and support.
          </p>
          {checkoutError && (
            <p className="text-sm text-red-600">{checkoutError}</p>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              name: "Personal",
              price: priceLabels.Personal,
              subtitle: "Great for prototyping",
              features: ["25K requests/mo", "100MB storage", "3 Collections", "Email support"],
              cta: "Get started",
            },
            {
              name: "Basic",
              price: priceLabels.Basic,
              subtitle: "For small projects",
              features: ["1M requests/mo", "2GB storage", "20 Collections", "Priority email support"],
              cta: "Choose plan",
            },
            {
              name: "Professional",
              price: priceLabels.Professional,
              subtitle: "For growing apps",
              features: ["5M requests/mo", "10GB storage", "100 Collections", "Priority support"],
              cta: "Choose plan",
            },
          ].map((plan, idx) => (
            <div
              key={plan.name}
              className={`flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card ${idx === 1 ? "ring-2 ring-brand-600" : ""
                }`}
            >
              <div className="mb-4 space-y-1">
                <p className="text-sm font-semibold text-brand-600">{plan.name}</p>
                <p className="text-3xl font-bold text-slate-900">{plan.price}/mo</p>
                <p className="text-sm text-slate-600">{plan.subtitle}</p>
                {currentPlan === plan.name && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Current plan
                  </span>
                )}
              </div>
              <ul className="mb-6 space-y-2 text-sm text-slate-700">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-brand-600" />
                    {f}
                  </li>
                ))}
              </ul>
              {(() => {
                const planIndex = planOrder.indexOf(plan.name as any);
                const hasPlan = currentPlanIndex !== null && currentPlanIndex >= 0;
                const isHigherThanCurrent = hasPlan && planIndex > (currentPlanIndex ?? -1);
                const isCurrent = hasPlan && planIndex === currentPlanIndex;
                const isLower = hasPlan && planIndex < (currentPlanIndex ?? -1);

                if (isCurrent) {
                  return (
                    <div className="mt-auto rounded-lg border border-slate-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
                      This is your current plan
                    </div>
                  );
                }

                if (isLower) {
                  return (
                    <div className="mt-auto rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                      Included in your subscription
                    </div>
                  );
                }

                // No plan or upgrading to a higher tier
                return (
                  <button
                    onClick={() => startCheckout(plan.name as "Personal" | "Basic" | "Professional")}
                    disabled={loadingPlan === plan.name}
                    className={`mt-auto inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition ${idx === 1
                        ? "bg-brand-600 text-white hover:bg-brand-500"
                        : "border border-slate-200 text-slate-900 hover:bg-slate-50"
                      } ${loadingPlan === plan.name ? "opacity-70 cursor-not-allowed" : ""}`}
                  >
                    {loadingPlan === plan.name
                      ? "Redirecting..."
                      : hasPlan
                        ? "Upgrade"
                        : plan.cta}
                  </button>
                );
              })()}
            </div>
          ))}
        </div>
      </section>

      {showAuthModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-900">Almost there</h3>
            <p className="mt-2 text-sm text-slate-700">
              Please sign up or log in before choosing a plan.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href={selectedPlan ? `/register?plan=${encodeURIComponent(selectedPlan)}` : "/register"}
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500"
              >
                Create account
              </a>
              <a
                href={selectedPlan ? `/login?plan=${encodeURIComponent(selectedPlan)}` : "/login"}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Log in
              </a>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setSelectedPlan(null);
                }}
                className="text-sm font-medium text-slate-600 hover:text-slate-800"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Getting Started */}
      <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Getting Started
          </p>
          <h3 className="text-2xl font-bold text-slate-900">Start using InstantBackend</h3>
          <p className="text-slate-600">
            Get an API key, then use a prompt in Cursor or Claude—or integrate the SDK directly.
          </p>
        </div>

        <div className="space-y-4">
          <ol className="space-y-2 text-slate-800">
            <li>
              <span className="font-semibold">1. Get your API key:</span>{" "}
              {!isAuthenticated ? (
                <>
                  <a href="/register" className="text-brand-600 underline">
                    Sign up
                  </a>{" "}
                  to create your InstantBackend account and receive your API key.
                </>
              ) : (
                "You already have an account and API key."
              )}
            </li>
            <li>
              <span className="font-semibold">2. Use a prompt (recommended):</span> Go to{" "}
              <a href="/ai-prompts" className="text-brand-600 underline">
                Use this prompt
              </a>
              , copy the prompt for your stack (React, Flutter, Swift, Kotlin, Unity, Godot), and paste it into Cursor, Claude, or ChatGPT. The agent will use InstantBackend—no custom backend.
            </li>
            <li>
              <span className="font-semibold">3. Or install the SDK:</span>{" "}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">npm install instantbackend-sdk</code> and initialize with your API key from env (e.g. <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">NEXT_PUBLIC_INSTANTBACKEND_API_KEY</code>).
            </li>
          </ol>

          <p className="text-slate-700">
            Full examples and API reference:{" "}
            <a href="/docs" className="text-brand-600 underline">
              Docs
            </a>
            {" · "}
            <a href="/ai-prompts" className="text-brand-600 underline">
              AI prompts
            </a>
            .
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-slate-900 px-8 py-12 text-white shadow-card">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <h3 className="text-3xl font-bold">The backend built for AI-generated apps</h3>
          <p className="text-slate-300">
            One prompt. Auth, CRUD, and usage. No custom backend.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/ai-prompts"
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Use this prompt
            </a>
            <a
              href="/docs"
              className="rounded-lg border border-white/50 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              View docs
            </a>
            {!isAuthenticated && (
              <a
                href="/register"
                className="rounded-lg border border-white/50 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Get API key
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

