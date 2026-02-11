import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register",
    description: "Create an InstantBackend account to start building your backend in minutes.",
};

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
