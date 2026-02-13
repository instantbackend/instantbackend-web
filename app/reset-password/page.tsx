"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/InstantBackendClient";
import { validatePassword, getPasswordChecks } from "@/lib/passwordValidation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const passwordValidation = validatePassword(password);
  const passwordChecks = getPasswordChecks(password);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Missing reset token. Please request a new password reset link.");
      return;
    }

    if (!passwordValidation.valid) {
      setError(`Password does not meet security requirements: ${passwordValidation.errors.join(" ")}`);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({ token, password });
      setSuccess("Your password has been reset. You can now sign in.");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err?.message ?? "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">Set a new password</h1>
        <p className="text-slate-600">Choose a new password for your account.</p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                <p className="text-xs font-semibold text-slate-700">Password requirements</p>
                <ul className="mt-2 list-disc pl-4 text-xs text-slate-600">
                  {passwordChecks.map((check) => (
                    <li
                      key={check.label}
                      className={check.passed ? "text-emerald-700" : "text-slate-600"}
                    >
                      <span className="font-mono">{check.passed ? "[x]" : "[ ]"}</span>{" "}
                      {check.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                {success}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset password"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-slate-600 text-center">
            <a href="/login" className="text-brand-600 underline">
              Back to sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
