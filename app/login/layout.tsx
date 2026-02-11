import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
    description: "Sign in to your InstantBackend account to manage your projects and view analytics.",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
