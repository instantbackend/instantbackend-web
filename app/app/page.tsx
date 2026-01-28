"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCollections } from "@/hooks/useCollections";
import { useUsage } from "@/hooks/useUsage";
import { useInstantBackend } from "@/contexts/instant-backend-context";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useQuery } from "@tanstack/react-query";

export default function DashboardPage() {
  useRequireAuth();
  const { bf, logout, apiKey: apiKeyFromToken, subscriptionStatus } = useInstantBackend();
  const router = useRouter();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<"Basic" | "Professional" | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const fallbackApiKey =
    process.env.NEXT_PUBLIC_INSTANTBACKEND_API_KEY || "API_KEY_NOT_CONFIGURED";
  const apiKey = apiKeyFromToken || fallbackApiKey;

  const formatPrice = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return "€0.00000";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numValue)) return "€0.00000";
    return `€${numValue.toFixed(5)}`;
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const { data: collections, isLoading: loadingCollections } = useCollections();
  const { data: usage, isLoading: loadingUsage } = useUsage();
  const planOrder: Array<"Personal" | "Basic" | "Professional"> = ["Personal", "Basic", "Professional"];
  const prices = {
    Personal: process.env.NEXT_PUBLIC_STRIPE_PRICE_PERSONAL || "",
    Basic: process.env.NEXT_PUBLIC_STRIPE_PRICE_BASIC || "price_1ScOvDQwusGQNJkIArSeN5js",
    Professional: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "price_1ScOxOQwusGQNJkIkVzMnm8m",
  };
  const planLimits = {
    Personal: parseInt(process.env.NEXT_PUBLIC_PLAN_LIMIT_PERSONAL || "10000", 10),
    Basic: parseInt(process.env.NEXT_PUBLIC_PLAN_LIMIT_BASIC || "50000", 10),
    Professional: parseInt(process.env.NEXT_PUBLIC_PLAN_LIMIT_PRO || "250000", 10),
  };
  const planStorageLimitsMb = {
    Personal: parseFloat(process.env.NEXT_PUBLIC_PLAN_STORAGE_PERSONAL || "1024"),
    Basic: parseFloat(process.env.NEXT_PUBLIC_PLAN_STORAGE_BASIC || "10240"),
    Professional: parseFloat(process.env.NEXT_PUBLIC_PLAN_STORAGE_PRO || "102400"),
  };

  const currentPlan = useMemo(() => {
    const subscriptionData = (subscriptionStatus as any)?.subscription || subscriptionStatus;
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
  }, [subscriptionStatus, prices]);

  const effectiveLimit = useMemo(() => {
    if (!usage) return null;
    // Priorizar el límite del plan desde variables de entorno si está disponible
    if (currentPlan && planLimits[currentPlan]) {
      return planLimits[currentPlan];
    }
    // Si no hay plan o no hay límite configurado, usar el del backend o default
    if (usage.limit) return usage.limit;
    return planLimits.Personal; // Default a Personal
  }, [usage, currentPlan, planLimits]);

  const effectiveStorageLimitBytes = useMemo(() => {
    if (!usage) return null;
    if (currentPlan && planStorageLimitsMb[currentPlan] !== undefined) {
      return Math.round(planStorageLimitsMb[currentPlan] * 1024 * 1024);
    }
    return Math.round(planStorageLimitsMb.Personal * 1024 * 1024);
  }, [usage, currentPlan, planStorageLimitsMb]);

  const usagePercent = useMemo(() => {
    if (!usage || !effectiveLimit) return 0;
    return Math.min(100, Math.round((usage.used / effectiveLimit) * 100));
  }, [usage, effectiveLimit]);

  const storagePercent = useMemo(() => {
    if (!usage?.storageBytes || !effectiveStorageLimitBytes) return 0;
    return Math.min(100, Math.round((usage.storageBytes / effectiveStorageLimitBytes) * 100));
  }, [usage, effectiveStorageLimitBytes]);

  const formatStorage = (bytes: number | null | undefined) => {
    if (bytes === null || bytes === undefined) return "N/A";
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    const kb = bytes / 1024;
    return `${kb.toFixed(2)} KB`;
  };

  const adminQuery = useQuery({
    queryKey: ["users", "admin"],
    queryFn: async () => {
      if (!bf) throw new Error("No hay instancia de InstantBackend");
      return bf.collection("users").where("role", "==", "admin").get();
    },
    enabled: Boolean(bf),
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey);
    } catch (error) {
      console.error("No se pudo copiar", error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleOpenCustomerPortal = async () => {
    if (!bf) return;
    setLoadingPortal(true);
    try {
      const returnUrl = window.location.origin + window.location.pathname;
      const data = await bf.createBillingPortalSession({ returnUrl });
      if (data?.url) {
        window.location.href = data.url as string;
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
    } finally {
      setLoadingPortal(false);
    }
  };

  const startCheckout = async (planName: "Basic" | "Professional") => {
    if (!bf) return;
    setCheckoutError(null);
    setLoadingPlan(planName);
    try {
      const priceId = prices[planName];
      if (!priceId) {
        setCheckoutError("Plan pricing is not configured.");
        return;
      }
      const successUrl =
        process.env.NEXT_PUBLIC_STRIPE_SUCCESS_URL ||
        `${window.location.origin}/checkout/success`;
      const cancelUrl =
        process.env.NEXT_PUBLIC_STRIPE_CANCEL_URL ||
        `${window.location.origin}/checkout/cancel`;
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
    } catch (error: any) {
      console.error("Error starting checkout:", error);
      setCheckoutError(error?.message ?? "Could not start checkout.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">
          Use the SDK to manage your collections and track usage.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My API Key</CardTitle>
              <CardDescription>Used to instantiate the SDK</CardDescription>
            </div>
            <Button variant="outline" onClick={handleCopy}>
              Copy
            </Button>
          </CardHeader>
          <CardContent>
            <code className="block truncate rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-800">
              {apiKey}
            </code>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Session</CardTitle>
              <CardDescription>JWT in memory</CardDescription>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sign out
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-700">
              The InstantBackend instance is initialized with the JWT stored in the
              cookie and context.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>Stripe subscription status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {subscriptionStatus ? (
              <>
                {subscriptionStatus.hasSubscription === false && (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-700">No active subscription.</p>
                    {checkoutError && (
                      <p className="text-sm text-red-600">{checkoutError}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => startCheckout("Basic")}
                        disabled={loadingPlan !== null}
                      >
                        {loadingPlan === "Basic" ? "Redirecting..." : "Upgrade to Basic"}
                      </Button>
                      <Button
                        onClick={() => startCheckout("Professional")}
                        disabled={loadingPlan !== null}
                      >
                        {loadingPlan === "Professional"
                          ? "Redirecting..."
                          : "Upgrade to Professional"}
                      </Button>
                    </div>
                  </div>
                )}
                {subscriptionStatus.hasSubscription !== false && (() => {
                  const sub = (subscriptionStatus as any)?.subscription || subscriptionStatus;
                  const status = sub?.status || sub?.state || subscriptionStatus?.status || "unknown";
                  const renewDateRaw =
                    sub?.current_period_end ||
                    sub?.currentPeriodEnd ||
                    subscriptionStatus?.current_period_end;
                  const renewDate =
                    renewDateRaw && !isNaN(Date.parse(renewDateRaw))
                      ? new Date(renewDateRaw).toLocaleString()
                      : renewDateRaw
                        ? new Date(Number(renewDateRaw) * 1000).toLocaleString()
                        : null;

                  return (
                    <>
                      <div className="flex flex-wrap gap-2 text-sm text-slate-800">
                        <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-800">
                          Status: {status}
                        </span>
                        {currentPlan && (
                          <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700">
                            Current plan: {currentPlan}
                          </span>
                        )}
                        {renewDate && (
                          <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                            Renews: {renewDate}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={handleOpenCustomerPortal}
                        disabled={loadingPortal}
                      >
                        {loadingPortal ? "Opening customer portal..." : "Manage billing"}
                      </Button>
                    </>
                  );
                })()}
              </>
            ) : (
              <p className="text-sm text-slate-700">
                No subscription info found. Log in or try refreshing.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Collections</CardTitle>
            <CardDescription>Retrieved via the SDK</CardDescription>
          </CardHeader>
          <CardContent>
              {loadingCollections && <p>Loading collections...</p>}
            {!loadingCollections && (
              <>
                {(!collections || collections.length === 0) ? (
                  <p className="text-sm text-slate-600">
                    No data has been saved to any collection yet. <a href="/docs" className="text-blue-500 underline">Learn more</a>
                  </p>
                ) : (
                  <div className="grid gap-2 md:grid-cols-2">
                    {collections.map((c) => (
                      <div
                        key={c.name}
                        className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{c.name}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                          collection
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>Usage summary and costs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {loadingUsage && <p>Loading usage...</p>}
            {!loadingUsage && usage && (
              <>
                <div className="flex justify-between text-sm text-slate-700">
                  <span>Requests</span>
                  <span>
                    {usage.used} / {effectiveLimit || usage.limit || "N/A"}
                  </span>
                </div>
                <Progress value={usagePercent} />
                <div className="flex justify-between text-sm text-slate-700">
                  <span>Storage</span>
                  <span>
                    {formatStorage(usage.storageBytes)} /{" "}
                    {formatStorage(effectiveStorageLimitBytes)}
                  </span>
                </div>
                <Progress value={storagePercent} />
                <div className="space-y-2 text-xs text-slate-700">
                  {usage.totalCost !== null && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total cost</span>
                      <span className="font-semibold">{formatPrice(usage.totalCost)}</span>
                    </div>
                  )}
                  {usage.costByAction && (
                    <div className="space-y-1">
                      <p className="text-slate-600 font-semibold">Cost by action</p>
                      <div className="space-y-1">
                        {Object.entries(usage.costByAction).map(([action, cost]) => (
                          <div
                            key={action}
                            className="flex justify-between rounded-md bg-slate-50 px-2 py-1 text-slate-700"
                          >
                            <span>{action}</span>
                            <span>{formatPrice(cost)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {usage.costByService && (
                    <div className="space-y-1">
                      <p className="text-slate-600 font-semibold">Cost by service</p>
                      <div className="space-y-1">
                        {Object.entries(usage.costByService).map(([service, cost]) => (
                          <div
                            key={service}
                            className="flex justify-between rounded-md bg-slate-50 px-2 py-1 text-slate-700"
                          >
                            <span>{service}</span>
                            <span>{formatPrice(cost)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {usage.period && (usage.period.startDate || usage.period.endDate) && (
                    <div className="space-y-1">
                      <p className="text-slate-600 font-semibold">Period</p>
                      <div className="flex justify-between rounded-md bg-slate-50 px-2 py-1 text-slate-700">
                        <span>From</span>
                        <span>{formatDate(usage.period.startDate)}</span>
                      </div>
                      <div className="flex justify-between rounded-md bg-slate-50 px-2 py-1 text-slate-700">
                        <span>To</span>
                        <span>{formatDate(usage.period.endDate)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* <Card>
          <CardHeader>
            <CardTitle>Filtered query example (React Query)</CardTitle>
            <CardDescription>
              bf.collection("users").where("role", "==", "admin").get()
            </CardDescription>
          </CardHeader>
        <CardContent className="space-y-3">
          <pre className="overflow-auto rounded-md bg-slate-900 p-3 text-sm text-slate-50">
{`const { data, isFetching } = useQuery({
  queryKey: ["users", "admins"],
  queryFn: () =>
    bf.collection("users").where("role", "==", "admin").get(),
  enabled: Boolean(bf),
});`}
          </pre>
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
              <p className="font-semibold text-slate-900">Admins fetched:</p>
              {adminQuery.isFetching && <p>Loading...</p>}
              {adminQuery.error && (
                <p className="text-red-600">Error: {(adminQuery.error as Error).message}</p>
              )}
              {adminQuery.data && (
                <pre className="mt-2 max-h-60 overflow-auto rounded bg-white p-2">
                  {JSON.stringify(adminQuery.data, null, 2)}
                </pre>
              )}
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}

