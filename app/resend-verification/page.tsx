"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle2 } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_INSTANTBACKEND_BASE_URL || "https://api.instantbackend.dev";

function ResendVerificationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/resend-verification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(true);
            } else {
                setError(data.error || "Failed to resend verification email. Please try again.");
            }
        } catch (err) {
            console.error("Resend verification error:", err);
            setError("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">InstantBackend</h1>
                    <p className="text-slate-600 mt-2">Resend Verification Email</p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Verify Your Email
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!success ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <p className="text-sm text-slate-600">
                                    Enter your email address and we'll send you a new verification link.
                                </p>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                                        {error}
                                    </p>
                                )}

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Sending..." : "Resend Verification Email"}
                                </Button>

                                <div className="text-center pt-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => router.push("/login")}
                                        className="text-sm"
                                    >
                                        Back to Login
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4 text-center">
                                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
                                <div>
                                    <h3 className="font-semibold text-lg text-slate-900">Email Sent!</h3>
                                    <p className="text-sm text-slate-600 mt-2">
                                        We've sent a new verification email to <strong>{email}</strong>.
                                        Please check your inbox and click the verification link.
                                    </p>
                                </div>
                                <Button
                                    onClick={() => router.push("/login")}
                                    className="w-full"
                                >
                                    Go to Login
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-6 text-center text-sm text-slate-600">
                    <p>
                        Didn't receive the email? Check your spam folder or{" "}
                        <a href="/support" className="text-blue-600 hover:underline">
                            contact support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ResendVerificationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        }>
            <ResendVerificationContent />
        </Suspense>
    );
}
