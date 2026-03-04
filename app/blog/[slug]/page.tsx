import Link from "next/link";
import { notFound } from "next/navigation";

const POSTS: Record<string, { title: string; description: string; date: string }> = {
  "cursor-instantbackend-fullstack": {
    title: "How to build a full-stack app with Cursor and InstantBackend",
    description: "From prompt to production in minutes using Cursor and InstantBackend.",
    date: "2025-03-01",
  },
  "best-backend-ai-generated-apps-2025": {
    title: "The best backend for AI-generated apps in 2025",
    description: "Why a single-instruction backend beats custom code for LLM-generated apps.",
    date: "2025-02-15",
  },
  "why-ai-agents-need-single-instruction-backend": {
    title: "Why AI coding agents need a single-instruction backend",
    description: "Minimal API surface and predictable responses for Cursor, Claude, and ChatGPT.",
    date: "2025-02-01",
  },
  "cursor-instantbackend-production": {
    title: "Cursor + InstantBackend: from prompt to production in minutes",
    description: "Step-by-step: prompt, API key, and deploy.",
    date: "2025-01-20",
  },
  "claude-instantbackend-auth-crud": {
    title: "Claude and InstantBackend: auth and CRUD without custom code",
    description: "Use Claude to generate your app; use InstantBackend for the backend.",
    date: "2025-01-10",
  },
  "instantbackend-vs-firebase-ai-apps": {
    title: "InstantBackend vs Firebase for AI-generated apps",
    description: "When to choose a minimal BaaS for LLM-generated code.",
    date: "2025-01-05",
  },
  "prompt-chatgpt-instantbackend-saas": {
    title: "How to prompt ChatGPT to use InstantBackend for your SaaS",
    description: "Copy-paste prompts that force ChatGPT to use InstantBackend.",
    date: "2024-12-20",
  },
  "flutter-ai-instantbackend": {
    title: "Building a Flutter app with AI and InstantBackend",
    description: "Flutter + InstantBackend prompt and setup.",
    date: "2024-12-10",
  },
  "unity-godot-game-backends": {
    title: "Unity and Godot: game backends without writing server code",
    description: "Use InstantBackend for scores, saves, and leaderboards from your game engine.",
    date: "2024-12-01",
  },
  "openapi-llms-minimal-apis": {
    title: "OpenAPI and LLMs: why minimal APIs win for code generation",
    description: "How small, consistent APIs improve LLM-generated integration code.",
    date: "2024-11-15",
  },
};

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl space-y-8">
      <header>
        <Link href="/blog" className="text-sm font-medium text-brand-600 hover:underline">
          ← Blog
        </Link>
        <time className="mt-2 block text-sm text-slate-500">{post.date}</time>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">{post.title}</h1>
        <p className="mt-3 text-lg text-slate-600">{post.description}</p>
      </header>

      <div className="prose prose-slate max-w-none">
        <p className="text-slate-700">
          This article will be published soon. In the meantime, use InstantBackend with your AI coding agent:
        </p>
        <ul className="list-disc pl-6 text-slate-700">
          <li>
            <Link href="/ai-prompts" className="text-brand-600 hover:underline">
              Copy a prompt for your stack
            </Link>{" "}
            (React, Flutter, Swift, Kotlin, Unity, Godot).
          </li>
          <li>
            <Link href="/docs" className="text-brand-600 hover:underline">
              Check the API reference
            </Link>{" "}
            and SDK examples.
          </li>
          <li>
            <Link href="/register" className="text-brand-600 hover:underline">
              Get your API key
            </Link>{" "}
            and set <code className="rounded bg-slate-100 px-1.5 py-0.5">INSTANTBACKEND_API_KEY</code> in your environment.
          </li>
        </ul>
      </div>

      <footer className="border-t border-slate-200 pt-6">
        <Link href="/blog" className="text-brand-600 font-medium hover:underline">
          ← Back to blog
        </Link>
      </footer>
    </article>
  );
}
