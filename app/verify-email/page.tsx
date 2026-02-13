"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Mail } from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_INSTANTBACKEND_BASE_URL || "https://api.instantbackend.dev";

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("No verification token provided. Please check your email and click the verification link.");
            return;
        }

        // Call the backend API to verify the email
        fetch(`${API_BASE_URL}/verify-email?token=${token}`)
            .then(async (response) => {
                const data = await response.json();

                if (response.ok && data.success) {
                    setStatus("success");
                    setMessage(data.message || "Email verified successfully!");
                    setUsername(data.username || "");
                } else {
                    setStatus("error");
                    setMessage(data.error || data.message || "Failed to verify email. The link may be expired or invalid.");
                }
            })
            .catch((error) => {
                console.error("Verification error:", error);
                setStatus("error");
                setMessage("An error occurred while verifying your email. Please try again later.");
            });
    }, [searchParams]);

    const handleResendVerification = async () => {
        // TODO: Implement resend verification functionality
        alert("Please contact support or try registering again.");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">InstantBackend</h1>
                    <p className="text-slate-600 mt-2">Email Verification</p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2">
                            {status === "loading" && (
                                <>
                                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                    <span>Verifying...</span>
                                </>
                            )}
                            {status === "success" && (
                                <>
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    <span className="text-green-700">Verified!</span>
                                </>
                            )}
                            {status === "error" && (
                                <>
                                    <XCircle className="h-6 w-6 text-red-600" />
                                    <span className="text-red-700">Verification Failed</span>
                                </>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-center text-slate-700">
                            {message}
                        </p>

                        {status === "success" && (
                            <>
                                {username && (
                                    <p className="text-center text-sm text-slate-600">
                                        Welcome, <span className="font-semibold">{username}</span>!
                                    </p>
                                )}
                                <Button
                                    onClick={() => router.push("/login")}
                                    className="w-full"
                                >
                                    Go to Login
                                </Button>
                            </>
                        )}

                        {status === "error" && (
                            <div className="space-y-3">
                                <Button
                                    onClick={() => router.push("/register")}
                                    className="w-full"
                                    variant="default"
                                >
                                    Register New Account
                                </Button>
                                <Button
                                    onClick={() => router.push("/login")}
                                    className="w-full"
                                    variant="outline"
                                >
                                    Back to Login
                                </Button>
                            </div>
                        )}

                        {status === "loading" && (
                            <div className="flex justify-center">
                                <div className="text-sm text-slate-500">
                                    Please wait while we verify your email address...
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-6 text-center text-sm text-slate-600">
                    <p>
                        Need help? <a href="/support" className="text-blue-600 hover:underline">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-slate-600">Loading...</p>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
