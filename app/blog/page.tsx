import Link from "next/link";

export const metadata = {
  title: "Blog",
  description: "Articles on building apps with AI coding agents and InstantBackend. Cursor, Claude, ChatGPT, and backend for AI-generated apps.",
};

const POSTS: { slug: string; title: string; description: string; date: string }[] = [
  {
    slug: "cursor-instantbackend-fullstack",
    title: "How to build a full-stack app with Cursor and InstantBackend",
    description: "From prompt to production in minutes using Cursor and InstantBackend.",
    date: "2025-03-01",
  },
  {
    slug: "best-backend-ai-generated-apps-2025",
    title: "The best backend for AI-generated apps in 2025",
    description: "Why a single-instruction backend beats custom code for LLM-generated apps.",
    date: "2025-02-15",
  },
  {
    slug: "why-ai-agents-need-single-instruction-backend",
    title: "Why AI coding agents need a single-instruction backend",
    description: "Minimal API surface and predictable responses for Cursor, Claude, and ChatGPT.",
    date: "2025-02-01",
  },
  {
    slug: "cursor-instantbackend-production",
    title: "Cursor + InstantBackend: from prompt to production in minutes",
    description: "Step-by-step: prompt, API key, and deploy.",
    date: "2025-01-20",
  },
  {
    slug: "claude-instantbackend-auth-crud",
    title: "Claude and InstantBackend: auth and CRUD without custom code",
    description: "Use Claude to generate your app; use InstantBackend for the backend.",
    date: "2025-01-10",
  },
  {
    slug: "instantbackend-vs-firebase-ai-apps",
    title: "InstantBackend vs Firebase for AI-generated apps",
    description: "When to choose a minimal BaaS for LLM-generated code.",
    date: "2025-01-05",
  },
  {
    slug: "prompt-chatgpt-instantbackend-saas",
    title: "How to prompt ChatGPT to use InstantBackend for your SaaS",
    description: "Copy-paste prompts that force ChatGPT to use InstantBackend.",
    date: "2024-12-20",
  },
  {
    slug: "flutter-ai-instantbackend",
    title: "Building a Flutter app with AI and InstantBackend",
    description: "Flutter + InstantBackend prompt and setup.",
    date: "2024-12-10",
  },
  {
    slug: "unity-godot-game-backends",
    title: "Unity and Godot: game backends without writing server code",
    description: "Use InstantBackend for scores, saves, and leaderboards from your game engine.",
    date: "2024-12-01",
  },
  {
    slug: "openapi-llms-minimal-apis",
    title: "OpenAPI and LLMs: why minimal APIs win for code generation",
    description: "How small, consistent APIs improve LLM-generated integration code.",
    date: "2024-11-15",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section>
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
          Blog
        </p>
        <h1 className="mt-2 text-4xl font-bold text-slate-900">
          AI agents and backend
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          How to build apps with Cursor, Claude, and ChatGPT using InstantBackend. No custom backend.
        </p>
      </section>

      <ul className="space-y-6 border-t border-slate-200 pt-8">
        {POSTS.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block rounded-xl border border-slate-200 bg-white p-5 shadow-card transition hover:border-brand-200 hover:shadow-md"
            >
              <time className="text-sm text-slate-500">{post.date}</time>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {post.title}
              </h2>
              <p className="mt-2 text-slate-600">{post.description}</p>
              <span className="mt-2 inline-block text-sm font-medium text-brand-600">
                Read more →
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-center text-sm text-slate-500">
        <Link href="/ai-prompts" className="text-brand-600 hover:underline">
          Use this prompt
        </Link>
        {" · "}
        <Link href="/docs" className="text-brand-600 hover:underline">
          Docs
        </Link>
      </p>
    </div>
  );
}
