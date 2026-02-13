"use client";

import { FormEvent, useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/lib/InstantBackendClient";
import { useInstantBackend } from "@/contexts/instant-backend-context";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useInstantBackend();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useInstantBackend();

  useEffect(() => {
    if (isAuthenticated) {
      const plan = searchParams.get("plan");
      if (plan) {
        router.replace(`/checkout/start?plan=${encodeURIComponent(plan)}`);
      } else {
        router.replace("/app");
      }
    }
  }, [isAuthenticated, router, searchParams]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { client, token } = await login(username, password);
      if (!token) throw new Error("JWT token was not received");
      setAuth(token, client);
      const plan = searchParams.get("plan");
      if (plan) {
        await router.push(`/checkout/start?plan=${encodeURIComponent(plan)}`);
      } else {
        await router.push("/app");
      }
    } catch (err: any) {
      // Check if it's an email verification error
      const errorMessage = err?.message ?? "Could not sign in";
      const isVerificationError = errorMessage.toLowerCase().includes("email not verified") ||
        errorMessage.toLowerCase().includes("verify your email");

      if (isVerificationError) {
        setError("Your email address has not been verified. Please check your inbox for the verification email, or request a new one below.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">InstantBackend</h1>
        <p className="text-slate-600">
          Sign in with your username and password to continue.
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-sm text-brand-600 underline">
                Forgot password?
              </a>
            </div>


            {error && (
              <div className="space-y-2">
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </p>
                {error.toLowerCase().includes("verified") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => router.push(`/resend-verification?email=${encodeURIComponent(username)}`)}
                  >
                    Resend Verification Email
                  </Button>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">InstantBackend</h1>
          <p className="text-slate-600">
            Sign in with your username and password to continue.
          </p>
        </div>
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-slate-600 text-center">Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
