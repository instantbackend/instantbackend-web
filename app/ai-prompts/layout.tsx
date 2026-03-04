import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Use this prompt",
  description: "Production-ready prompts for Cursor, Claude, and ChatGPT. React, Flutter, Swift, Kotlin, Unity, Godot. Use InstantBackend—no custom backend.",
  openGraph: {
    title: "Use this prompt | InstantBackend",
    description: "Copy the prompt for your stack. Paste into Cursor, Claude, or ChatGPT. The agent will use InstantBackend.",
  },
};

export default function AiPromptsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
