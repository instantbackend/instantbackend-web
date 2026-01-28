"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBackendFlow } from "@/contexts/backend-flow-context";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, jwtToken, bf, subscriptionStatus, logout } = useBackendFlow();
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
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-indigo-600 to-purple-600 px-6 py-16 text-white shadow-card">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.08),transparent_35%)]" />
        <div className="relative mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-center">
          <div className="space-y-6 lg:w-1/2">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-100">
              InstantBackend · Simple BaaS
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Backend as a service without friction
            </h1>
            <p className="text-lg text-blue-50">
              Authenticate users, manage collections, and track usage with a lightweight SDK.
              Ship your backend in minutes.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              {!isAuthenticated && (
                <a
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-brand-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Create account
                </a>
              )}
              <a
                href="/docs"
                className="inline-flex items-center justify-center rounded-lg border border-white/70 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
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

const sdk = new InstantBackend("YOUR_API_KEY");

await sdk.login("user", "password");

await sdk.collection("tasks").add({
  title: "Send proposal",
  status: "open",
  priority: "high",
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

      {/* Features */}
      <section className="space-y-6">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Key capabilities
          </p>
          <h2 className="text-3xl font-bold text-slate-900">Everything essential, ready</h2>
          <p className="text-slate-600">
            Collections, auth, usage and payments ready to plug into your frontend.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Fast auth",
              desc: "Login via SDK with JWT in the response. No extra boilerplate.",
            },
            {
              title: "Simple queries",
              desc: "bf.collection(name).where().limit().get() with basic filters.",
            },
            {
              title: "Usage & limits",
              desc: "Usage endpoint ready for progress bars.",
            },
            {
              title: "Payments & subscriptions",
              desc: "createPaymentIntent and createSubscription exposed in the SDK.",
            },
            {
              title: "Serverless infra",
              desc: "Backend on AWS, auto-scaled and secure.",
            },
            {
              title: "Docs & Swagger",
              desc: "Public reference embedded at /docs with swagger-ui.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-card"
            >
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
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
              className={`flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card ${
                idx === 1 ? "ring-2 ring-brand-600" : ""
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
                    className={`mt-auto inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      idx === 1
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
            Follow these steps to authenticate, initialize the SDK, and begin building.
          </p>
        </div>

        <div className="space-y-4">
          <ol className="space-y-2 text-slate-800">
            <li>
              <span className="font-semibold">1. Register an account:</span>{" "}
              {!isAuthenticated ? (
                <>
                  <a href="/register" className="text-brand-600 underline">
                    Sign up here
                  </a>{" "}
                  to create your InstantBackend account.
                </>
              ) : (
                "You already have an account."
              )}
            </li>
            <li>
              <span className="font-semibold">2. Get your API Key:</span> After registering, you
              will receive your personal API key.
            </li>
            <li>
              <span className="font-semibold">3. Install the SDK:</span> Add the InstantBackend SDK to
              your project.
            </li>
          </ol>

          <pre className="overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-50 shadow-inner">
npm install instantbackend-sdk
          </pre>

          <div className="space-y-2">
            <p className="text-slate-800">
              <span className="font-semibold">4. Initialize the SDK:</span> Use your API key to
              initialize the SDK in your code.
            </p>
            <pre className="overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-50 shadow-inner">
{`import InstantBackend from 'instantbackend-sdk';

const backend = new InstantBackend('your-api-key');`}
            </pre>
          </div>

          <div className="space-y-2">
            <p className="text-slate-800 font-semibold">5. Login and start building!</p>
            <pre className="overflow-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-50 shadow-inner">
{`await backend.login('your-username', 'your-password');`}
            </pre>
          </div>

          <p className="text-slate-700">
            For more details, check the{" "}
              <a href="/docs" className="text-brand-600 underline">
              SDK Usage Examples
            </a>
            .
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-3xl bg-slate-900 px-8 py-12 text-white shadow-card">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
          <h3 className="text-3xl font-bold">Ready to try InstantBackend</h3>
          <p className="text-slate-300">
            Authenticate, query collections, and track usage with one SDK.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/login"
              className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Go to login
            </a>
            <a
              href="/docs"
              className="rounded-lg border border-white/50 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              View docs
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

